module github.com/iotv/iotv/lib/resolvers

require (
	github.com/graph-gophers/graphql-go v0.0.0-20190108123631-d5b7dc6be53b
	github.com/iotv/iotv/lib/services/dynamodb v0.0.0
	github.com/iotv/iotv/lib/services/s3 v0.0.0
	github.com/iotv/iotv/lib/services/user v0.0.0
	github.com/iotv/iotv/lib/utilities v0.0.0
	github.com/opentracing/opentracing-go v1.0.2 // indirect
	golang.org/x/net v0.0.0-20190108225652-1e06a53dbb7e // indirect
)

replace (
	github.com/iotv/iotv/lib/services/dynamodb => ../services/dynamodb
	github.com/iotv/iotv/lib/services/s3 => ../services/s3
	github.com/iotv/iotv/lib/services/user => ../services/user
	github.com/iotv/iotv/lib/utilities => ../utilities
)
