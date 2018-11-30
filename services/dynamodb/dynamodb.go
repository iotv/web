package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

type Service interface {
	CreateUserWithEmailAndPassword(ctx context.Context, emailAddress, userName, hashedPassword string) (*User, error)
}

type config struct {
	authenticationsTable string
	usersTable           string
	dynamodb             *dynamodb.DynamoDB
}

func NewService() (Service, error) {
	// FIXME: handle error
	sess, _ := session.NewSession()

	return &config{
		dynamodb: dynamodb.New(sess),
	}, nil
}
