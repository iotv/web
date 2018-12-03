package s3

import (
	"context"
	"github.com/aws/aws-sdk-go/aws/session"
	awsS3 "github.com/aws/aws-sdk-go/service/s3"
	"os"
)

type Service interface {
	GetPresignedSourceVideoDownloadUrl(sourceVideoId string, ownerUserId *string) (*string, error)
	GetPresignedSourceVideoUploadUrl(sourceVideoId string, ownerUserId *string) (*string, error)
	ListObjectPagesFromPrefix(ctx context.Context, prefix string, fn func(*awsS3.ListObjectsV2Output, bool) bool) error
}

type config struct {
	sourceVideoBucket string
	s3                *awsS3.S3
}

func (c *config) ListObjectPagesFromPrefix(ctx context.Context, prefix string, fn func(*awsS3.ListObjectsV2Output, bool) bool) error {
	return c.s3.ListObjectsV2PagesWithContext(ctx, &awsS3.ListObjectsV2Input{}, fn)
}

func NewService() (Service, error) {
	// FIXME: handle error
	sess, _ := session.NewSession()

	return &config{
		sourceVideoBucket: os.Getenv("SOURCE_VIDEO_BUCKET"),
		s3:                awsS3.New(sess),
	}, nil
}
