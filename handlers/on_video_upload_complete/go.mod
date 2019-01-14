module github.com/iotv/iotv/handlers/on_video_upload_complete

require (
	github.com/aws/aws-lambda-go v1.8.1
	github.com/aws/aws-sdk-go v1.16.16
	github.com/iotv/iotv/lib/events v0.0.0
	github.com/iotv/iotv/lib/services/dynamodb v0.0.0
	github.com/iotv/iotv/lib/services/logger v0.0.0
	github.com/iotv/iotv/lib/services/s3 v0.0.0
	github.com/iotv/iotv/lib/services/sfn v0.0.0
)

replace (
	github.com/iotv/iotv/lib/events => ../../lib/events
	github.com/iotv/iotv/lib/services/dynamodb => ../../lib/services/dynamodb
	github.com/iotv/iotv/lib/services/logger => ../../lib/services/logger
	github.com/iotv/iotv/lib/services/s3 => ../../lib/services/s3
	github.com/iotv/iotv/lib/services/sfn => ../../lib/services/sfn
)
