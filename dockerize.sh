#!/bin/bash

version=${version:-"latest"}

while [ $# -gt 0 ]; do

  if [[ $1 == *"--"* ]]; then
    param="${1/--/}"
    declare $param="$2"
  fi

  shift
done

npm run docker-platform
npm run docker-dev --version=$version
npm run docker-platform-rm
