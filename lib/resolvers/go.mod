module github.com/iotv/iotv/lib/resolvers

require (
	github.com/aws/aws-sdk-go v1.16.16 // indirect
	github.com/graph-gophers/graphql-go v0.0.0-20190108123631-d5b7dc6be53b
	github.com/iotv/iotv v0.0.0-20190109192307-46969e640f64
	github.com/iotv/iotv/lib/utilities v0.0.0
	github.com/lucsky/cuid v1.0.2 // indirect
	github.com/opentracing/opentracing-go v1.0.2 // indirect
	golang.org/x/net v0.0.0-20190108225652-1e06a53dbb7e // indirect
)

replace github.com/iotv/iotv/lib/utilities => ../utilities
