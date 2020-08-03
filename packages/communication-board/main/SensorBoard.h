#ifndef __SENSOR_BOARD__
#define __SENSOR_BOARD__
#include <Arduino.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <stdio.h>

/** SensorConfig defines how to structure a sensor in the config file */
typedef struct SensorConfig {
    int sensorId;
    int dryValue;
    int wetValue;
};

/** BoardConfig defines how to structure a board in the config file */
typedef struct BoardConfig {
    int id;
    int address;
    struct SensorConfig sensors[4];
};

/**
 * The SensorBoard module manages the communication with a boards
 * using i2c communication protocol
 * The data from the boards is serialized to messagePack
 * The module enables passing a callback to the onRead event handler
 * */
class SensorBoard {
  private:
    int address;
    void (*cb)(int boardId, double (&samples)[4]);
    bool shouldRead = false;
    struct SensorConfig sensors[4];

    /* scaleSample to match the wet/dry values from the sensor */
    double scaleSample(int sensorIdx, int sample) {
        char buffer[255];
        SensorConfig sensor = sensors[sensorIdx];
        return map(sample, sensor.dryValue, sensor.wetValue, 0, 100) / 100.0;
    }

    void readSensors() {
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

  public:
    int id;

    SensorBoard();
    SensorBoard(int id, int address, struct SensorConfig sensors[4]);

    void onRead(void (*callback)(int id, double (&samples)[4])) {
        if (callback == nullptr) {
            Serial.println("[ERROR]::onRead got nullptr, board" + id);
        } else {
            cb = callback;
        }
    }

    /* initialize read on the next cycle */
    void startReading() {
        char buffer[255];
        sprintf(buffer, "[INFO]::initialize reading on board %d\n", id);
        Serial.print(buffer);
        shouldRead = true;
    }

    void update() {
        if (!shouldRead)
            return;
        shouldRead = false;
        readSensors();
    }
};

/**
 * The BoardsCollection module manages the collection of the boards.
 * The module handles structuring a collection from the configuration
 * and enables iterating through the boards
 * */
struct BoardsCollection {
    int size;
    struct SensorBoard* boards;
    void setup(struct BoardConfig configurations[], int size) {
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

    void sampleAll() {
        // TODO:: try again to sample directly avoiding the need for update
        for (int ii = 0; ii < this->size; ii++)
            boards[ii].startReading();
    }

    void onRead(void (*callback)(int id, double (&samples)[4])) {
        for (int ii = 0; ii < this->size; ii++)
            boards[ii].onRead(callback);
    }

    void update() {
        for (int ii = 0; ii < this->size; ii++)
            boards[ii].update();
    }
};

#endif // __SENSOR_BOARD__