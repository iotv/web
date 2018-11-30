resource "aws_kms_key" "s3" {
  description         = "The key for s3 encryption for ${var.app_name}"
  enable_key_rotation = true
}

resource "aws_kms_key" "lambda" {
  description         = "The key for lambda environment encryption for ${var.app_name}"
  enable_key_rotation = true
}

resource "aws_kms_key" "jwt" {
  description         = "The key for SSM encryption on the JWT secret for ${var.app_name}"
  enable_key_rotation = true
}
