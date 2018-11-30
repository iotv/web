###############
### Generic ###
###############
## Allow roles to utilize s3 kms key ##
data "aws_iam_policy_document" "allow_s3_kms_key_use" {
  statement {
    effect = "Allow"

    // FIXME: figure out what kms encrypt/decrypt needs
    actions = [
      "*",
    ]

    resources = [
      "${aws_kms_key.s3.arn}",
    ]
  }
}

resource "aws_iam_policy" "allow_s3_kms_key_use" {
  description = "Allow KMS key use for s3 key for ${var.app_name}"
  name_prefix = "AllowKMSKeyUse"
  policy      = "${data.aws_iam_policy_document.allow_s3_kms_key_use.json}"
}

###################
### Lambda role ###
###################
## Allow role to use S3 KMS key ##
resource "aws_iam_role_policy_attachment" "lamba_s3_kms" {
  policy_arn = "${aws_iam_policy.allow_s3_kms_key_use.arn}"
  role       = "${aws_iam_role.api_lambda.name}"
}

## Allow role to use lambda KMS key ##
data "aws_iam_policy_document" "allow_lambda_kms_key_use" {
  statement {
    effect = "Allow"

    // FIXME: figure out what kms encrypt/decrypt needs
    actions = [
      "*",
    ]

    resources = [
      "${aws_kms_key.lambda.arn}",
    ]
  }
}

resource "aws_iam_policy" "allow_lambda_kms_key_use" {
  description = "Allow KMS key use for lambda key for ${var.app_name}"
  name_prefix = "AllowKMSKeyUse"
  policy      = "${data.aws_iam_policy_document.allow_lambda_kms_key_use.json}"
}

resource "aws_iam_role_policy_attachment" "lamba_kms" {
  policy_arn = "${aws_iam_policy.allow_lambda_kms_key_use.arn}"
  role       = "${aws_iam_role.api_lambda.name}"
}

## Allow role to use jwt KMS key ##
data "aws_iam_policy_document" "allow_jwt_kms_key_use" {
  statement {
    effect = "Allow"

    // FIXME: figure out what kms encrypt/decrypt needs
    actions = [
      "*",
    ]

    resources = [
      "${aws_kms_key.jwt.arn}",
    ]
  }
}

resource "aws_iam_policy" "allow_jwt_kms_key_use" {
  description = "Allow KMS key use for jwt key for ${var.app_name}"
  name_prefix = "AllowKMSKeyUse"
  policy      = "${data.aws_iam_policy_document.allow_jwt_kms_key_use.json}"
}

resource "aws_iam_role_policy_attachment" "lambda_jwt_kms" {
  policy_arn = "${aws_iam_policy.allow_jwt_kms_key_use.arn}"
  role       = "${aws_iam_role.api_lambda.name}"
}

## Allow lambda to write to cloudwatch logs
data "aws_iam_policy_document" "allow_write_to_cloudwatch_logs" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${var.app_name}-${var.stage}*",
      "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${var.app_name}-${var.stage}*:*:*",
    ]
  }
}

resource "aws_iam_policy" "allow_write_to_cloudwatch_logs" {
  description = "Allow writing to cloudwatch log groups for ${var.app_name}"
  name_prefix = "AllowWriteCloudwatchLogs"
  policy      = "${data.aws_iam_policy_document.allow_write_to_cloudwatch_logs.json}"
}

resource "aws_iam_role_policy_attachment" "lambda_cloudwatch_logs" {
  policy_arn = "${aws_iam_policy.allow_write_to_cloudwatch_logs.arn}"
  role       = "${aws_iam_role.api_lambda.name}"
}

## Allow lambda to create job in elastic transcoder
data "aws_iam_policy_document" "allow_et_create_job" {
  statement {
    effect = "Allow"

    actions = [
      "elastictranscoder:CreateJob",
    ]

    resources = [
      "arn:aws:elastictranscoder:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:preset/*",
      "${aws_elastictranscoder_pipeline.video_encoder.arn}",
    ]
  }
}

resource "aws_iam_policy" "allow_et_create_job" {
  description = "Allow creating jobs on elastic transcoder for ${var.app_name}"
  name_prefix = "AllowCreateETJob"
  policy      = "${data.aws_iam_policy_document.allow_et_create_job.json}"
}

resource "aws_iam_role_policy_attachment" "lambda_et" {
  policy_arn = "${aws_iam_policy.allow_et_create_job.arn}"
  role       = "${aws_iam_role.api_lambda.name}"
}

## Allow lambda to assume the role ##
data "aws_iam_policy_document" "api_lambda_assume_role" {
  statement {
    effect = "Allow"

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      identifiers = [
        "lambda.amazonaws.com",
      ]

      type = "Service"
    }
  }
}

