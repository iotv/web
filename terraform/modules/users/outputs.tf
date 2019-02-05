output "full_access_iam_policy_arn" {
  value = "${aws_iam_policy.allow_full_users_dynamo_access.arn}"
}

output "authentications_table_name" {
  value = "${aws_dynamodb_table.authentications.name}"
}

output "authentications_email_authentication_id_unique_index_name" {
  value = "${aws_dynamodb_table.authentications_email_authentication_id_unique_index.name}"
}

output "email_authentications_table_name" {
  value = "${aws_dynamodb_table.email_authentications.name}"
}

output "email_authentications_email_unique_index_name" {
  value = "${aws_dynamodb_table.email_authentications_email_unique_index.name}"
}

output "email_authentications_user_id_unque_index_name" {
  value = "${aws_dynamodb_table.email_authentications_user_id_unique_index.name}"
}

output "users_table_name" {
  value = "${aws_dynamodb_table.users.name}"
}

output "users_email_unique_index_name" {
  value = "${aws_dynamodb_table.users_email_unique_index.name}"
}

output "users_user_name_unique_index_name" {
  value = "${aws_dynamodb_table.users_user_name_unique_index.name}"
}
