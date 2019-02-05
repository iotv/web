data "aws_iam_policy_document" "allow_full_users_dynamo_access" {
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
    ]

    resources = [
      "${aws_dynamodb_table.authentications.arn}",
      "${aws_dynamodb_table.authentications.arn}/index/*",
      "${aws_dynamodb_table.authentications_email_authentication_id_unique_index.arn}",
      "${aws_dynamodb_table.authentications_email_authentication_id_unique_index.arn}/index/*",
      "${aws_dynamodb_table.email_authentications.arn}",
      "${aws_dynamodb_table.email_authentications.arn}/index/*",
      "${aws_dynamodb_table.email_authentications_email_unique_index.arn}",
      "${aws_dynamodb_table.email_authentications_email_unique_index.arn}/index/*",
      "${aws_dynamodb_table.email_authentications_user_id_unique_index.arn}",
      "${aws_dynamodb_table.email_authentications_user_id_unique_index.arn}/index/*",
      "${aws_dynamodb_table.users.arn}",
      "${aws_dynamodb_table.users.arn}/index/*",
      "${aws_dynamodb_table.users_email_unique_index.arn}",
      "${aws_dynamodb_table.users_email_unique_index.arn}/index/*",
      "${aws_dynamodb_table.users_user_name_unique_index.arn}",
      "${aws_dynamodb_table.users_user_name_unique_index.arn}/index/*",
    ]
  }
}

resource "aws_iam_policy" "allow_full_users_dynamo_access" {
  description = "Allow DynamoDB access to Users ${var.stage}-${random_string.stack_id.result} for ${var.app_name}"
  name        = "UsersDBFullAccess-${var.stage}-${random_string.stack_id.result}"
  policy      = "${data.aws_iam_policy_document.allow_full_users_dynamo_access.json}"
}
