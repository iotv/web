package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"os"
)

type Service interface {
	CreateUserWithEmailAndPassword(ctx context.Context, emailAddress, userName, hashedPassword string) (*User, error)
	CreateVideoSegment(ctx context.Context, videoSegmentId string, originatingSourceVideoId *string) (*VideoSegment, error)
	GetEmailAuthenticationByEmail(ctx context.Context, emailAddress string) (*EmailAuthentication, error)
	GetUserById(ctx context.Context, id string) (*User, error)
	UpdateSourceVideoIsFullyUploaded(ctx context.Context, sourceVideoId string, isFullyUploaded bool) error
}

type config struct {
	emailAuthenticationsTable string
	usersTable                string
	dynamoDB                  *dynamodb.DynamoDB
}

func NewService() (Service, error) {
	// FIXME: handle error
	sess, _ := session.NewSession()

	return &config{
		emailAuthenticationsTable: os.Getenv("EMAIL_AUTHENTICATIONS_TABLE"),
		usersTable:                os.Getenv("USERS_TABLE"),
		dynamoDB:                  dynamodb.New(sess),
	}, nil
}
