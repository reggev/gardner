#!/bin/bash
docker run \
	-d \
  	--name db \
  	--rm \
  	--net backend \
  	--mount source=db-data,target=/var/lib/influxdb \
  	--env-file ./.influx.env \
  	influxdb:1.8
