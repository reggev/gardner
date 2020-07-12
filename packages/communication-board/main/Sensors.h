#include <Arduino.h>
#include <ArduinoJson.h>
#include <Wire.h>

class Sensors {
  private:
    int slaveAddress;
    bool isReading = false;
    void (*cb)(int (&samples)[4]);

  public:
    Sensors(int address);
    void onRead(void (*callback)(int (&samples)[4])) { cb = callback; };
    void startRead() { isReading = true; }
    void update() {
        if (!isReading)
            return;
        isReading = false;
        Wire.requestFrom(slaveAddress, 64);
        StaticJsonDocument<64> doc;
        deserializeMsgPack(doc, Wire);
        JsonArray collection = doc.as<JsonArray>();

        int samples[4];
        int idx = 0;
        // this implicitly converts the sample to an int
        for (int sample : collection) {
            samples[idx] = sample;
            idx++;
        }
        cb(samples);
    }
};