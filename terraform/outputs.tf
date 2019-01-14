output "source_video_uploaded_arn" {
  value = "${aws_sns_topic.source_video_uploaded.arn}"
}

output "stage" {
  value = "${var.stage}"
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

// A bit of a ghetto hack because `terraform output -json` doesn't work with remote state
resource "local_file" "output" {
  filename = "${path.cwd}/bin/.terraform-output"
  content = <<EOF
{
  "stage": "${var.stage}"
}
EOF
}
