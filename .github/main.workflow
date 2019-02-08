workflow "Build, test and deploy on push" {
  on = "push"
  resolves = ["Deploy serverless", "Deploy Pulumi", "Invalidate cloudfront cache"]
}

action "Install web dependencies" {
  uses = "./.github/actions/install-web-dependencies"
}

action "Install serverless dependencies" {
  uses = "./.github/actions/install-serverless-dependencies"
}

action "Build web" {
  needs = ["Install web dependencies"]
  uses = "./.github/actions/build-web"
}

action "Build graphql" {
  uses = "./.github/actions/build-graphql"
}

action "Deploy Pulumi" {
  needs = ["Build web", "Build graphql"]
  secrets = [
    "PULUMI_ACCESS_TOKEN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ]
  uses = "./.github/actions/deploy-pulumi"
}

action "Deploy terraform" {
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
    TF_DYNAMODB_TABLE = "iotv-terraform-locks"
    TF_KMS_KEY_ARN = "arn:aws:kms:us-east-1:291585690921:key/f22b80ef-e7e5-4f60-b430-d54c3f1a2c5a"
    TF_S3_BUCKET = "iotv-tf20180213040614675300000003"
  }
  needs = ["Build web", "Build graphql"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "./.github/actions/deploy-terraform"
}

action "Deploy web" {
  args = "s3 sync web/build s3://`jq -r .web_bucket_id ./bin/.terraform-output`"
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
  }
  needs = ["Deploy terraform", "Deploy serverless"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "actions/aws/cli@master"
}

action "Deploy serverless" {
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
  }
  needs = ["Deploy terraform", "Install serverless dependencies"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "./.github/actions/deploy-serverless"
}

action "Invalidate cloudfront cache" {
  args = "cloudfront create-invalidation --distribution-id `jq -r .web_distribution_id ./bin/.terraform-output` --paths '/*'"
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
  }
  needs = ["Deploy web"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "actions/aws/cli@master"
}
