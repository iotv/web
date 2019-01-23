output "cloudfront_distribution_id" {
  value = "${aws_cloudfront_distribution.site.id}"
}

output "s3_bucket_arn" {
  value = "${aws_s3_bucket.site.arn}"
}
