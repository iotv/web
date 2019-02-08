#!/bin/sh

set -eu

cd pulumi
yarn --frozen-lockfile
pulumi --non-interactive \
    up \
        --supress-outputs \
        --skip-preview \
        --stack dev
