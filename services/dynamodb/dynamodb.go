package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

type Service interface {
	CreateUserWithEmailAndPassword(ctx context.Context, emailAddress, userName, hashedPassword string) (*User, error)
	CreateVideoSegment(ctx context.Context, videoSegmentId string, originatingSourceVideoId *string) (*VideoSegment, error)
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
		dynamoDB: dynamodb.New(sess),
	}, nil
}
