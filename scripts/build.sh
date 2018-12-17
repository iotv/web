#!/bin/sh

export GOOS="linux"
AWS_DEFAULT_REGION="us-east-1"
DYNAMODB_TABLE="iotv-terraform-locks"
KMS_KEY_ARN="arn:aws:kms:us-east-1:291585690921:key/f22b80ef-e7e5-4f60-b430-d54c3f1a2c5a"
S3_BUCKET="iotv-tf20180213040614675300000003"


mkdir -p bin/layers/ffmpeg
mkdir -p bin/layers/ffprobe
curl -L https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz -o bin/ffmpeg-git-amd64-static.tar.xz
tar xf bin/ffmpeg-git-amd64-static.tar.xz -C bin/
mv bin/ffmpeg-git-*-amd64-static/ffmpeg bin/layers/ffmpeg/ffmpeg
mv bin/ffmpeg-git-*-amd64-static/ffprobe bin/layers/ffprobe/ffprobe

dep ensure

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