package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type EmailAuthentication struct {
	EmailAddress   string
	HashedPassword string
	UserId         string
}

func (c *config) GetEmailAuthenticationByEmail(ctx context.Context, emailAddress string) (*EmailAuthentication, error) {
	if result, err := c.dynamoDB.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(c.emailAuthenticationsTable),
		Key: map[string]*dynamodb.AttributeValue{
			"EmailAddress": {
				S: aws.String(emailAddress),
			},
		},
	}); err != nil {
		// FIXME: make this error friendlier
		return nil, err
	} else {
		emailAuthentication := EmailAuthentication{}
		if err := dynamodbattribute.UnmarshalMap(result.Item, &emailAuthentication); err != nil {
			// FIXME: make this error friendlier
			return nil, err
		} else {
			return &emailAuthentication, nil
		}
	}
}
