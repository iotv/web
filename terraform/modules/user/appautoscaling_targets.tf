resource "aws_appautoscaling_target" "authentications_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.authentications.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "authentications_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.authentications.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "authentications_user_id_index_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.authentications.name}/index/UserIdIndex"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:index:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "authentications_user_id_index_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.authentications.name}/index/UserIdIndex"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:index:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "authentications_email_authentication_id_unique_index_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.authentications_email_authentication_id_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "authentications_email_authentication_id_unique_index_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.authentications_email_authentication_id_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "email_authentications_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.email_authentications.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "email_authentications_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.email_authentications.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "email_authentications_email_unique_index_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.email_authentications_email_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "email_authentications_email_unique_index_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.email_authentications_email_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "email_authentications_user_id_unique_index_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.email_authentications_user_id_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "email_authentications_user_id_unique_index_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.email_authentications_user_id_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "users_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.users.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "users_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.users.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "users_email_unique_index_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.users_email_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "users_email_unique_index_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.users_email_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "users_user_name_unique_index_read" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.users_user_name_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace = "dynamodb"
}

resource "aws_appautoscaling_target" "users_user_name_unique_index_write" {
  max_capacity = "${var.max_as}"
  min_capacity = "${var.min_as}"
  resource_id = "table/${aws_dynamodb_table.users_user_name_unique_index.name}"
  role_arn = "${aws_iam_service_linked_role.dynamodb_autoscaling.arn}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace = "dynamodb"
}
