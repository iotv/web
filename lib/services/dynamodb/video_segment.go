package dynamodb

import (
	"context"
)

type VideoSegment struct {
	Id                       string
	Url                      string
	OriginatingSourceVideoId *string
}

func (c *config) CreateVideoSegment(ctx context.Context, url string, originatingSourceVideoId *string) (*VideoSegment, error) {

	return nil, nil
}
