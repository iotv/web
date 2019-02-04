resource "aws_dynamodb_table" "email_authentications" {
  attribute {
    name = "Email"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  global_secondary_index {
    hash_key        = "UserId"
    name            = "UserIdIndex"
    projection_type = "KEYS_ONLY"
    read_capacity   = 1
    write_capacity  = 1
  }

  hash_key      = "Email"
  name          = "EmailAuthentications"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Email Authentications DB"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "users" {
  attribute {
    name = "UserId"
    type = "S"
  }

  hash_key      = "UserId"
  name          = "Users-${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Users DB ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "users_username_unique_index" {
  attribute {
    name = "UserName"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  hash_key      = "UserName"
  name          = "UsersUserNameUniqueIndex-${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Users UserName Unique Index ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "users_email_unique_index" {
  attribute {
    name = "Email"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  hash_key = "Email"
  name     = "UsersEmailUniqueIndex-${var.stage}-${random_string.stack_id.result}"

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Users Email Unique Index ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}
