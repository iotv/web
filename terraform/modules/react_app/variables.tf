variable "site_name" {
  type        = "string"
  description = "The human name for the static site"
}

variable "https_acm_cert_arn" {
  type        = "string"
  description = "The arn of the ACM-managed HTTPS certificate used by cloudfront"
}

variable "cloudfront_aliases" {
  type        = "list"
  description = "A list of domain aliases for cloudfront to accept for the site"
}
