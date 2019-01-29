workflow "Build, test and deploy on push" {
  on = "push"
  resolves = ["Build graphql"]
}

action "Build graphql" {
  uses = "docker://golang@alpine"
  runs = "sh -c"
  args = "./scripts/build-graphql.sh"
}