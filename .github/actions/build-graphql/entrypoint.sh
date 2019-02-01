#!/bin/bash

set -eu

cd handlers/graphql
go build \
  -ldflags="-s -w" \
  -o ../../bin/graphql
