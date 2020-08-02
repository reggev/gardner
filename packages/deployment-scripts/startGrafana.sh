#!/bin/bash

mkdir -p ~/gardner/grafana-data
docker run \
	-d \
	--rm \
	-p 5000:3000 \
	--name grafana \
	--net backend \
	--mount source=grafana-data,target=/var/lib/grafana \
	-v ~/gardner/packages/deployment-scripts/grafana.conf/custom.ini:/usr/share/grafana/conf/custom.ini \
	grafana/grafana:7.0.6
