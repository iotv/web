package main

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/graph-gophers/graphql-go"
	"gitlab.com/iotv/services/iotv-api/resolvers"
	"gitlab.com/iotv/services/iotv-api/schema"
	"gitlab.com/iotv/services/iotv-api/services/dynamodb"
	"gitlab.com/iotv/services/iotv-api/services/s3"
	"gitlab.com/iotv/services/iotv-api/services/user"
	"gitlab.com/iotv/services/iotv-api/utilities"
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
