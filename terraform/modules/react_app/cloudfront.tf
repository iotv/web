resource "aws_cloudfront_origin_access_identity" "site" {
  comment = "${var.site_name}"
}

resource "aws_cloudfront_distribution" "site" {
  aliases = "${var.cloudfront_aliases}"

  custom_error_response {
    error_code         = "403"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = "400"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]
    compress        = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    target_origin_id       = "S3"
    viewer_protocol_policy = "redirect-to-https"
  }

  default_root_object = "index.html"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true

  origin {
    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.site.cloudfront_access_identity_path}"
    }

    domain_name = "${aws_s3_bucket.site.bucket_regional_domain_name}"
    origin_id   = "S3"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "${var.https_acm_cert_arn}"
    ssl_support_method  = "sni-only"
  }
}