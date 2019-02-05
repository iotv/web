module "users" {
  source = "./modules/user"

  org_name = "iotv"
  app_name = "iotv"
  stage = "development"
}