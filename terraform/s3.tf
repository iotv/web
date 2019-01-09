# Logs
resource "aws_s3_bucket" "api_logs" {
  bucket_prefix = "video-encoder-logs"
  acl           = "log-delivery-write"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = "${aws_kms_key.s3.arn}"
        sse_algorithm     = "aws:kms"
      }
    }
  }

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.org_name} ${var.app_name} Log Bucket"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}

############################
### Source Videos Bucket ###
############################
data "aws_iam_policy_document" "source_videos" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:GetObjectTagging",
      "s3:PutObject",
      "s3:PutObjectTagging",
    ]

    resources = [
      "${aws_s3_bucket.source_videos.arn}/*",
    ]

    principals {
      type = "AWS"

      identifiers = [
        "${aws_iam_role.api_lambda.arn}",
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "source_videos" {
  bucket = "${aws_s3_bucket.source_videos.id}"
  policy = "${data.aws_iam_policy_document.source_videos.json}"
}

resource "aws_s3_bucket_notification" "source_video_uploaded" {
  bucket     = "${aws_s3_bucket.source_videos.id}"
  depends_on = ["aws_sns_topic_policy.source_video_uploaded"]

  topic {
    topic_arn = "${aws_sns_topic.source_video_uploaded.arn}"
    events    = ["s3:ObjectCreated:*"]
  }
}

resource "aws_s3_bucket" "source_videos" {
  bucket_prefix = "source-videos"
  acl           = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  logging {
    target_bucket = "${aws_s3_bucket.api_logs.id}"
    target_prefix = "log/video-encoder-uploaded-videos/"
  }

  lifecycle_rule {
    abort_incomplete_multipart_upload_days = 3
    enabled                                = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = "${aws_kms_key.s3.arn}"
        sse_algorithm     = "aws:kms"
      }
    }
  }

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.org_name} ${var.app_name} Uploaded Videos Bucket"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}

# Encoded Videos
resource "aws_s3_bucket" "encoded_videos" {
  bucket_prefix = "encoded-videos"
  acl           = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  logging {
    target_bucket = "${aws_s3_bucket.api_logs.id}"
    target_prefix = "log/video-encoder-uploaded-videos/"
  }

  lifecycle_rule {
    abort_incomplete_multipart_upload_days = 3
    enabled                                = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = "${aws_kms_key.s3.arn}"
        sse_algorithm     = "aws:kms"
      }
    }
  }

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.org_name} ${var.app_name} Encoded Videos Bucket"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}

# Thumbnails
resource "aws_s3_bucket" "video_thumbnails" {}
