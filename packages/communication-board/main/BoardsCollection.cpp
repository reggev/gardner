#include "BoardsCollection.h"

void BoardsCollection::setup(struct BoardConfig configurations[], int size) {
    char buffer[255];
    this->boards = new SensorBoard[size];
    Serial.println("[SETUP_BOARDS]::initalized boards array\n");
    int boardIdx = 0;
    for (boardIdx = 0; boardIdx < size; boardIdx++) {
        BoardConfig config = configurations[boardIdx];
        SensorBoard board =
            SensorBoard(config.id, config.address, config.sensors);
        boards[boardIdx] = board;
    }
    this->size = boardIdx;
    sprintf(buffer, "[SETUP_BOARDS]::created %d boards\n", boardIdx);
    Serial.print(buffer);
}

void BoardsCollection::sampleAll() {
    // TODO:: try again to sample directly avoiding the need for update
    for (int ii = 0; ii < this->size; ii++)
        boards[ii].startReading();
}

void BoardsCollection::onRead(void (*callback)(int id, double (&samples)[4])) {
    for (int ii = 0; ii < this->size; ii++)
        boards[ii].onRead(callback);
}

void BoardsCollection::update() {
    for (int ii = 0; ii < this->size; ii++)
        boards[ii].update();
}