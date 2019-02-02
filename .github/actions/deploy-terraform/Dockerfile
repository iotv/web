FROM hashicorp/terraform

LABEL "com.github.actions.name"="Deploy terraform"
LABEL "com.github.actions.description"="Deploy the terraform stack"
LABEL "com.github.actions.icon"="server"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="https://github.com/iotv/iotv"
LABEL "homepage"="https://iotv.co"
LABEL "maintainer"="David J Felix <felix.davidj@gmail.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
