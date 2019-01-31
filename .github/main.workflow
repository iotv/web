workflow "Build, test and deploy on push" {
  on = "push"
  resolves = ["Build graphql", "Install web dependencies"]
}

action "Build graphql" {
  uses = "docker://golang@alpine"
  runs = "sh -c"
  args = "./scripts/build-graphql.sh"
}

action "Install web dependencies" {
  uses = "./.github/actions/install-web-dependencies"
}