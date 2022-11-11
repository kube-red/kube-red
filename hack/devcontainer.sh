#!/bin/bash

set -xe

BASE=$(basename "${PWD}")
TARGET="/${BASE}"

# we have to be in group root (0) as otherwise npm install won't run
USER="$(id -u):0"

# this is to persist node_modules between starts
podman machine ssh mkdir -p "/tmp/${BASE}/node_modules"
podman machine ssh chown "${USER}" "/tmp/${BASE}/node_modules"
# SELinux ...
podman machine ssh chcon -Rt svirt_sandbox_file_t "/tmp/${BASE}/node_modules"
 
podman run \
    -it \
    -v $PWD:$TARGET \
    --mount "type=bind,source=${PWD},target=${TARGET}" \
    --mount "type=bind,source=/tmp/${BASE}/node_modules,target=$TARGET/node_modules" \
    --rm \
    --entrypoint /bin/bash \
    --user "${USER}" \
    --workdir $TARGET \
    --publish "1880:1880" \
    --publish "3000:3000" \
    nodered/node-red:latest
