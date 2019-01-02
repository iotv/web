#!/bin/sh

set -euo pipefail

export GOOS="linux"
AWS_DEFAULT_REGION="us-east-1"
DYNAMODB_TABLE="iotv-terraform-locks"
KMS_KEY_ARN="arn:aws:kms:us-east-1:291585690921:key/f22b80ef-e7e5-4f60-b430-d54c3f1a2c5a"
S3_BUCKET="iotv-tf20180213040614675300000003"

if [ ! -e bin/ffmpeg-amd64-static.tar.xz ]; then
    mkdir -p bin/layers/ffmpeg
    mkdir -p bin/layers/ffprobe
    curl -L https://www.johnvansickle.com/ffmpeg/old-releases/ffmpeg-4.0.3-64bit-static.tar.xz -o bin/ffmpeg-64bit-static.tar.xz
    tar xf bin/ffmpeg-64bit-static.tar.xz -C bin/
    mv bin/ffmpeg-4.0.3-64bit-static/ffmpeg bin/layers/ffmpeg/ffprove
    mv bin/ffmpeg-4.0.3-64bit-static/ffprobe bin/layers/ffprobe/ffprobe
    rm -rf bin/ffmpeg-git-*-amd64-static/
fi

dep ensure

go build \
    -ldflags="-s -w" \
    -o bin/check_source_video \
    handlers/check_source_video/main.go

go build \
    -ldflags="-s -w" \
    -o bin/graphql \
    handlers/graphql/main.go

go build \
    -ldflags="-s -w" \
    -o bin/on_video_transcoding_complete \
    handlers/on_video_transcoding_complete/main.go

go build \
    -ldflags="-s -w" \
    -o bin/on_video_upload_complete \
    handlers/on_video_upload_complete/main.go


terraform init \
    -backend-config="bucket=${S3_BUCKET}" \
    -backend-config="region=${AWS_DEFAULT_REGION}" \
    -backend-config="key=develop/iotv-api.tfstate" \
    -backend-config="encrypt=true" \
    -backend-config="kms_key_id=${KMS_KEY_ARN}" \
    -backend-config="dynamodb_table=${DYNAMODB_TABLE}" \
    terraform/

terraform apply terraform/