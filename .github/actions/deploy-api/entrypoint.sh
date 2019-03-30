#!/bin/sh

set -eu

export AWS_DEFAULT_REGION=us-east-1
export AWS_DEFAULT_OUTPUT=json

cd packages/graphql-service/
zip -r -j dist/graphql.zip dist/*
aws s3api put-object --bucket `` --key "graphql/graphql.${GITHUB_SHA}.zip" --body dist/graphql.zip
