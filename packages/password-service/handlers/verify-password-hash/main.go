package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"github.com/aws/aws-lambda-go/lambda"
	"golang.org/x/crypto/argon2"
	"strconv"
	"strings"
	"time"
)

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

type VerifyPasswordHashEvent struct {
	Password     string `json:"password"`
	PasswordHash string `json:"passwordHash"`
}

type VerifyPasswordHashResult struct {
	IsValid bool `json:"isValid"`
}

type hashParts struct {
	Algorithm string
	Version   int
	Memory    uint32
	Time      uint32
	Threads   uint8
	Salt      []byte
	Hash      []byte
}

func parsePasswordHashInNormalizedTime(hash string) (hashParts, bool) {
	parts := strings.Split(hash, "$")

	t0 := time.Now()
	t1 := t0.Add(10 * time.Millisecond)


	if len(parts) == 6 {
		algorithmString := parts[1]
		versionString := parts[2]
		paramsString := parts[3]
		saltString := parts[4]
		hashString := parts[5]

		version, err := strconv.Atoi(strings.Trim(versionString, "v="))
		if err == nil {
			params := strings.Split(paramsString, ",")
			if len(params) == 3 {
				memory, memErr := strconv.Atoi(strings.Trim(params[0], "m="))
				time2, timeErr := strconv.Atoi(strings.Trim(params[1], "t="))
				threads, threadErr := strconv.Atoi(strings.Trim(params[2], "p="))
				if memErr == nil && timeErr == nil && threadErr == nil {
					salt, err := base64.RawStdEncoding.DecodeString(saltString)
					if err == nil {
						hash, err := base64.RawStdEncoding.DecodeString(hashString)
						if err == nil {
							// Ensure this always takes 10 milliseconds
							now := time.Now()
							sleepDur := t1.Sub(now)
							time.Sleep(sleepDur)
							return hashParts{
								Algorithm: algorithmString,
								Version:   version,
								Memory:    uint32(memory),
								Time:      uint32(time2),
								Threads:   uint8(threads),
								Salt:      salt,
								Hash:      hash,
							}, true
						}
					}
				}
			}
		}
	}
	// Ensure this always takes 10 milliseconds
	now := time.Now()
	sleepDur := t1.Sub(now)
	time.Sleep(sleepDur)
	return hashParts{
		Algorithm: "argon2id",
		Version:   argon2.Version,
		Memory:    RecommendedMemory,
		Time:      RecommendedTime,
		Threads:   RecommendedThreads,
		Salt:      make([]byte, RecommendedSaltLength), // All zeroes, doesn't matter if by some miracle this matches
		Hash:      make([]byte, RecommendedKeyLength), // All zeroes, doesn't matter if by some miracle this matches
	}, false
}

// FIXME: decode an incorrect-format password hash in normalized time with a correct-format hash
func VerifyPasswordHash(_ context.Context, e VerifyPasswordHashEvent) (*VerifyPasswordHashResult, error) {
	parts, isHashValid := parsePasswordHashInNormalizedTime(e.PasswordHash)
	passwordB := []byte(e.Password)

	comparisonHash := argon2.IDKey(passwordB, parts.Salt, parts.Time, parts.Memory, parts.Threads, uint32(len(parts.Hash)))
	doesHashMatch := bytes.Compare(parts.Hash, comparisonHash) == 0

	return &VerifyPasswordHashResult{IsValid: isHashValid && doesHashMatch}, nil
}

func main() {
	lambda.Start(VerifyPasswordHash)
}
