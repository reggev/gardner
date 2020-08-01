# `@gardner/calibration-board`

This module's purpose is to calibrate the sensors.
The sensor's dry and wet values differ between sensors and manufacturers; the idea is to sample completely dry and entirely wet for scaling the samples.

## Usage

physically Mark the sensors(ex: by number) and connect them to the board.
While dry, wait for the readings to stabilize - this might take a lot of time.
when the reading is stable - this is the 100% dry value.
Put the sensor in a cup of water (notice the water level marking on the sensor) and wait again until the measure is stable - this is the 100% wet value.
Use those values to scale the readings to percentages.
