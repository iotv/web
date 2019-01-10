package s3

import (
	"context"
	"errors"
	"github.com/aws/aws-sdk-go/aws"
	awsS3 "github.com/aws/aws-sdk-go/service/s3"
	"io"
	"strconv"
	"time"
)

var (
	CannotSignURLError = errors.New("cannot sign url")
)

func (c *config) GetPresignedSourceVideoDownloadUrl(sourceVideoId string, ownerUserId *string) (*string, error) {
	request, _ := c.s3.GetObjectRequest(&awsS3.GetObjectInput{
		Bucket: aws.String(c.sourceVideoBucket),
		Key:    aws.String("users/" + *ownerUserId + "/source-videos/" + sourceVideoId),
	})

	if url, err := request.Presign(5 * time.Minute); err != nil {
		return nil, CannotSignURLError
	} else {
		return &url, nil
	}
}

func (c *config) GetPresignedSourceVideoUploadUrl(sourceVideoId string, ownerUserId *string) (*string, error) {
	request, _ := c.s3.PutObjectRequest(&awsS3.PutObjectInput{
		Bucket: aws.String(c.sourceVideoBucket),
		Key:    aws.String("users/" + *ownerUserId + "/source-videos/" + sourceVideoId),
	})

	if url, err := request.Presign(5 * time.Minute); err != nil {
		return nil, CannotSignURLError
	} else {
		return &url, nil
	}
}

func (c *config) GetSourceVideoChunk(ctx context.Context, sourceVideoId string, ownerUserId *string) (io.Reader, error) {
	if output, err := c.s3.GetObjectWithContext(ctx, &awsS3.GetObjectInput{
		Bucket: aws.String(c.sourceVideoBucket),
		Range:  aws.String("bytes=" + strconv.Itoa(0) + "-" + strconv.Itoa(1024*1024)),
		Key:    aws.String("users/" + *ownerUserId + "/source-videos/" + sourceVideoId),
	}); err != nil {
		return nil, err
	} else {
		return output.Body, err
	}
}
