resource "aws_dynamodb_table" "authentications" {
  attribute {
    name = "AuthenticationId"
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

  hash_key      = "AuthenticationId"
  name          = "Authentications-${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Authentications Table  ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "authentications_email_authentication_id_unique_index" {
  attribute {
    name = "EmailAuthenticationId"
    type = "S"
  }

  hash_key      = "EmailAuthenticationId"
  name          = "AuthenticationsEmailUniqueIndex-${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Authentications Email Authentication Id Unique Index ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "email_authentications" {
  attribute {
    name = "EmailAuthenticationId"
    type = "S"
  }

  hash_key      = "EmailAuthenticationId"
  name          = "EmailAuthentications-${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Email Authentications Table ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "email_authentications_email_unique_index" {
  attribute {
    name = "Email"
    type = "S"
  }

  hash_key      = "Email"
  name          = "EmailAuthenticationsEmailUniqueIndex--${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Email Authentications Email Unique Index ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "email_authentications_user_id_unique_index" {
  attribute {
    name = "UserId"
    type = "S"
  }

  hash_key      = "UserId"
  name          = "EmailAuthenticationsUserIdUniqueIndex--${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Email Authentications User Id Unique Index ${random_string.stack_id.result}"
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
    Name        = "${var.app_name} Users Table ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}

resource "aws_dynamodb_table" "users_user_name_unique_index" {
  attribute {
    name = "UserName"
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

  hash_key      = "Email"
  name          = "UsersEmailUniqueIndex-${var.stage}-${random_string.stack_id.result}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Users Email Unique Index ${random_string.stack_id.result}"
    Stack       = "${var.org_name}-users"
  }
}
