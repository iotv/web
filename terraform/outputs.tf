output "source_video_uploaded_arn" {
  value = "${aws_sns_topic.source_video_uploaded.arn}"
}

output "video_encoder_completed_arn" {
  value = "${aws_sns_topic.video_encoder_completed.arn}"
}

output "video_encoder_error_arn" {
  value = "${aws_sns_topic.video_encoder_error.arn}"
}

output "video_encoder_progressing_arn" {
  value = "${aws_sns_topic.video_encoder_progressing.arn}"
}

output "video_encoder_warning_arn" {
  value = "${aws_sns_topic.video_encoder_warning.arn}"
}

output "widesceenFHDpresetId" {
  value = "${aws_elastictranscoder_preset.widescreenFHD.id}"
}
