package main

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/graph-gophers/graphql-go"
	"github.com/iotv/iotv/lib/resolvers"
	"github.com/iotv/iotv/lib/schema"
	"github.com/iotv/iotv/lib/services/dynamodb"
	"github.com/iotv/iotv/lib/services/s3"
	"github.com/iotv/iotv/lib/services/user"
	"github.com/iotv/iotv/lib/utilities"
	"io/ioutil"
)

type handler struct {
	schema *graphql.Schema
}

func (h *handler) GraphQL(ctx context.Context, e events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var params struct {
		Query         string                 `json:"query"`
		OperationName string                 `json:"operationName"`
		Variables     map[string]interface{} `json:"variables"`
	}
	// FIXME: handle error
	json.Unmarshal([]byte(e.Body), &params)

	// FIXME: handle error
	jwtCtx, _ := utilities.ValidateJWTForContext(ctx, e)

	response := h.schema.Exec(jwtCtx, params.Query, params.OperationName, params.Variables)
	// FIXME: handle error
	respBody, _ := json.Marshal(response)
	return events.APIGatewayProxyResponse{
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Methods": "OPTIONS, POST",
			"Access-Control-Allow-Headers": "Authorization, Content-Type, X-Correlation-ID, X-Request-ID",
		},
		Body:       string(respBody),
		StatusCode: 200,
	}, nil
}

func main() {
	// FIXME: handle all the errors
	schemaFile, _ := schema.Assets.Open("/schema.graphql")
	schemaBuf, _ := ioutil.ReadAll(schemaFile)
	dynamoDBSvc, _ := dynamodb.NewService()
	userSvc, _ := user.NewService()
	s3Svc, _ := s3.NewService()
	root, _ := graphql.ParseSchema(string(schemaBuf), &resolvers.RootResolver{
		UserService:     userSvc,
		DynamoDBService: dynamoDBSvc,
		S3Service:       s3Svc,
	})
	h := handler{
		schema: root,
	}
	lambda.Start(h.GraphQL)
}
