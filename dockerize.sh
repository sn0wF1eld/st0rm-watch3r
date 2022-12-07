#!/bin/bash

version=${version:-"latest"}

NAME="sn0wf1eld/clojure-data-grinder-monitor"

while [ $# -gt 0 ]; do

  if [[ $1 == *"--"* ]]; then
    param="${1/--/}"
    declare $param="$2"
  fi

  shift
done

docker buildx create --use

docker buildx build --platform linux/arm64/v8,linux/amd64 --push --tag $NAME":"$version .

docker buildx rm
