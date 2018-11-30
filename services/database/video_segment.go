package database

import (
	"context"
	"github.com/lucsky/cuid"
)

type VideoSegmentRow struct {
	Id                       string
	Url                      string
	OriginatingSourceVideoId *string
}

func (c *config) CreateVideoSegment(ctx context.Context, url string, originatingSourceVideoId *string) (*VideoSegmentRow, error) {
	const qs = "INSERT INTO video_segments(id, url, originating_source_video_id) VALUES($1, $2, $3)"

	id := cuid.New()
	if _, err := c.db.ExecEx(ctx, qs, nil, id, url, originatingSourceVideoId); err != nil {
		return nil, err
	}

	return &VideoSegmentRow{
		Id:                       id,
		Url:                      url,
		OriginatingSourceVideoId: originatingSourceVideoId,
	}, nil
}
