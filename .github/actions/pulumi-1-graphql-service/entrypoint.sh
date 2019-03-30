#!/bin/sh

set -eu

cd pulumi/pulumi-1-graphql-service
mkdir dist
yarn install --frozen-lockfile
pulumi config set graphql graphql/graphql.${GITHUB_SHA}.zip
pulumi --non-interactive \
    up \
        --suppress-outputs \
        --skip-preview \
        --stack dev
pulumi stack output --stack dev --json  > ./dist/output.json
