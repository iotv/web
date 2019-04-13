workflow "Build, test and deploy on push" {
  on = "push"
  resolves = ["Pulumi 2 DNS", "Invalidate Cloudfront Cache"]
}

# Level 0
action "Install Dependencies" {
  uses = "docker://node:8"
  runs = ["yarn"]
  args = ["install", "--frozen-lockfile"]  
}

action "Create Password Hash Build" {
  args = [
    "build",
    "-o",
    "packages/password-service/dist/create-password-hash",
    "packages/password-service/handlers/create-password-hash/main.go"
  ]
  runs = ["go"]
  uses = "docker://golang"
}

action "Verify Password Hash Build" {
  args = [
    "build",
    "-o",
    "packages/password-service/dist/verify-password-hash",
    "packages/password-service/handlers/verify-password-hash/main.go"
  ]  runs = ["go"]
  uses = "docker://golang"
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
action "Lerna Test" {
  args = ["test"]
  needs = ["Install Dependencies"]
  runs = ["yarn"]
  uses = "docker://node:8"
}

action "Lerna Build" {
  args = ["build"]
  needs = ["Install Dependencies"]
  runs = ["yarn"]
  uses = "docker://node:8"
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
  needs = ["Lerna Build", "Pulumi 1 Web", "Lerna Test"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  uses = "actions/aws/cli@master"
}

action "Deploy API" {
  env = {
    AWS_DEFAULT_REGION = "us-east-1"
  }
  needs = ["Lerna Build", "Pulumi 0 Code Deploy", "Pulumi 0 User DB", "Lerna Test", "Create Password Hash Build", "Verify Password Hash Build"]
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
