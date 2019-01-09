variable "app_name" {
  type = "string"
  default = "iotv"
}

variable "hash_key" {
  type = "string"
}

variable "hash_key_type" {
  default = "S"
  type = "string"
}

variable "name" {
  type = "string"
}

variable "range_key" {
  default = ""
  type = "string"
}

variable "secondary_keys" {
  type = "map"
  default = {}
}

variable "stage" {
  type = "string"
}

variable "repository" {
  type = "string"
  default = "gitlab.com/iotv/services/iotv-api"
}