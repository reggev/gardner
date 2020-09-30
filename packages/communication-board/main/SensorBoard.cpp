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

/* scaleSample to match the wet/dry values from the sensor */
double SensorBoard::scaleSample(int sensorIdx, int sample) {
    char buffer[255];
    SensorConfig sensor = sensors[sensorIdx];
    return map(sample, sensor.dryValue, sensor.wetValue, 0, 100) / 100.0;
}

void SensorBoard::readSensors() {
    char buffer[255];
    sprintf(buffer, "[SAMPLE_START]::boardId %d\n", id);
    Serial.print(buffer);
    Wire.requestFrom(address, 64);
    StaticJsonDocument<64> doc;
    deserializeMsgPack(doc, Wire);
    JsonArray collection = doc.as<JsonArray>();

    double samples[4];
    int idx = 0;
    // this implicitly converts the sample to an int
    for (int sample : collection) {
        // scale the sample by it's dry and wet values
        samples[idx] = scaleSample(idx, sample);
        idx++;
    }
    sprintf(buffer, "[SAMPLE_END]::boardId %d\n", this->id);
    Serial.print(buffer);
    cb(id, samples);
}

void SensorBoard::onRead(void (*callback)(int id, double (&samples)[4])) {
    if (callback == nullptr) {
        Serial.println("[ERROR]::onRead got nullptr, board" + id);
    } else {
        cb = callback;
    }
}

/* initialize read on the next cycle */
void SensorBoard::startReading() {
    char buffer[255];
    sprintf(buffer, "[INFO]::initialize reading on board %d\n", id);
    Serial.print(buffer);
    shouldRead = true;
}

void SensorBoard::update() {
    if (!shouldRead)
        return;
    shouldRead = false;
    readSensors();
}
