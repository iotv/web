#!/bin/sh

set -eu

export AWS_DEFAULT_REGION=us-east-1
export AWS_DEFAULT_OUTPUT=json

cd packages/graphql-service/
zip -r dist/graphql.zip ./*
aws s3api put-object --bucket `jq -r .bucketName ../../pulumi/pulumi-0-code-deploy/dist/output.json` --key "graphql/graphql.${GITHUB_SHA}.zip" --body dist/graphql.zip

cd packages/password-service/
zip dist/createPasswordHash.zip dist/createPasswordHash
zip dist/validatePasswordHash.zip dist/validatePasswordHash
aws s3api put-object --bucket `jq -r .bucketName ../../pulumi/pulumi-0-code-deploy/dist/output.json` --key "password/createPassword.${GITHUB_SHA}.zip" --body dist/createPassword.zip
aws s3api put-object --bucket `jq -r .bucketName ../../pulumi/pulumi-0-code-deploy/dist/output.json` --key "password/validatePassword.${GITHUB_SHA}.zip" --body dist/validatePassword.zip
