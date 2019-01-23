#!/bin/sh

set -euo pipefail

AWS_DEFAULT_REGION="us-east-1"
TF_DYNAMODB_TABLE="iotv-terraform-locks"
TF_KMS_KEY_ARN="arn:aws:kms:us-east-1:291585690921:key/f22b80ef-e7e5-4f60-b430-d54c3f1a2c5a"
TF_S3_BUCKET="iotv-tf20180213040614675300000003"

# FIXME: un-hardcode this
CF_S3_BUCKET="iotv.co20190122045620192200000001"
CF_DISTRIBUTION="E3PEFH4AQE9D5S"

terraform init \
    -backend-config="bucket=${TF_S3_BUCKET}" \
    -backend-config="region=${AWS_DEFAULT_REGION}" \
    -backend-config="key=develop/iotv-api.tfstate" \
    -backend-config="encrypt=true" \
    -backend-config="kms_key_id=${TF_KMS_KEY_ARN}" \
    -backend-config="dynamodb_table=${TF_DYNAMODB_TABLE}" \
    terraform/

terraform apply terraform/

yarn run serverless deploy --stage=$(jq -r ".stage" ./bin/.terraform-output)
aws s3 sync web/build s3://${CF_S3_BUCKET}
aws cloudfront create-invalidation --distribution-id ${CF_DISTRIBUTION} --paths '/*'
