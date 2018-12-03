resource "aws_dynamodb_table" "email_authentications" {
  attribute {
    name = "EmailAddress"
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
    read_capacity   = 5
    write_capacity  = 5
  }

  hash_key      = "EmailAddress"
  name          = "EmailAuthentications"
  read_capacity = 5

  server_side_encryption {
    enabled = true
  }

  write_capacity = 5

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Email Authentications DB"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}

resource "aws_dynamodb_table" "source_videos" {
  attribute {
    name = "OwnerUserId"
    type = "S"
  }

  attribute {
    name = "SourceVideoId"
    type = "S"
  }

  global_secondary_index {
    hash_key        = "OwnerUserId"
    name            = "OwnerUserIdIndex"
    projection_type = "KEYS_ONLY"
    read_capacity   = 5
    write_capacity  = 5
  }

  hash_key = "SourceVideoId"
  name = "SourceVideos"
  read_capacity = 5

  server_side_encryption {
    enabled = true
  }

  write_capacity = 5

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Source Videos DB"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}

resource "aws_dynamodb_table" "users" {
  attribute {
    name = "UserId"
    type = "S"
  }

  hash_key      = "UserId"
  name          = "Users"
  read_capacity = 5

  server_side_encryption {
    enabled = true
  }

  write_capacity = 5

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Users DB"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}
