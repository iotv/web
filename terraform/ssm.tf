resource "random_string" "jwt_secret" {
  keepers {
    version = "${var.jwt_secret_version}"
  }

  length = 96
}

resource "aws_ssm_parameter" "jwt_secret" {
  description = "The secret for JWT"
  key_id      = "${aws_kms_key.jwt.arn}"
  name        = "/services/iotv-api/${var.stage}/JWT_SECRET"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "JWT secret"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "SecureString"
  value = "${random_string.jwt_secret.result}"
}

resource "aws_ssm_parameter" "authentications_table" {
  description = "The authentications DynamoDB table"
  name        = "/services/iotv-api/${var.stage}/AUTHENTICATIONS_TABLE"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "authentications DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.authentications_table_name}"
}

resource "aws_ssm_parameter" "authentications_email_authentication_id_unique_index" {
  description = "The authentications DynamoDB table's unique index for email authentication id"
  name        = "/services/iotv-api/${var.stage}/AUTHENTICATIONS_EMAIL_AUTHENTICATION_ID_UNIQUE_INDEX"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "authentications emailAuthenticationId unique index DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.authentications_email_authentication_id_unique_index_name}"
}

resource "aws_ssm_parameter" "email_authentications_table" {
  description = "The email authentications DynamoDB table"
  name        = "/services/iotv-api/${var.stage}/EMAIL_AUTHENTICATIONS_TABLE"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "email authentications DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.email_authentications_table_name}"
}

resource "aws_ssm_parameter" "email_authentications_email_unique_index" {
  description = "The email authentications DynamoDB table's unique index for email"
  name        = "/services/iotv-api/${var.stage}/EMAIL_AUTHENTICATIONS_EMAIL_UNIQUE_INDEX"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "email authentications email unique index DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.email_authentications_email_unique_index_name}"
}

resource "aws_ssm_parameter" "email_authentications_user_id_unique_index" {
  description = "The email authentications DynamoDB table's unique index for user id"
  name        = "/services/iotv-api/${var.stage}/EMAIL_AUTHENTICATIONS_USER_ID_UNIQUE_INDEX"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "email authentications email unique index DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.email_authentications_user_id_unique_index_name}"
}


resource "aws_ssm_parameter" "source_videos_bucket" {
  description = "The source videos S3 Bucket"
  name        = "/services/iotv-api/${var.stage}/SOURCE_VIDEOS_BUCKET"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "source videos S3 Bucket"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_s3_bucket.source_videos.id}"
}

resource "aws_ssm_parameter" "source_videos_table" {
  description = "The source videos DynamoDB table"
  name        = "/services/iotv-api/${var.stage}/SOURCE_VIDEOS_TABLE"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "source videos DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_dynamodb_table.source_videos.name}"
}

resource "aws_ssm_parameter" "users_table" {
  description = "The users DynamoDB table"
  name        = "/services/iotv-api/${var.stage}/USERS_TABLE"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "users DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.users_table_name}"
}

resource "aws_ssm_parameter" "users_email_unique_index" {
  description = "The users DynamoDB table's unique index for email"
  name        = "/services/iotv-api/${var.stage}/USERS_EMAIL_UNIQUE_INDEX"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "users email unique index DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.users_email_unique_index_name}"
}

resource "aws_ssm_parameter" "users_user_name_unique_index" {
  description = "The users DynamoDB table' unique index for user name"
  name        = "/services/iotv-api/${var.stage}/USERS_USER_NAME_UNIQUE_INDEX"

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "users userName unique index DynamoDB table"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${module.users.users_user_name_unique_index_name}"
}

resource "aws_ssm_parameter" "lambda_kms_arn" {
  description = "The role arn for the lambda kms kkey"
  name        = "/services/iotv-api/${var.stage}/LAMBDA_KMS_ARN"
  overwrite   = true

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "Lambda KMS arn"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_kms_key.lambda.arn}"
}

resource "aws_ssm_parameter" "lambda_role_arn" {
  description = "The role arn for lambda"
  name        = "/services/iotv-api/${var.stage}/LAMBDA_ROLE_ARN"
  overwrite   = true

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "Lambda role arn"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_iam_role.api_lambda.arn}"
}

resource "aws_ssm_parameter" "source_video_uploaded_arn" {
  description = "The ARN for the source-vide-uploaded SNS topic"
  name        = "/services/iotv-api/${var.stage}/SOURCE_VIDEO_UPLOADED_ARN"
  overwrite   = true

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "Source video uploaded ARN"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_sns_topic.source_video_uploaded.arn}"
}

resource "aws_ssm_parameter" "video_encoder_complete_arn" {
  description = "The ARN for the video-encoder-complete SNS topic"
  name        = "/services/iotv-api/${var.stage}/VIDEO_ENCODER_COMPLETE_ARN"
  overwrite   = true

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "Video encoder complete ARN"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_sns_topic.video_encoder_completed.arn}"
}

resource "aws_ssm_parameter" "video_encoder_error_arn" {
  description = "The ARN for the video-encoder-error SNS topic"
  name        = "/services/iotv-api/${var.stage}/VIDEO_ENCODER_ERROR_ARN"
  overwrite   = true

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "Video encoder error ARN"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_sns_topic.video_encoder_error.arn}"
}

resource "aws_ssm_parameter" "video_encoder_progressing_arn" {
  description = "The ARN for the video-encoder-progressing SNS topic"
  name        = "/services/iotv-api/${var.stage}/VIDEO_ENCODER_PROGRESSING_ARN"
  overwrite   = true

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "Video encoder progressing ARN"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_sns_topic.video_encoder_progressing.arn}"
}

resource "aws_ssm_parameter" "video_encoder_warning_arn" {
  description = "The ARN for the video-encoder-warning SNS topic"
  name        = "/services/iotv-api/${var.stage}/VIDEO_ENCODER_WARNING_ARN"
  overwrite   = true

  tags {
    Application = "iotv-api"
    Terraform   = "true"
    Name        = "Video encoder warning ARN"
    Repo        = "https://gitlab.com/iotv/services/iotv-api"
    Stage       = "${var.stage}"
  }

  type  = "String"
  value = "${aws_sns_topic.video_encoder_warning.arn}"
}

