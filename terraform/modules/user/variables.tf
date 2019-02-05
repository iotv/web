variable "app_name" {}
variable "org_name" {}
variable "stage" {}

variable "min_as" {}
variable "max_as" {}
variable "target_as" {}


resource "random_string" "stack_id" {
  length  = 8
  special = false
}
