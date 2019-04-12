package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"errors"
	"github.com/aws/aws-lambda-go/lambda"
	"golang.org/x/crypto/argon2"
	"strconv"
	"strings"
)

type VerifyPasswordHashEvent struct {
	Password     string `json:"password"`
	PasswordHash string `json:"passwordHash"`
}

type VerifyPasswordHashResult struct {
	IsValid bool `json:"isValid"`
}

func VerifyPasswordHash(_ context.Context, e VerifyPasswordHashEvent) (*VerifyPasswordHashResult, error) {
	part := strings.Split(e.PasswordHash, "$")
	passwordB := []byte(e.Password)

	algorithm := part[1]
	version, err := strconv.Atoi(strings.Trim(part[2], "v="))
	if err != nil && version != argon2.Version && algorithm != "argon2id" {
		return nil, errors.New("wrong version")
	}

	params := strings.Split(part[3], ",")
	memory, _ := strconv.Atoi(strings.Trim(params[0], "m="))
	time, _ := strconv.Atoi(strings.Trim(params[1], "t="))
	threads, _ := strconv.Atoi(strings.Trim(params[2], "p="))

	salt, err := base64.RawStdEncoding.DecodeString(part[4])
	if err != nil {
		return nil, errors.New("error decoding salt")
	}
	hash, _ := base64.RawStdEncoding.DecodeString(part[5])

	comparisonHash := argon2.IDKey(passwordB, salt, uint32(time), uint32(memory), uint8(threads), uint32(len(hash)))

	isValid := bytes.Compare(hash, comparisonHash) == 0

	return &VerifyPasswordHashResult{IsValid: isValid}, nil
}

func main() {
	lambda.Start(VerifyPasswordHash)
}
