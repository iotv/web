variable "deployment_bucket" {
  description = "The bucket to deploy lambda code into"
  type        = "string"
}

variable "role_arn" {
  description = "The IAM role ARN which the lambda will use as an execution role"
  type        = "string"
}

variable "runtime" {
  description = "The lambda runtime"
  type        = "string"
}
