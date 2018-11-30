package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/lucsky/cuid"
)

type User struct {
	Id               string
	Email            string
	UserName         string
	RealName         *string
	IsEmailConfirmed bool
}

func (c *config) CreateUserWithEmailAndPassword(ctx context.Context, emailAddress, userName, hashedPassword string) (*User, error) {
	newUserId := cuid.New()
	if _, err := c.dynamodb.TransactWriteItemsWithContext(ctx, &dynamodb.TransactWriteItemsInput{
		TransactItems: []*dynamodb.TransactWriteItem{
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.usersTable),
					ConditionExpression: aws.String("attribute_not_exists(UserId) AND attribute_not_exists(EmailAddress) AND attribute_not_exists(UserName)"),
					Item: map[string]*dynamodb.AttributeValue{
						"UserId": {
							S: aws.String(newUserId),
						},
						"EmailAddress": {
							S: aws.String(emailAddress),
						},
						"UserName": {
							S: aws.String(userName),
						},
						"IsEmailConfirmed": {
							BOOL: aws.Bool(false),
						},
					},
				},
			},
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.authenticationsTable),
					ConditionExpression: aws.String("attribute_not_exists(EmailAddress)"),
					Item: map[string]*dynamodb.AttributeValue{
						"EmailAddress": {
							S: aws.String(emailAddress),
						},
						"HashedPassword": {
							S: aws.String(hashedPassword),
						},
					},
				},
			},
		},
	}); err != nil {
		// FIXME: make this error friendlier
		return nil, err
	} else {
		return &User{
			Id:               newUserId,
			Email:            emailAddress,
			IsEmailConfirmed: false,
		}, nil
	}
}
