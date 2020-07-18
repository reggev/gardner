#!/bin/bash

./setupNetwork.sh
./setupVolumes.sh
./startInflux.sh
./startGrafana.sh
./startCollector.sh -d
