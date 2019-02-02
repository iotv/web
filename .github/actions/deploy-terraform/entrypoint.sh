#!/bin/sh

set -eu

terraform init \
    -backend-config="bucket=${TF_S3_BUCKET}" \
    -backend-config="region=${AWS_DEFAULT_REGION}" \
    -backend-config="key=develop/iotv-api.tfstate" \
    -backend-config="encrypt=true" \
    -backend-config="kms_key_id=${TF_KMS_KEY_ARN}" \
    -backend-config="dynamodb_table=${TF_DYNAMODB_TABLE}" \
    terraform/

terraform apply terraform/
