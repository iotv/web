package utilities

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/argon2"
	"io"
	"os"
)

// The current recommended time value for interactive logins.
const RecommendedTime uint32 = 4

// The current recommended memory for interactive logins.
const RecommendedMemory uint32 = 32 * 1024

// The current recommended number of threads for interactive logins.
const RecommendedThreads uint8 = 4

const RecommendedSaltSize uint8 = 16

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
