package main

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/graph-gophers/graphql-go"
	"gitlab.com/iotv/services/iotv-api/resolvers"
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
	response := h.schema.Exec(ctx, params.Query, params.OperationName, params.Variables)
	// FIXME: handle error
	respBody, _ := json.Marshal(response)
	return events.APIGatewayProxyResponse{
		Body:       string(respBody),
		StatusCode: 200,
	}, nil
}

func main() {
	h := handler{
		schema: graphql.MustParseSchema(`
                schema {
                        query: Query
                }
                type Query {
					hello: String!
                }
        `, &resolvers.RootResolver{}),
	}
	lambda.Start(h.GraphQL)
}
