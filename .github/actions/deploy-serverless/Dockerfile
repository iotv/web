FROM node

RUN apt-get update && apt-get install -y \
  jq \
  && rm -rf /var/lib/apt/lists/*

LABEL "com.github.actions.name"="Build web"
LABEL "com.github.actions.description"="Enter the web subdirectory and build"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/iotv/iotv"
LABEL "homepage"="https://iotv.co"
LABEL "maintainer"="David J Felix <felix.davidj@gmail.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
