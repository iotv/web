package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/lucsky/cuid"
)

type SourceVideo struct {
	SourceVideoId   string
	IsFullyUploaded bool
	OwnerUserId     *string
}

func (c *config) CreateSourceVideo(ctx context.Context, ownerUserId *string) (*SourceVideo, error) {
	newSourceVideoId := cuid.New()
	if _, err := c.dynamoDB.PutItemWithContext(ctx, &dynamodb.PutItemInput{
		TableName:           aws.String(c.sourceVideosTable),
		ConditionExpression: aws.String("attribute_not_exists(SourceVideoId)"),
		Item: map[string]*dynamodb.AttributeValue{
			"SourceVideoId": {
				S: aws.String(newSourceVideoId),
			},
			"OwnerUserId": {
				S: ownerUserId,
			},
		},
	}); err != nil {
		// FIXME: make this error friendlier
		return nil, err
	} else {
		return &SourceVideo{
			SourceVideoId:   newSourceVideoId,
			IsFullyUploaded: false,
			OwnerUserId:     ownerUserId,
		}, nil
	}
}

func (c *config) GetSourceVideoById(ctx context.Context, id string) (*SourceVideo, error) {
	if result, err := c.dynamoDB.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(c.sourceVideosTable),
		Key: map[string]*dynamodb.AttributeValue{
			"SourceVideoId": {
				S: aws.String(id),
			},
		},
	}); err != nil {
		// FIXME: make this error friendlier
		return nil, err
	} else {
		sourceVideo := SourceVideo{}
		if err := dynamodbattribute.UnmarshalMap(result.Item, &sourceVideo); err != nil {
			// FIXME: make this error friendlier
			return nil, err
		} else {
			return &sourceVideo, nil
		}
	}
}

func (c *config) UpdateSourceVideoIsFullyUploaded(ctx context.Context, id string, value bool) error {
	return nil
}
