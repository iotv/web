package main

import (
	"context"
	"github.com/aws/aws-lambda-go/lambda"
	"gitlab.com/iotv/services/iotv-api/events"
	"gitlab.com/iotv/services/iotv-api/services/logger"
	"gitlab.com/iotv/services/iotv-api/services/mediaconvert"
)

type handler struct {
	Logger              logger.Logger
	MediaConvertService mediaconvert.Service
}

func (h *handler) StartSourceVideoEncoding(ctx context.Context, e events.StartVideoEncodingRequest) (events.StartVideoEncodingResponse, error) {
	h.MediaConvertService.CreateJob(ctx, e.S3Bucket, e.ObjectKey)
	return events.StartVideoEncodingResponse{}, nil
}

func main() {
	log := logger.NewLogger()
	// FIXME: handle error
	mc, _ := mediaconvert.NewService()
	h := handler{
		Logger:              log,
		MediaConvertService: mc,
	}
	lambda.Start(h.StartSourceVideoEncoding)
}
