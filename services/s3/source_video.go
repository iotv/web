package s3

import (
	"errors"
	"github.com/aws/aws-sdk-go/aws"
	awsS3 "github.com/aws/aws-sdk-go/service/s3"
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
