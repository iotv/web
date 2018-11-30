package main

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/lucsky/cuid"
	"gitlab.com/iotv/services/iotv-api/services/database"
	"gitlab.com/iotv/services/iotv-api/services/elastictranscoder"
	"gitlab.com/iotv/services/iotv-api/services/logger"
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
}

func (h *handler) OnVideoUploadComplete(ctx context.Context, e events.SNSEvent) (Response, error) {
	var s3Sync sync.WaitGroup
	for _, record := range e.Records {
		s3Sync.Add(1)
		go func(record events.SNSEventRecord) {
			// Ensure we count down after we close
			defer s3Sync.Done()

			var s3Event events.S3Event
			if err := json.Unmarshal([]byte(record.SNS.Message), &s3Event); err == nil {
				for _, s3Record := range s3Event.Records {
					s3Sync.Add(1)
					go func(s3Record events.S3EventRecord) {
						defer s3Sync.Done()

						_, videoId := path.Split(s3Record.S3.Object.Key)
						if err := h.DB.UpdateSourceVideoIsFullyUploaded(ctx, videoId, true); err != nil {
							// FIXME handle error
						}
						// FIXME: capture response
						if _, err := h.ETService.CreateJob(ctx, s3Record.S3.Object.Key, cuid.New()); err != nil {
							// FIXME handle error
						} else {
							// FIXME handle response
						}
					}(s3Record)
				}
			}
		}(record)
	}
	s3Sync.Wait()
	return Response{Message: "Complete"}, nil
}

func main() {
	log := logger.NewLogger()
	db, _ := database.NewDatabase()
	et, _ := elastictranscoder.NewService()
	h := handler{
		DB:        db,
		ETService: et,
		Logger:    log,
	}
	lambda.Start(h.OnVideoUploadComplete)
}
