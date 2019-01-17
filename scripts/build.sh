#!/bin/sh

set -euo pipefail

export GOOS="linux"

if [ ! -f bin/ffmpeg-64bit-static.tar.xz ]; then
    mkdir -p bin/layers/ffmpeg
    mkdir -p bin/layers/ffprobe
    curl -L https://www.johnvansickle.com/ffmpeg/old-releases/ffmpeg-4.0.3-64bit-static.tar.xz -o bin/ffmpeg-64bit-static.tar.xz
fi

tar xf bin/ffmpeg-64bit-static.tar.xz -C bin/
mv bin/ffmpeg-4.0.3-64bit-static/ffmpeg bin/layers/ffmpeg/ffprove
mv bin/ffmpeg-4.0.3-64bit-static/ffprobe bin/layers/ffprobe/ffprobe
rm -rf bin/ffmpeg-git-*-amd64-static/

cd handlers/check_source_video
go build \
    -ldflags="-s -w" \
    -o ../../bin/check_source_video
cd ../../

cd handlers/graphql
go build \
    -ldflags="-s -w" \
    -o ../../bin/graphql
cd ../../

cd handlers/on_video_upload_complete
go build \
    -ldflags="-s -w" \
    -o ../../bin/on_video_upload_complete
cd ../../
