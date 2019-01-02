resource "aws_lambda_function" "main" {
  function_name = ""
  handler       = ""
  role          = "${var.role_arn}"
  runtime       = "${var.runtime}"
}
