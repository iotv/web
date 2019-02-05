module "users" {
  source = "./modules/user"

  app_name  = "iotv"
  max_as    = "10"
  min_as    = "1"
  org_name  = "iotv"
  stage     = "development"
  target_as = "70"
}
