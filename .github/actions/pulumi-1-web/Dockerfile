FROM davidjfelix/pulumi

LABEL "com.github.actions.name"="Deploy Pulumi 1 Web"
LABEL "com.github.actions.description"="Deploy Pulumi 1 Web"
LABEL "com.github.actions.icon"="cloud-lightning"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="https://github.com/iotv/iotv"
LABEL "homepage"="https://iotv.co"
LABEL "maintainer"="David J Felix <felix.davidj@gmail.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
