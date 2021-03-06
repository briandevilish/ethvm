#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/utils.sh

# verify we have required utilities installed
ensure

# invalid - prints invalid message
invalid() {
  >&2 echo "Invalid argument passed!"
  >&2 echo ""
}

# usage - prints the help for this command
usage() {
  echo ""
  echo "Builds different docker images easily for EthVM project."
  echo ""
  echo "Usage:"
  echo "    ethvm docker-build <command>"
  echo ""
  echo "Commands:"
  echo "    build <image>  Build a docker image from this repo."
  echo "    push  <image>  Push an image to the registered docker registry."
  echo "    help           Print version information and exit."
  echo ""
  echo "Images:"
  echo "    $(jq -r '[.projects[].id] | join(", ")' $PROJECTS_PATH)"
}

# build - builds docker images
build() {
  local name=$(jq -r '.id' <<< "$1")
  local dockerfile=$(eval echo -e $(jq -r '.dockerfile' <<< "$1"))
  local context=$(eval echo -e $(jq -r '.context' <<< "$1"))
  local raw_version=$(eval echo -e $(jq -r '.version' <<< "$1"))
  local version=$(to_version "${raw_version}")

  docker build -t "${ORG}/${name}:${version}" -f "${dockerfile}" "${context}"
}

# push - sends the built docker image to the registered registry
push() {
  local name=$(jq -r '.id' <<< "$1")
  local raw_version=$(eval echo -e $(jq -r '.version' <<< "$1"))
  local version=$(to_version $raw_version)

  docker push "${ORG}/${name}:${version}"
}

process_subcommand() {
  local action=$1
  local image=$2

  case ${image} in
    *)
      # Test if image var is empty
      if [[ -z $image ]]; then
        invalid
        usage
        exit 0
      fi

      # Iterate our projects
      local builds=false
      for project in $(jq -car '.projects[]' $PROJECTS_PATH); do
        local id=$(jq -r '.id' <<< "$project")
        if [[ $image == "all" || $image == $id ]]; then
          $action "$project"
          builds=true
        fi
      done

      # Otherwise print error message, help and exit
      if [[ $builds == false ]]; then
        invalid
        usage
        exit 1
      else
        exit 0
      fi
    ;;
  esac
}

# run - executes main script
run() {
  local command="${1:-""}"
  local image="${2:-false}"

  case ${command} in
    build)  process_subcommand "build" $image ;;
    push)   process_subcommand "push"  $image ;;
    help|*) usage; exit 0                     ;;
  esac
}
run "$@"
