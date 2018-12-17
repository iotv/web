package events

type StartVideoEncodingRequest struct {
	S3Bucket  string `json:"s3Bucket"`
	ObjectKey string `json:"objectKey"`
	VideoId   string `json:"videoId"`
}

type StartVideoEncodingResponse struct {
	MediaConvertJobId string `json:"mediaConvertJobId"`
}
