#include "SensorBoard.h"
#include <stdio.h>

SensorBoard::SensorBoard() {}

SensorBoard::SensorBoard(int id, int address,
                         struct SensorConfig sensorConfigs[4]) {
    char buffer[255];
    this->address = address;
    this->id = id;
    for (int ii = 0; ii < 4; ii++)
        this->sensors[ii] = sensorConfigs[ii];

    sprintf(buffer, "[SETUP_BOARD]::id: %d, address %d\n", id, address);
    Serial.print(buffer);
}
