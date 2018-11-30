package main

import (
	"context"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	awsS3 "github.com/aws/aws-sdk-go/service/s3"
	"gitlab.com/iotv/services/iotv-api/services/database"
	"gitlab.com/iotv/services/iotv-api/services/elastictranscoder"
	"gitlab.com/iotv/services/iotv-api/services/logger"
	"gitlab.com/iotv/services/iotv-api/services/s3"
	"net/url"
	"os"
	"path"
	"sync"
)

type Response struct {
	Message string `json:"message"`
}

type handler struct {
	DB        database.Database
	ETService elastictranscoder.Service
	Logger    logger.Logger
	S3Service s3.Service
}

func (h *handler) OnVideoTranscodingComplete(ctx context.Context, e events.SNSEvent) (Response, error) {
	var s3Sync sync.WaitGroup
	for _, record := range e.Records {
		s3Sync.Add(1)
		go func(record events.SNSEventRecord) {
			// Ensure we count down after we close
			defer s3Sync.Done()

			var etEvent elastictranscoder.ETEvent
			h.S3Service.ListObjectPagesFromPrefix(ctx, etEvent.OutputKeyPrefix, func(response *awsS3.ListObjectsV2Output, isLastPage bool) bool {
				for _, object := range response.Contents {
					s3Sync.Add(1)
					go func(object *awsS3.Object) {
						// Ensure we count down after we close
						defer s3Sync.Done()

						objectUrl := url.URL{
							Scheme: "https",
							Host:   "s3.amazonaws.com",
							Path:   path.Join(os.Getenv("TRANSCODING_BUCKET")),
						}
						if _, err := h.DB.CreateVideoSegment(ctx, objectUrl.String(), aws.String(etEvent.Outputs[0].Key)); err != nil {
							// FIXME: handle error
						}
					}(object)
				}
				return isLastPage
			})

		}(record)
	}
	s3Sync.Wait()
	return Response{Message: "Complete"}, nil
}

func main() {
	log := logger.NewLogger()
	db, _ := database.NewDatabase()
	et, _ := elastictranscoder.NewService()
	s3Svc, _ := s3.NewService()
	h := handler{
		DB:        db,
		ETService: et,
		Logger:    log,
		S3Service: s3Svc,
	}
	lambda.Start(h.OnVideoTranscodingComplete)
}
