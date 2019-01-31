workflow "Build, test and deploy on push" {
  on = "push"
  resolves = ["Install web dependencies"]
}

action "Install web dependencies" {
  uses = "./.github/actions/install-web-dependencies"
}