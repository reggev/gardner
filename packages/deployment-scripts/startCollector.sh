#!/bin/bash

PACKAGE_VERSION=$(cat package.json |
	grep version |
	head -1 |
	awk -F: '{ print $2 }' |
	sed 's/[",]//g' |
	tr -d '[[:space:]]')

function build() {
	docker build -f ./../collector/Dockerfile --rm -t "collector:${PACKAGE_VERSION##*( )}" ./../../
}

function deploy() {
	docker run \
		-d \
		--rm \
		--name collector \
		--env-file ./.server.env \
		-p 5001:4000 \
		--net backend \
		"collector:${PACKAGE_VERSION##*( )}"
}

while getopts ":db" opt; do
	case ${opt} in
	d)
		deploy
		;;
	b)
		build
		;;
	\?)
		echo "usage: [-b] build, [-d] deploy"
		;;
	esac
done
