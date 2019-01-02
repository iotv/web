variable "org_name" {
  description = "The name of your organization to use for this terraform module"
  type        = "string"
  default     = "iotv"
}

variable "jwt_secret_version" {
  description = "A variable to control the rolling of JWT secrets"
  type        = "string"
  default     = "1"
}

variable "stage" {
  description = "The name of your environment to use for this terraform module"
  type        = "string"
  default     = "development"
}

variable "app_name" {
  description = "The name of your application to use for this terraform module"
  type        = "string"
  default     = "iotv-api"
}

variable "stack_name" {
  description = "The name of your stack to use for this terraform module"
  type        = "string"
  default     = "terraform-iotv-api"
}

variable "ffmpeg_version" {
  description = "The version of ffmpeg to download"
  type        = "string"
  default     = "4.0.3"
}
