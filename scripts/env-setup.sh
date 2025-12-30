#!/bin/bash

# load environement variables from .env file if it exists
if [ -f .env ]; then
  set -a # enable exporting all variables
  source .env
  set +a # turn off allexport
fi

# git related things for pact
export GITHUB_SHA=$(git rev-parse --short HEAD)
export GITHUB_BRANCH=$(git rev-parse --abbrev-ref HEAD)
