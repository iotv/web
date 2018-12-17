{
  "Comment": "Encode a source video that was uploaded to an S3 bucket",
  "Version": "1.0",
  "StartAt": "CreateMediaConvertJob",
  "States": {
    "CreateMediaConvertJob": {
      "Comment": "Create a Media Convert job from the input parameters",
      "Type": "Task",
      "Resource": "${create_media_convert_job_lambda_arn}",
      "End": true
    }
  }
}