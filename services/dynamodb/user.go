package dynamodb

import (
	"context"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/lucsky/cuid"
)

type User struct {
	UserId           string
	Email            string
	UserName         string
	RealName         *string
	IsEmailConfirmed bool
}

func (c *config) CreateUserWithEmailAndPassword(ctx context.Context, emailAddress, userName, hashedPassword string) (*User, error) {
	newUserId := cuid.New()
	if _, err := c.dynamoDB.TransactWriteItemsWithContext(ctx, &dynamodb.TransactWriteItemsInput{
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
					TableName:           aws.String(c.emailAuthenticationsTable),
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
			UserId:           newUserId,
			Email:            emailAddress,
			IsEmailConfirmed: false,
		}, nil
	}
}

func (c *config) GetUserById(ctx context.Context, id string) (*User, error) {
	if result, err := c.dynamoDB.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(c.usersTable),
		Key: map[string]*dynamodb.AttributeValue{
			"UserId": {
				S: aws.String(id),
			},
		},
	}); err != nil {
		// FIXME: make this error friendlier
		return nil, err
	} else {
		user := User{}
		if err := dynamodbattribute.UnmarshalMap(result.Item, &user); err != nil {
			// FIXME: make this error friendlier
			return nil, err
		} else {
			return &user, nil
		}
	}
}
