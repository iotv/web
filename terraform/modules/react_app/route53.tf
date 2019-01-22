resource "aws_route53_record" "a_site" {
  name = "${var.cloudfront_aliases[0]}"
  type = "A"
  zone_id = "${var.hosted_zone_id}"

  alias {
    evaluate_target_health = false
    name = "${aws_cloudfront_distribution.site.domain_name}"
    zone_id = "${aws_cloudfront_distribution.site.hosted_zone_id}"
  }
}

resource "aws_route53_record" "aaaa_site" {
  name = "${var.cloudfront_aliases[0]}"
  type = "AAAA"
  zone_id = "${var.hosted_zone_id}"

  alias {
    evaluate_target_health = false
    name = "${aws_cloudfront_distribution.site.domain_name}"
    zone_id = "${aws_cloudfront_distribution.site.hosted_zone_id}"
  }
}