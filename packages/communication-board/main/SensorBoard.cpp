#include "SensorBoard.h"
#include <stdio.h>

SensorBoard::SensorBoard() {}

SensorBoard::SensorBoard(int id, int address, struct SensorConfig sensors[4]) {
    char buffer[255];
    sprintf(buffer, "[SETUP_BOARD]::id: %d, address %d", id, address);
    this->address = address;
    this->id = id;
    this->sensors = sensors;
}
