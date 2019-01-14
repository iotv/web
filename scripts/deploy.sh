#!/bin/sh

set -euo pipefail

export GOOS="linux"
AWS_DEFAULT_REGION="us-east-1"
DYNAMODB_TABLE="iotv-terraform-locks"
KMS_KEY_ARN="arn:aws:kms:us-east-1:291585690921:key/f22b80ef-e7e5-4f60-b430-d54c3f1a2c5a"
S3_BUCKET="iotv-tf20180213040614675300000003"

terraform init \
    -backend-config="bucket=${S3_BUCKET}" \
    -backend-config="region=${AWS_DEFAULT_REGION}" \
    -backend-config="key=develop/iotv-api.tfstate" \
    -backend-config="encrypt=true" \
    -backend-config="kms_key_id=${KMS_KEY_ARN}" \
    -backend-config="dynamodb_table=${DYNAMODB_TABLE}" \
    terraform/

terraform apply terraform/

#yarn run serverless deploy --stage=$(jq -r ".stage" ./bin/.terraform-output)