## The role ##
resource "aws_iam_role" "api_lambda" {
  assume_role_policy = "${data.aws_iam_policy_document.api_lambda_assume_role.json}"
  description        = "The role used by lambda for ${var.app_name}"
  name_prefix        = "${var.app_name}-lambda"
}

###############################
### Elastic transcoder role ###
###############################
## Allow role to publish to SNS status topics ##
data "aws_iam_policy_document" "allow_publish_to_elastic_transcoder_sns_topics" {
  statement {
    effect = "Allow"

    actions = [
      "sns:Publish",
    ]

    resources = [
      "${aws_sns_topic.video_encoder_completed.arn}",
      "${aws_sns_topic.video_encoder_error.arn}",
      "${aws_sns_topic.video_encoder_progressing.arn}",
      "${aws_sns_topic.video_encoder_warning.arn}",
    ]
  }
}

resource "aws_iam_policy" "allow_publish_to_elastic_transcoder_sns_topics" {
  description = "Allow SNS Publishing to Elastic Transcoder status topics for ${var.app_name}"
  name_prefix = "AllowSNSPublish"
  policy      = "${data.aws_iam_policy_document.allow_publish_to_elastic_transcoder_sns_topics.json}"
}

resource "aws_iam_role_policy_attachment" "et_sns_status" {
  policy_arn = "${aws_iam_policy.allow_publish_to_elastic_transcoder_sns_topics.arn}"
  role       = "${aws_iam_role.elastic_transcoder.name}"
}

## Allow role to read from source video bucket ##
data "aws_iam_policy_document" "allow_read_from_source_video_s3_bucket" {
  statement {
    effect = "Allow"

    actions = [
      "s3:ListBucket",
      "s3:Get*",
    ]

    resources = [
      "${aws_s3_bucket.source_videos.arn}",
      "${aws_s3_bucket.source_videos.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "allow_read_from_source_video_s3_bucket" {
  description = "Allow S3 Read from source videos S3 Bucket for ${var.app_name}"
  name_prefix = "AllowS3Read"
  policy      = "${data.aws_iam_policy_document.allow_read_from_source_video_s3_bucket.json}"
}

resource "aws_iam_role_policy_attachment" "allow_read_from_source_video_s3_bucket" {
  policy_arn = "${aws_iam_policy.allow_read_from_source_video_s3_bucket.arn}"
  role       = "${aws_iam_role.elastic_transcoder.id}"
}

## Allow role to write to transcoded videos bucket and thumbnails bucket ##
data "aws_iam_policy_document" "allow_write_to_transcoded_videos_and_thumbnails_s3_buckets" {
  statement {
    effect = "Allow"

    // FIXME: figure out what this wants
    actions = [
      "*",
    ]

    resources = [
      "${aws_s3_bucket.transcoded_videos.arn}",
      "${aws_s3_bucket.video_thumbnails.arn}",
      "${aws_s3_bucket.transcoded_videos.arn}/*",
      "${aws_s3_bucket.video_thumbnails.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "allow_write_to_transcoded_videos_and_thumbnails_s3_buckets" {
  description = "Allow S3 Write to Transcoded Videos and Thumbnails S3 Buckets for ${var.app_name}"
  name_prefix = "AllowS3Write"
  policy      = "${data.aws_iam_policy_document.allow_write_to_transcoded_videos_and_thumbnails_s3_buckets.json}"
}

resource "aws_iam_role_policy_attachment" "et_transcoded_and_thumbnails" {
  policy_arn = "${aws_iam_policy.allow_write_to_transcoded_videos_and_thumbnails_s3_buckets.arn}"
  role       = "${aws_iam_role.elastic_transcoder.name}"
}

## Allow role to use S3 KMS key ##
resource "aws_iam_role_policy_attachment" "et_kms" {
  policy_arn = "${aws_iam_policy.allow_s3_kms_key_use.arn}"
  role       = "${aws_iam_role.elastic_transcoder.name}"
}

## Allow elastic transcoder to assume the role ##
data "aws_iam_policy_document" "elastic_transcoder_assume_role" {
  statement = {
    effect = "Allow"

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type = "Service"

      identifiers = [
        "elastictranscoder.amazonaws.com",
      ]
    }
  }
}

## The role ##
resource "aws_iam_role" "elastic_transcoder" {
  assume_role_policy = "${data.aws_iam_policy_document.elastic_transcoder_assume_role.json}"
  description        = "The role used by elastic transcoder for ${var.app_name}"
  name_prefix        = "${var.app_name}-ET"
}
