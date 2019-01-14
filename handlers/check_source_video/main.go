package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/iotv/iotv/lib/events"
	"github.com/iotv/iotv/lib/services/logger"
	"github.com/iotv/iotv/lib/services/s3"
	"os/exec"
	"strings"
)

type ffprobeResponse struct {
	Streams []ffprobeStream `json:"streams"`
}

type ffprobeStream struct {
	Index            int     `json:"index"`
	Width            *uint   `json:"width,omitempty"`
	Height           *uint   `json:"height,omitempty"`
	CodedWidth       *uint   `json:"coded_width,omitempty"`
	CodedHeight      *uint   `json:"coded_height,omitempty"`
	CodecType        *string `json:"codec_type,omitempty"`
	CodecTag         string  `json:"codec_tag"`
	RealFrameRate    string  `json:"r_frame_rate"`
	AverageFrameRate string  `json:"avg_frame_rate"`
}

type handler struct {
	Logger    logger.Logger
	S3Service s3.Service
}

var InvalidSourceVideo = errors.New("the alleged source video file does not contain a video stream which features recognizable width or height")

func (h *handler) CheckSourceVideo(ctx context.Context, e events.CheckSourceVideoRequest) (*events.CheckSourceVideoResponse, error) {
	if chunk, err := h.S3Service.GetSourceVideoChunk(ctx, e.SourceVideoId, e.OwnerUserId); err != nil {
		fmt.Println("Fail")
		return nil, err
	} else {
		cmd := exec.CommandContext(ctx, "/opt/ffprobe", "-v", "quiet", "-print_format", "json", "-show_streams", "-i", "pipe:")
		cmd.Stdin = chunk
		if out, err := cmd.CombinedOutput(); err != nil {
			// FIXME: handle this better
			return nil, err
		} else {
			var resp ffprobeResponse
			if err := json.Unmarshal(out, &resp); err != nil {
				fmt.Println(string(out))
				//FIXME: handler this
				return nil, err
			}
			for _, s := range resp.Streams {
				if s.Height != nil && s.Width != nil {
					return &events.CheckSourceVideoResponse{
						SourceVideoId: e.SourceVideoId,
						OwnerUserId:   e.OwnerUserId,
						Width:         *s.Width,
						Height:        *s.Height,
						AspectRatio:   calcAspectRatio(*s.Width, *s.Height),
					}, nil
				}
				if s.CodedWidth != nil && s.CodedHeight != nil {
					return &events.CheckSourceVideoResponse{
						SourceVideoId: e.SourceVideoId,
						OwnerUserId:   e.OwnerUserId,
						Width:         *s.Width,
						Height:        *s.Height,
						AspectRatio:   calcAspectRatio(*s.Width, *s.Height),
					}, nil
				}
			}
			return nil, InvalidSourceVideo
		}
	}
}

func calcAspectRatio(width, height uint) string {
	gcd := calcGCD(int(width), int(height))
	var sb strings.Builder
	sb.WriteString(string(int(width) / gcd))
	sb.WriteString(":")
	sb.WriteString(string(int(height) / gcd))
	return sb.String()
}

func calcGCD(x, y int) int {
	for y != 0 {
		fmt.Println(x, y)
		x, y = y, x%y
	}
	return x
}

func main() {
	log := logger.NewLogger()
	// FIXME: handle error
	s3Svc, _ := s3.NewService()
	h := handler{
		Logger:    log,
		S3Service: s3Svc,
	}
	lambda.Start(h.CheckSourceVideo)
}
