variable "app_name" {}
variable "org_name" {}
variable "stage" {}


resource "random_string" "stack_id" {
  length  = 8
  special = false
}
