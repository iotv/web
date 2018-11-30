package kms

import (
	"github.com/aws/aws-sdk-go/service/kms"
	"github.com/dgrijalva/jwt-go"
)

type Service interface {
}

type config struct {
	jwtKeyArn    string
	kmsSvc       *kms.KMS
	kmsJWTSigner *KMSJWTSigner
}

func NewService() (Service, error) {
	return &config{}, nil
}

type KMSJWTSigner struct {
	kmsSvc *kms.KMS
}

func (k *KMSJWTSigner) Alg() string {
	return "AWSKMS"
}

func (k *KMSJWTSigner) Sign(signingString string, key interface{}) (string, error) {
	return "", nil
}

func (k *KMSJWTSigner) Verify(signingString, signature string, key interface{}) error {
	return nil
}

func (c *config) SignJWT(userId string) (string, error) {
	token := jwt.NewWithClaims(c.kmsJWTSigner, jwt.MapClaims{
		"sub": userId,
		"aud": "iotv-api",
	})

	return token.SignedString(c.jwtKeyArn)
}
