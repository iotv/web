module "iotv_co" {
  source = "./modules/react_app"

  site_name = "iotv.co"
  https_acm_cert_arn = "arn:aws:acm:us-east-1:291585690921:certificate/a3e16c49-d647-4768-9f79-2eb7f2f771d4"
  cloudfront_aliases = ["b.iotv.co"]
}