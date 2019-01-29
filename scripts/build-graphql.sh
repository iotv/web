#!/bin/sh

set -eu

export GOOS="linux"

cd handlers/graphql
go build \
    -ldflags="-s -w" \
    -o ../../bin/graphql
cd ../../
