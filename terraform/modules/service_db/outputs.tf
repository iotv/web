output "table_arn" {
  value = "${var.range_key == "" ? aws_dynamodb_table.service_db_without_range_key.0.arn : aws_dynamodb_table.service_db_with_range_key.0.arn}"
}
