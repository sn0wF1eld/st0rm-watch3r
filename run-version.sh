#!/bin/bash

version=${version:-"latest"}
name="sn0wf1eld/st0rm-watch3r"

while [ $# -gt 0 ]; do

  if [[ $1 == *"--"* ]]; then
    param="${1/--/}"
    declare $param="$2"
  fi

  shift
done

docker run --sysctl net.ipv4.tcp_keepalive_intvl=10 \
 --sysctl net.ipv4.tcp_keepalive_probes=20 \
 --sysctl net.ipv4.tcp_keepalive_time=180 \
 -p 3000:3000 \
 -it -d $name":"$version
