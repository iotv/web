package source_video_encoder

import (
	"context"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/mediaconvert"
	"os"
)

type Service interface {
	CreateJob(ctx context.Context, bucket, objectKey string) (*string, error)
}

type config struct {
	jobTemplate  string
	mediaConvert *mediaconvert.MediaConvert
}

func NewService() (Service, error) {
	// FIXME: handle error
	sess, _ := session.NewSession()

	return &config{
		jobTemplate:  os.Getenv("JOB_TEMPLATE"),
		mediaConvert: mediaconvert.New(sess),
	}, nil
}

func (c *config) CreateJob(ctx context.Context, bucket, objectKey string) (*string, error) {
	if output, err := c.mediaConvert.CreateJobWithContext(ctx, &mediaconvert.CreateJobInput{
		JobTemplate: aws.String(c.jobTemplate),
	}); err != nil {
		return nil, err
	} else {
		return output.Job.Id, nil
	}
}
