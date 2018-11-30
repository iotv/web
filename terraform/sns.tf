###########################################
### SNS topic for source video uploaded ###
###########################################
## Allow S3 to publish to source video upload complete SNS topic
data "aws_iam_policy_document" "allow_publish_from_source_videos" {
  statement {
    effect = "Allow"

    actions = [
      "sns:Publish",
    ]

    resources = [
      "${aws_sns_topic.source_video_uploaded.arn}",
    ]

    principals {
      type = "AWS"

      identifiers = [
        "*",
      ]
    }

    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"

      values = [
        "${aws_s3_bucket.source_videos.arn}",
      ]
    }
  }
}

resource "aws_sns_topic_policy" "source_video_uploaded" {
  arn    = "${aws_sns_topic.source_video_uploaded.arn}"
  policy = "${data.aws_iam_policy_document.allow_publish_from_source_videos.json}"
}

## The topic
resource "aws_sns_topic" "source_video_uploaded" {
  name_prefix = "${var.org_name}-${var.stage}-source-video-uploaded"
}

#############################################
### SNS topic for video encoder completed ###
#############################################
resource "aws_sns_topic" "video_encoder_completed" {
  name_prefix = "${var.org_name}-${var.stage}-video-encoder-completed"
}

#########################################
### SNS topic for video encoder error ###
#########################################
resource "aws_sns_topic" "video_encoder_error" {
  name_prefix = "${var.org_name}-${var.stage}-video-encoder-error"
}

###############################################
### SNS topic for video encoder progressing ###
###############################################
resource "aws_sns_topic" "video_encoder_progressing" {
  name_prefix = "${var.org_name}-${var.stage}-video-encoder-progressing"
}

###########################################
### SNS topic for video encoder warning ###
###########################################
resource "aws_sns_topic" "video_encoder_warning" {
  name_prefix = "${var.org_name}-${var.stage}-video-encoder-warning"
}
