package utilities

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/argon2"
	"io"
	"os"
	"strings"
	"regexp"
)

// Argon2 settings
const (
	// The current recommended time value for interactive login.
	RecommendedTime uint32 = 4
	// The current recommended memory for interactive login.
	RecommendedMemory uint32 = 32 * 1024
	// The current recommended number of threads for interactive login.
	RecommendedThreads uint8 = 4
	// The recommended salt length
	RecommendedSaltSize uint8 = 16
)

// Password Policy settings
const (
	MinimumPasswordLength int = 8
)

var (
	InvalidEncodedPassword = fmt.Sprintf("$argon2i$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, RecommendedMemory, RecommendedTime, RecommendedThreads, "QQ", "QQ")
	EmailValidationRegex = regexp.MustCompile(".+@.+")
)

// Errors
var (
	InvalidEmailError = errors.New("invalid email")
	MalformedToken = errors.New("token is missing user_id in sub")
	PasswordTooShortError = fmt.Errorf("password is too short. must be at least %d characters", MinimumPasswordLength)
	UserNotAuthenticated = errors.New("not authenticated")
)

func GetUserIdFromContextJwt(ctx context.Context) (string, error) {
	possiblyToken := ctx.Value("jwt")
	if possiblyToken == nil {
		// FIXME: figure out what to do with this
		return "", UserNotAuthenticated
	}
	token := possiblyToken.(*jwt.Token)
	if sub, ok := token.Claims.(jwt.MapClaims)["sub"]; ok && token.Valid {
		return sub.(string), nil
	} else {
		return "", MalformedToken
	}
}

func HashPassword(password string) (*string, error) {
	passwordB := []byte(password)

	salt := make([]byte, RecommendedSaltSize)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return nil, err
	}

	hash := argon2.Key(passwordB, salt, RecommendedTime, RecommendedMemory, RecommendedThreads, 32)

	hstr := base64.RawStdEncoding.EncodeToString(hash)
	sstr := base64.RawStdEncoding.EncodeToString(salt)

	encoded := fmt.Sprintf("$argon2i$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, RecommendedMemory, RecommendedTime, RecommendedThreads, sstr, hstr)
	return &encoded, nil
}

func SignJWT(userId string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims{
		"sub": userId,
		"aud": "iotv-api",
	})

	secret := os.Getenv("JWT_SECRET")
	return token.SignedString([]byte(secret))
}

func ValidateJWTForContext(ctx context.Context, request events.APIGatewayProxyRequest) (context.Context, error) {
	if authHeader, ok := request.Headers["Authorization"]; ok == false {
		return ctx, nil
	} else {
		maybeToken := strings.TrimPrefix(authHeader, "Bearer ")
		if token, err := jwt.Parse(maybeToken, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		}); err != nil {
			return ctx, err
		} else {
			return context.WithValue(ctx, "jwt", token), nil
		}
	}
}

func ValidateEmailString(email string) error {
	// This is a super basic regex to validate we can even attempt to send an email
	// A transactional email and database flag are used to test that the user can receive messages
	if match := EmailValidationRegex.MatchString(email); !match {
		return InvalidEmailError
	}
	// Success
	return nil
}

func ValidatePassword(password, encodedPassword string) error {
	// Split hash into parts
	part := strings.Split(encodedPassword, "$")

	// FIXME
	//// Get & Check Version
	//hashVersion, _ := strconv.Atoi(strings.Trim(part[2], "v="))
	//
	//// Verify version is not greater than current version or less than 0
	//if hashVersion > argon2.Version || hashVersion < 0 {
	//	return ErrVersion
	//}

	// Get salt
	salt, err := base64.RawStdEncoding.DecodeString(part[4])
	if err != nil {
		//return ErrDecodingSalt
		return errors.New("error decoding salt")
	}

	// Generate hash for comparison using user input with stored parameters
	comparisonHash := base64.RawStdEncoding.EncodeToString(argon2.Key([]byte(password), salt, RecommendedTime, RecommendedMemory, RecommendedThreads, 32))
	if err != nil {
		return fmt.Errorf("unable to generate hash for comparison using inputs, error: %s", err)
	}

	if part[5] == comparisonHash {
		return nil
	} else {
		return errors.New("hashes don't match")
	}
}

func ValidatePasswordPolicy(password string) error {
	if len(password) < 8 {
		return PasswordTooShortError
	}

	// Success
	return nil
}
