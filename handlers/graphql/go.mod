module github.com/iotv/iotv/handlers/graphql

require (
	github.com/aws/aws-lambda-go v1.8.1
	github.com/graph-gophers/graphql-go v0.0.0-20190108123631-d5b7dc6be53b
	github.com/iotv/iotv/lib/resolvers v0.0.0
	github.com/iotv/iotv/lib/schema v0.0.0
	github.com/iotv/iotv/lib/services/dynamodb v0.0.0
	github.com/iotv/iotv/lib/services/s3 v0.0.0
	github.com/iotv/iotv/lib/services/user v0.0.0
	github.com/iotv/iotv/lib/utilities v0.0.0
	github.com/shurcooL/httpfs v0.0.0-20181222201310-74dc9339e414 // indirect
	github.com/shurcooL/vfsgen v0.0.0-20181202132449-6a9ea43bcacd // indirect
)

replace (
	github.com/iotv/iotv/lib/resolvers => ../../lib/resolvers
	github.com/iotv/iotv/lib/schema => ../../lib/schema
	github.com/iotv/iotv/lib/services/dynamodb => ../../lib/services/dynamodb
	github.com/iotv/iotv/lib/services/s3 => ../../lib/services/s3
	github.com/iotv/iotv/lib/services/user => ../../lib/services/user
	github.com/iotv/iotv/lib/utilities => ../../lib/utilities
)
