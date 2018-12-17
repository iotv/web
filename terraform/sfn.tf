//data "template_file" "encode_source_video_definition" {
//  template = "${file("${path.module}/templates/encode_source_video.sfn.json.tpl")}"
//  vars {
//    create_media_convert_job_lambda_arn = ""
//  }
//}
//
//resource "aws_sfn_state_machine" "encode_source_video" {
//  definition = ""
//  name = ""
//  role_arn = ""
//}