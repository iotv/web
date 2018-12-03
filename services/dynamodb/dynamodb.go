package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws/session"
	awsDynamoDB "github.com/aws/aws-sdk-go/service/dynamodb"
	"os"
)

type Service interface {
	CreateSourceVideo(ctx context.Context, ownerUserId *string) (*SourceVideo, error)
	CreateUserWithEmailAndPassword(ctx context.Context, emailAddress, userName, hashedPassword string) (*User, error)
	CreateVideoSegment(ctx context.Context, videoSegmentId string, originatingSourceVideoId *string) (*VideoSegment, error)
	GetEmailAuthenticationByEmail(ctx context.Context, emailAddress string) (*EmailAuthentication, error)
	GetSourceVideoById(ctx context.Context, id string) (*SourceVideo, error)
	GetUserById(ctx context.Context, id string) (*User, error)
	UpdateSourceVideoIsFullyUploaded(ctx context.Context, sourceVideoId string, isFullyUploaded bool) error
}

type config struct {
	emailAuthenticationsTable string
	sourceVideosTable         string
	usersTable                string
	dynamoDB                  *awsDynamoDB.DynamoDB
}

func NewService() (Service, error) {
	// FIXME: handle error
	sess, _ := session.NewSession()

	return &config{
		emailAuthenticationsTable: os.Getenv("EMAIL_AUTHENTICATIONS_TABLE"),
		sourceVideosTable:         os.Getenv("SOURCE_VIDEOS_TABLE"),
		usersTable:                os.Getenv("USERS_TABLE"),
		dynamoDB:                  awsDynamoDB.New(sess),
	}, nil
}
