module github.com/iotv/iotv/handlers/check_source_video

replace (
	github.com/iotv/iotv/lib/events => ../../lib/events
	github.com/iotv/iotv/lib/services/logger => ../../lib/services/logger
	github.com/iotv/iotv/lib/services/s3 => ../../lib/services/s3
)

require (
	github.com/aws/aws-lambda-go v1.8.1
	github.com/iotv/iotv/lib/events v0.0.0
	github.com/iotv/iotv/lib/services/logger v0.0.0
	github.com/iotv/iotv/lib/services/s3 v0.0.0
)
