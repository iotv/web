workflow "Build, test and deploy on push" {
  on = "push"
  resolves = ["Pulumi 2 DNS", "Invalidate Cloudfront Cache"]
}

# Level 0
action "Install Dependencies" {
  uses = "docker://node"
  runs = ["yarn"]
  args = ["install", "--frozen-lockfile"]  
}

action "Pulumi 0 Code Deploy" {
  secrets = [
    "PULUMI_ACCESS_TOKEN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ]
  uses = "./.github/actions/pulumi-0-code-deploy"
}

action "Pulumi 0 Domain" {
  secrets = [
    "PULUMI_ACCESS_TOKEN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ]
  uses = "./.github/actions/pulumi-0-domain"
}

action "Pulumi 0 User DB" {
  secrets = [
    "PULUMI_ACCESS_TOKEN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ]
  uses = "./.github/actions/pulumi-0-user-db"
}

# Level 1
action "Test" {
  args = ["test"]
  needs = ["Install Dependencies"]
  runs = ["yarn"]
  uses = "docker://node"
}

action "Build" {
  args = ["build"]
  needs = ["Install Dependencies"]
  runs = ["yarn"]
  uses = "docker://node"
}

action "Pulumi 1 Web" {
  needs = ["Pulumi 0 Domain"]
  secrets = [
    "PULUMI_ACCESS_TOKEN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ]
  uses = "./.github/actions/pulumi-1-web"
}

# Level 2
action "Deploy Web" {
  args = "s3 sync ./packages/web/build s3://`jq -r .bucketName ./pulumi/pulumi-1-web/dist/output.json`"
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
  }
  needs = ["Build", "Pulumi 1 Web", "Test"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "actions/aws/cli@master"
}

action "Deploy API" {
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
  }
  needs = ["Build", "Pulumi 0 Code Deploy", "Pulumi 0 User DB", "Test"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "./.github/actions/deploy-api"
}

# Level 3
action "Pulumi 1 GraphQL Service" {
  needs = ["Deploy API"]
  secrets = [
    "PULUMI_ACCESS_TOKEN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ]
  uses = "./.github/actions/pulumi-1-graphql-service"
}

action "Invalidate Cloudfront Cache" {
  args = "cloudfront create-invalidation --distribution-id `jq -r .distributionId ./pulumi/pulumi-1-web/dist/output.json` --paths '/*'"
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
  }
  needs = ["Deploy Web"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "actions/aws/cli@master"
}

# Level 4
action "Pulumi 2 DNS" {
  needs = ["Pulumi 0 Domain", "Pulumi 1 GraphQL Service", "Pulumi 1 Web"]
  secrets = [
    "PULUMI_ACCESS_TOKEN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ]
  uses = "./.github/actions/pulumi-2-dns"
}
