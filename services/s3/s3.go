package s3

import (
	awsS3 "github.com/aws/aws-sdk-go/service/s3"
	"context"
)

type Service interface {
	ListObjectPagesFromPrefix(ctx context.Context, prefix string, fn func(*awsS3.ListObjectsV2Output, bool) bool) error
}

type config struct {
	s3 awsS3.S3
}

func (c *config) ListObjectPagesFromPrefix(ctx context.Context, prefix string, fn func(*awsS3.ListObjectsV2Output, bool) bool) error {
	return c.s3.ListObjectsV2PagesWithContext(ctx, &awsS3.ListObjectsV2Input{}, fn)
}

func NewService() (Service, error) {
	return &config{}, nil
}
