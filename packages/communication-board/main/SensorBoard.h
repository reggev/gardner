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
    double scaleSample(int sensorIdx, int sample);
    void readSensors();

  public:
    int id;
    SensorBoard();
    SensorBoard(int id, int address, struct SensorConfig sensors[4]);
    void onRead(void (*callback)(int id, double (&samples)[4]));
    void startReading();
    void update();
};

#endif // __SENSOR_BOARD__