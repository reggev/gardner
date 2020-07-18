#!/bin/bash

mkdir -p ~/gardner/grafana-data
docker run -d \
  --rm \
  -p 5000:3000 \
  --name grafana \
  --net backend \
  -v ~/gardner/grafana-data:/var/lib/grafana \
  grafana/grafana:7.0.6
