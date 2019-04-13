package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"golang.org/x/crypto/argon2"
	"io"
)

type CreatePasswordHashEvent struct {
	Password string `json:"password"`
}

type CreatePasswordHashResult struct {
	PasswordHash string `json:"passwordHash"`
}

// Argon2 settings
const (
	// The current recommended time value for interactive login.
	RecommendedTime uint32 = 1
	// The current recommended memory for interactive login.
	RecommendedMemory uint32 = 64 * 1024
	// The current recommended number of threads for interactive login.
	RecommendedThreads uint8 = 4
	// The recommended salt length
	RecommendedSaltLength uint32 = 64
	// The recommended key length
	RecommendedKeyLength uint32 = 64
)

func CreatePasswordHash(_ context.Context, e CreatePasswordHashEvent) (*CreatePasswordHashResult, error) {
	passwordB := []byte(e.Password)

	salt := make([]byte, RecommendedSaltLength)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return nil, err
	}

	hash := argon2.IDKey(passwordB, salt, RecommendedTime, RecommendedMemory, RecommendedThreads, RecommendedKeyLength)

	hstr := base64.RawStdEncoding.EncodeToString(hash)
	sstr := base64.RawStdEncoding.EncodeToString(salt)

	encoded := fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, RecommendedMemory, RecommendedTime, RecommendedThreads, sstr, hstr)
	return &CreatePasswordHashResult{HashString: encoded}, nil
}

func main() {
	lambda.Start(CreatePasswordHash)
}
