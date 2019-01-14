package main

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	iotvEvents "github.com/iotv/iotv/lib/events"
	"github.com/iotv/iotv/lib/services/dynamodb"
	"github.com/iotv/iotv/lib/services/logger"
	"github.com/iotv/iotv/lib/services/sfn"
	"path"
	"os"
)

type handler struct {
	DynamoDBService dynamodb.Service
	SfnService      sfn.Service
	Logger          logger.Logger
}

func (h *handler) OnVideoUploadComplete(ctx context.Context, e events.SNSEvent) error {
	for _, record := range e.Records {
		var s3Event events.S3Event
		if err := json.Unmarshal([]byte(record.SNS.Message), &s3Event); err == nil {
			for _, s3Record := range s3Event.Records {

				_, videoId := path.Split(s3Record.S3.Object.Key)
				if err := h.DynamoDBService.UpdateSourceVideoIsFullyUploaded(ctx, videoId, true); err != nil {
					// FIXME log error
					return err
				}

				request := iotvEvents.StartVideoEncodingRequest{
					S3Bucket:  s3Record.S3.Bucket.Name,
					ObjectKey: s3Record.S3.Object.Key,
					VideoId:   videoId,
				}
				encodedRequest, _ := json.Marshal(request)

				if _, err := h.SfnService.StartExecution(ctx, aws.String(string(encodedRequest))); err != nil {
					// FIXME log error
					return err
				} else {
					// FIXME handle response
				}
			}
		}
	}
	return nil
}

func main() {
	log := logger.NewLogger()
	dynamoDb, _ := dynamodb.NewService()
	sfnSvc, _ := sfn.NewService(os.Getenv("ENCODE_VIDEO_SFN_ARN"))
	h := handler{
		DynamoDBService: dynamoDb,
		SfnService:      sfnSvc,
		Logger:          log,
	}
	lambda.Start(h.OnVideoUploadComplete)
}
