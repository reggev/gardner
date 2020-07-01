#include "config.h"
#include <Wire.h>
#include <arduino.h>

int sensors[4] = {SENSOR_PIN_A, SENSOR_PIN_B, SENSOR_PIN_C, SENSOR_PIN_D};

void sample() {
    int samples[4];
    for (int ii = 0; ii < 4; ii++) {
        Serial.print(ii);
        Serial.print("\t");
        Serial.print("");
        samples[ii] = analogRead(sensors[ii]);
    }
    Serial.print("\n");

    for (int sample : samples) {
        Serial.print(sample);
        Serial.print("\t");
        Wire.write((byte)sample);
    }
    Serial.print("\n");
}

void setup() {
    Wire.begin(SLAVE_ADDRESS);
    Serial.begin(9600);
    for (int sensorPin : sensors)
        pinMode(sensorPin, INPUT);
    Wire.onRequest(sample);
}

void loop() {
    delay(1000);
    sample();
}
