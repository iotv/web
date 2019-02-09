#!/bin/sh

set -eu

cd pulumi
yarn install --frozen-lockfile
pulumi --non-interactive \
    up \
        --suppress-outputs \
        --skip-preview \
        --stack dev
