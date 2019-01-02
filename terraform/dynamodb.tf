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
    read_capacity   = 1
    write_capacity  = 1
  }

  hash_key      = "EmailAddress"
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
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}

resource "aws_dynamodb_table" "encoding_levels" {
  attribute {
    name = "EncodingLevelId"
    type = "S"
  }

  attribute {
    name = "OwnerUserId"
    type = "S"
  }

  global_secondary_index {
    hash_key        = "OwnerUserId"
    name            = "OwnerUserIdIndex"
    projection_type = "KEYS_ONLY"
    read_capacity   = 1
    write_capacity  = 1
  }

  hash_key      = "EncodingLevelId"
  name          = "EncodingLevels"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Encoding Levels DB"
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
    read_capacity   = 1
    write_capacity  = 1
  }

  hash_key      = "SourceVideoId"
  name          = "SourceVideos"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

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
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Users DB"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}

resource "aws_dynamodb_table" "video_segments" {
  attribute {
    name = "EncodingLevel"
    type = "N"
  }

  attribute {
    name = "EncodingLevelId"
    type = "S"
  }

  attribute {
    name = "SourceVideoId"
    type = "S"
  }

  attribute {
    name = "VideoSegmentId"
    type = "S"
  }

  global_secondary_index {
    hash_key        = "EncodingLevelId"
    name            = "EncodingLevelIdIndex"
    projection_type = "KEYS_ONLY"
    read_capacity   = 1
    write_capacity  = 1
  }

  global_secondary_index {
    hash_key        = "SourceVideoId"
    name            = "SourceVideoIdIndex"
    projection_type = "KEYS_ONLY"
    read_capacity   = 1
    write_capacity  = 1
  }

  hash_key  = "VideoSegmentId"
  range_key = "EncodingLevel"

  name          = "VideoSegments"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  write_capacity = 1

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Name        = "${var.app_name} Video Segments DB"
    Stack       = "${var.org_name}-${var.stack_name}"
  }
}
