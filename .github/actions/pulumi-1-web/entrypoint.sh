#!/bin/sh

set -eu

cd pulumi/pulumi-1-web
mkdir dist
yarn install --frozen-lockfile
pulumi --non-interactive \
    up \
        --suppress-outputs \
        --skip-preview \
        --stack dev
pulumi stack output --stack dev --json  > ./dist/output.json