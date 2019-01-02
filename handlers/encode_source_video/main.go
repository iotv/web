package main

import (
	"context"
	"github.com/aws/aws-lambda-go/lambda"
	"gitlab.com/iotv/services/iotv-api/events"
)

type handler struct {
}

func (h *handler) EncodeSourceVideo(ctx context.Context, e events.EncodeSourceVideoRequest) error {
	return nil
}

func main() {
	h := handler{}
	lambda.Start(h.EncodeSourceVideo)
}
