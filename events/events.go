package events

type StartVideoEncodingRequest struct {
	S3Bucket  string `json:"s3Bucket"`
	ObjectKey string `json:"objectKey"`
	VideoId   string `json:"videoId"`
}

type StartVideoEncodingResponse struct {
	MediaConvertJobId string `json:"mediaConvertJobId"`
}

type CheckSourceVideoRequest struct {
	SourceVideoId string
	OwnerUserId   *string
}

type CheckSourceVideoResponse struct {
	SourceVideoId string
	OwnerUserId   *string
	Width         uint
	Height        uint
	AspectRatio   string
}

type EncodeSourceVideoRequest CheckSourceVideoResponse