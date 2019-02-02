FROM node

LABEL "com.github.actions.name"="Install serverless dependencies"
LABEL "com.github.actions.description"="Install dependencies for serverless deploy"
LABEL "com.github.actions.icon"="grid"
LABEL "com.github.actions.color"="orange"

LABEL "repository"="https://github.com/iotv/iotv"
LABEL "homepage"="https://iotv.co"
LABEL "maintainer"="David J Felix <felix.davidj@gmail.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
