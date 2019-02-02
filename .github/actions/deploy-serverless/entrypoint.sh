#!/bin/bash

set -eu

yarn run serverless deploy --stage=$(jq -r ".stage" ./bin/.terraform-output)
