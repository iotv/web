#!/bin/sh

set -eu

cd pulumi/pulumi-1-graphql-service
mkdir dist
yarn install --frozen-lockfile
pulumi config set graphql graphql/graphql.${GITHUB_SHA}.zip --stack dev
pulumi config set createPasswordHash password/create-password-hash.${GITHUB_SHA}.zip --stack dev
pulumi config set verifyPasswordHash password/verify-password-hash.${GITHUB_SHA}.zip --stack dev

pulumi --non-interactive \
    up \
        --suppress-outputs \
        --skip-preview \
        --stack dev
pulumi stack output --stack dev --json  > ./dist/output.json
