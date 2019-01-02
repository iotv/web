package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws/session"
	awsDynamoDB "github.com/aws/aws-sdk-go/service/dynamodb"
	"os"
)

type Service interface {
	CreateSourceVideo(ctx context.Context, ownerUserId *string) (*SourceVideo, error)
	CreateVideoSegment(ctx context.Context, videoSegmentId string, originatingSourceVideoId *string) (*VideoSegment, error)
	GetSourceVideoById(ctx context.Context, id string) (*SourceVideo, error)
	GetSourceVideosByOwnerUserId(ctx context.Context, ownerId string) ([]*SourceVideo, error)
	UpdateSourceVideoIsFullyUploaded(ctx context.Context, sourceVideoId string, isFullyUploaded bool) error
}

type config struct {
	sourceVideosTable         string
	usersTable                string
	dynamoDB                  *awsDynamoDB.DynamoDB
}

func NewService() (Service, error) {
	// FIXME: handle error
	sess, _ := session.NewSession()

	return &config{
		sourceVideosTable:         os.Getenv("SOURCE_VIDEOS_TABLE"),
		dynamoDB:                  awsDynamoDB.New(sess),
	}, nil
}
