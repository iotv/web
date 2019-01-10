package sfn

import (
	"context"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	awsSfn "github.com/aws/aws-sdk-go/service/sfn"
	"github.com/lucsky/cuid"
)

type Service interface {
	StartExecution(ctx context.Context, input *string) (*awsSfn.StartExecutionOutput, error)
}

type config struct {
	stateMachineArn string
	sfn             *awsSfn.SFN
}

func NewService(stateMachineArn string) (Service, error) {
	sess, _ := session.NewSession()

	return &config{
		stateMachineArn: stateMachineArn,
		sfn:             awsSfn.New(sess),
	}, nil
}

func (c *config) StartExecution(ctx context.Context, input *string) (*awsSfn.StartExecutionOutput, error) {
	return c.sfn.StartExecutionWithContext(ctx, &awsSfn.StartExecutionInput{
		Input:           input,
		Name:            aws.String(cuid.New()),
		StateMachineArn: aws.String(c.stateMachineArn),
	})
}
