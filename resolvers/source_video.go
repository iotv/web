package resolvers

import (
	"context"
	"github.com/graph-gophers/graphql-go"
)

type SourceVideo struct {
	r               *RootResolver
	id              string
	isFullyUploaded bool
	ownerUserId     *string
}

func (sv *SourceVideo) Id() graphql.ID {
	return graphql.ID(sv.id)
}

func (sv *SourceVideo) IsFullyUploaded() bool {
	return sv.isFullyUploaded
}

func (sv *SourceVideo) OwnerUser(ctx context.Context) (*User, error) {
	if sv.ownerUserId != nil {
		return sv.r.GetUserById(ctx, *sv.ownerUserId)
	}
	return nil, nil
}

func (sv *SourceVideo) DownloadUrl(ctx context.Context) (*string, error) {
	if res, err := sv.r.S3Service.GetPresignedSourceVideoDownloadUrl(sv.id, sv.ownerUserId); err != nil {
		// FIXME: find internal server error equivalent, log
		return nil, err
	} else if sv.isFullyUploaded {
		return res, nil
	} else {
		return nil, nil
	}
}

func (sv *SourceVideo) UploadUrl(ctx context.Context) (*string, error) {
	if res, err := sv.r.S3Service.GetPresignedSourceVideoUploadUrl(sv.id, sv.ownerUserId); err != nil {
		// FIXME: find internal server error equivalent, log
		return nil, err
	} else if !sv.isFullyUploaded {
		return res, nil
	} else {
		return nil, nil
	}
}

func (r *RootResolver) CreateSourceVideo(ctx context.Context, ownerUserId *string) (*SourceVideo, error) {
	if sourceVideo, err := r.DynamoDBService.CreateSourceVideo(ctx, ownerUserId); err != nil {
		return nil, err
	} else {
		return &SourceVideo{
			r:               r,
			id:              sourceVideo.SourceVideoId,
			isFullyUploaded: sourceVideo.IsFullyUploaded,
			ownerUserId:     sourceVideo.OwnerUserId,
		}, nil
	}
}

func (r *RootResolver) GetSourceVideoById(ctx context.Context, sourceVideoId string) (*SourceVideo, error) {
	if sourceVideo, err := r.DynamoDBService.GetSourceVideoById(ctx, sourceVideoId); err != nil || sourceVideo == nil {
		return nil, err
	} else {
		return &SourceVideo{
			r:               r,
			id:              sourceVideo.SourceVideoId,
			isFullyUploaded: sourceVideo.IsFullyUploaded,
			ownerUserId:     sourceVideo.OwnerUserId,
		}, nil
	}
}
