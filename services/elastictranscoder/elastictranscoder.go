package elastictranscoder

import (
	"context"
	et "github.com/aws/aws-sdk-go/service/elastictranscoder"
)

type ETEvent struct {
	State      string `json:"state"`
	Version    string `json:"version"`
	JobID      string `json:"jobId"`
	PipelineId string `json:"pipelineId"`

	Input struct {
		Key         string `json:"key"`
		FrameRate   string `json:"frameRate"`
		Resolution  string `json:"resolution"`
		AspectRatio string `json:"aspectRatio"`
		Interlaced  string `json:"interlaced"`
		Container   string `json:"container"`
	} `json:"input"`

	InputCount      int    `json:"inputCount"`
	OutputKeyPrefix string `json:"outputKeyPrefix"`

	Outputs []struct {
		Id               string  `json:"id"`
		PresetID         string  `json:"presetId"`
		Key              string  `json:"key"`
		ThumbnailPattern string  `json:"thumbnailPattern"`
		Rotate           string  `json:"rotate"`
		SegmentDuration  float64 `json:"segmentDuration"`
		Status           string  `json:"status"`
		StatusDetail     string  `json:"statusDetail"`
		Duration         float64 `json:"duration"`
		Width            int     `json:"width"`
		Height           int     `json:"height"`
	} `json:"outputs"`
}

type Service interface {
	CreateJob(ctx context.Context, filename, id string) (*et.CreateJobResponse, error)
}

type config struct {
}

func NewService() (Service, error) {
	return &config{}, nil
}

func (c *config) CreateJob(ctx context.Context, filename, id string) (*et.CreateJobResponse, error) {
	return nil, nil
}
