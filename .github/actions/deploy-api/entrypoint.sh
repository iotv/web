#!/bin/sh

set -eu

export AWS_DEFAULT_REGION=us-east-1
export AWS_DEFAULT_OUTPUT=json

cd packages/graphql-service/
zip -r dist/graphql.zip ./*
aws s3api put-object --bucket `jq -r .bucketName ../../pulumi/pulumi-0-code-deploy/dist/output.json` --key "graphql/graphql.${GITHUB_SHA}.zip" --body dist/graphql.zip

cd packages/password-service/
zip dist/create-password-hash.zip dist/create-password-hash
zip dist/validate-password-hash.zip dist/validate-password-hash
aws s3api put-object --bucket `jq -r .bucketName ../../pulumi/pulumi-0-code-deploy/dist/output.json` --key "password/create-password-hash.${GITHUB_SHA}.zip" --body dist/create-password-hash.zip
aws s3api put-object --bucket `jq -r .bucketName ../../pulumi/pulumi-0-code-deploy/dist/output.json` --key "password/validate-password-hash.${GITHUB_SHA}.zip" --body dist/validate-password-hash.zip
