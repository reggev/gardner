#include "SensorBoard.h"
#include <stdio.h>

SensorBoard::SensorBoard() { Serial.println("setup empty board"); }

SensorBoard::SensorBoard(int id, int address) {
    char buffer[255];
    sprintf(buffer, "[SETUP_BOARD]::id: %d, address %d", id, address);
    this->address = address;
    this->id = id;
}

BoardsCollection::BoardsCollection() {}
