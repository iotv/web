workflow "Build, test and deploy on push" {
  on = "push"
  resolves = ["Build web", "Build graphql"]
}

action "Install web dependencies" {
  uses = "./.github/actions/install-web-dependencies"
}

action "Build web" {
  needs = ["Install web dependencies"]
  uses = "./.github/actions/build-web"
}

action "Build graphql" {
  uses = "./.github/actions/build-graphql"
}