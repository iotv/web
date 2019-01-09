resource "aws_dynamodb_table" "service_db_with_range_key" {
  count = "${var.range_key == "" ? 0 : 1}"

  attribute {
    name = "${var.hash_key}"
    type = "${var.hash_key_type}"
  }

  attribute {
    count = "${length(keys(var.secondary_keys))}"
    name  = "${element(keys(var.secondary_keys), count.index)}"
    type  = "${lookup(var.secondary_keys, element(keys(var.secondary_keys), count.index))}"
  }

  global_secondary_index {
    count           = "${length(keys(var.secondary_keys))}"
    hash_key        = "${element(keys(var.secondary_keys), count.index)}"
    name            = "${element(keys(var.secondary_keys), count.index)}Index"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }

  hash_key      = "${var.hash_key}"
  name          = "${var.name}${var.stage}"
  range_key     = "${var.range_key}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Module      = "service_db"
    Name        = "${var.name} ${var.stage} DB"
    Repository  = "${var.repository}"
  }

  write_capacity = 1
}

resource "aws_dynamodb_table" "service_db_without_range_key" {
  count = "${var.range_key == "" ? 1 : 0}"

  attribute {
    name = "${var.hash_key}"
    type = "${var.hash_key_type}"
  }

  attribute {
    count = "${length(keys(var.secondary_keys))}"
    name  = "${element(keys(var.secondary_keys), count.index)}"
    type  = "${lookup(var.secondary_keys, element(keys(var.secondary_keys), count.index))}"
  }

  global_secondary_index {
    count           = "${length(keys(var.secondary_keys))}"
    hash_key        = "${element(keys(var.secondary_keys), count.index)}"
    name            = "${element(keys(var.secondary_keys), count.index)}Index"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }

  hash_key      = "${var.hash_key}"
  name          = "${var.name}${var.stage}"
  read_capacity = 1

  server_side_encryption {
    enabled = true
  }

  tags {
    Application = "${var.app_name}"
    Environment = "${var.stage}"
    Module      = "service_db"
    Name        = "${var.name} ${var.stage} DB"
    Repository  = "${var.repository}"
  }

  write_capacity = 1
}
