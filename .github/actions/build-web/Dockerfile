FROM node

LABEL "com.github.actions.name"="Install Web Dependencies"
LABEL "com.github.actions.description"="Enter the web subdirectory and build"
LABEL "com.github.actions.icon"="archive"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="https://github.com/iotv/iotv"
LABEL "homepage"="https://iotv.co"
LABEL "maintainer"="David J Felix <felix.davidj@gmail.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
