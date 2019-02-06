package user

import (
	"context"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/lucsky/cuid"
	"os"
)

type User struct {
	UserId           string
	Email            string
	UserName         string
	RealName         *string
	IsEmailConfirmed bool
}

type Service interface {
	CreateUserWithEmailAndPassword(ctx context.Context, emailAddress, userName, hashedPassword string) (*User, error)
	GetEmailAuthenticationByEmail(ctx context.Context, emailAddress string) (*EmailAuthentication, error)
	GetUserById(ctx context.Context, id string) (*User, error)
}

type config struct {
	authenticationsTable                            string
	authenticationsEmailAuthenticationIdUniqueIndex string
	emailAuthenticationsTable                       string
	emailAuthenticationsEmailUniqueIndex            string
	emailAuthenticationsUserIdUniqueIndex           string
	usersTable                                      string
	usersEmailUniqueIndex                           string
	usersUserNameUniqueIndex                        string
	dynamoDB                                        *dynamodb.DynamoDB
}

func (c *config) CreateUserWithEmailAndPassword(ctx context.Context, email, userName, hashedPassword string) (*User, error) {
	newAuthenticationId := cuid.New()
	newEmailAuthenticationId := cuid.New()
	newUserId := cuid.New()

	if _, err := c.dynamoDB.TransactWriteItemsWithContext(ctx, &dynamodb.TransactWriteItemsInput{
		TransactItems: []*dynamodb.TransactWriteItem{
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.authenticationsTable),
					ConditionExpression: aws.String("attribute_not_exists(AuthenticationId)"),
					Item: map[string]*dynamodb.AttributeValue{
						"AuthenticationId": {
							S: aws.String(newAuthenticationId),
						},
						"EmailAuthenticationId": {
							S: aws.String(newEmailAuthenticationId),
						},
					},
				},
			},
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.authenticationsEmailAuthenticationIdUniqueIndex),
					ConditionExpression: aws.String("attribute_not_exists(EmailAuthenticationId)"),
					Item: map[string]*dynamodb.AttributeValue{
						"EmailAuthenticationId": {
							S: aws.String(newEmailAuthenticationId),
						},
						"AuthenticationId": {
							S: aws.String(newAuthenticationId),
						},
					},
				},
			},
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.emailAuthenticationsTable),
					ConditionExpression: aws.String("attribute_not_exists(EmailAuthenticationId)"),
					Item: map[string]*dynamodb.AttributeValue{
						"EmailAuthenticationId": {
							S: aws.String(newEmailAuthenticationId),
						},
						"Email": {
							S: aws.String(email),
						},
						"HashedPassword": {
							S: aws.String(hashedPassword),
						},
						"UserId": {
							S: aws.String(newUserId),
						},
					},
				},
			},
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.emailAuthenticationsEmailUniqueIndex),
					ConditionExpression: aws.String("attribute_not_exists(Email)"),
					Item: map[string]*dynamodb.AttributeValue{
						"Email": {
							S: aws.String(email),
						},
						"EmailAuthenticationId": {
							S: aws.String(newEmailAuthenticationId),
						},
					},
				},
			},
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.emailAuthenticationsUserIdUniqueIndex),
					ConditionExpression: aws.String("attribute_not_exists(UserId)"),
					Item: map[string]*dynamodb.AttributeValue{
						"UserId": {
							S: aws.String(newUserId),
						},
						"EmailAuthenticationId": {
							S: aws.String(newEmailAuthenticationId),
						},
					},
				},
			},
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.usersTable),
					ConditionExpression: aws.String("attribute_not_exists(UserId)"),
					Item: map[string]*dynamodb.AttributeValue{
						"UserId": {
							S: aws.String(newUserId),
						},
						"Email": {
							S: aws.String(email),
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
					TableName:           aws.String(c.usersEmailUniqueIndex),
					ConditionExpression: aws.String("attribute_not_exists(Email)"),
					Item: map[string]*dynamodb.AttributeValue{
						"Email": {
							S: aws.String(email),
						},
						"UserId": {
							S: aws.String(newUserId),
						},
					},
				},
			},
			{
				Put: &dynamodb.Put{
					TableName:           aws.String(c.usersUserNameUniqueIndex),
					ConditionExpression: aws.String("attribute_not_exists(UserName)"),
					Item: map[string]*dynamodb.AttributeValue{
						"UserName": {
							S: aws.String(userName),
						},
						"UserId": {
							S: aws.String(newUserId),
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
			Email:            email,
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

func NewService() (Service, error) {
	// FIXME: handle error
	sess, _ := session.NewSession()

	return &config{
		authenticationsTable:                            os.Getenv("AUTHENTICATIONS_TABLE"),
		authenticationsEmailAuthenticationIdUniqueIndex: os.Getenv("AUTHENTICATIONS_EMAIL_AUTHENTICATION_ID_UNIQUE_INDEX"),
		emailAuthenticationsTable:                       os.Getenv("EMAIL_AUTHENTICATIONS_TABLE"),
		emailAuthenticationsEmailUniqueIndex:            os.Getenv("EMAIL_AUTHENTICATIONS_EMAIL_UNIQUE_INDEX"),
		emailAuthenticationsUserIdUniqueIndex:           os.Getenv("EMAIL_AUTHENTICATIONS_USER_ID_UNIQUE_INDEX"),
		usersTable:                                      os.Getenv("USERS_TABLE"),
		usersEmailUniqueIndex:                           os.Getenv("USERS_EMAIL_UNIQUE_INDEX"),
		usersUserNameUniqueIndex:                        os.Getenv("USERS_USER_NAME_UNIQUE_INDEX"),
		dynamoDB:                                        dynamodb.New(sess),
	}, nil
}
