data "aws_iam_policy_document" "site" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.site.id}/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.site.iam_arn}"]
    }
  }
}


resource "aws_s3_bucket" "site" {
  acl = "private"

  bucket_prefix = "${var.site_name}"

  tags {
    Terraform                = "true"
    IntentionallyUnencrypted = "true"
    SPABucket                = "true"
    SSE_Exception            = "True"
    Application              = "${var.site_name} Cloudfront site"
    Name                     = "${var.site_name} static website bucket"
  }

  website {
    error_document = "index.html"
    index_document = "index.html"
  }
}

# Stick a placeholder file in the bucket so cloudfront will reach a usable state ever
resource "aws_s3_bucket_object" "site_index" {
  bucket  = "${aws_s3_bucket.site.id}"
  key     = "index.html"
  content = "placholder index"

  # This lifecycle rule should prevent overwriting of any index file placed after the initial run
  lifecycle {
    ignore_changes = ["*"]
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = "${aws_s3_bucket.site.id}"
  policy = "${data.aws_iam_policy_document.site.json}"
}
