#include "config.h"
#include <ArduinoJson.h>
#include <Wire.h>
#include <arduino.h>

int sensors[4] = {SENSOR_PIN_A, SENSOR_PIN_B, SENSOR_PIN_C, SENSOR_PIN_D};

void sample() {
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println("[SAMPLE]");

    StaticJsonDocument<32> doc;
    for (int sensor : sensors)
        doc.add(analogRead(sensor));

    serializeJson(doc, Serial);
    int bytes = serializeMsgPack(doc, Wire);
    Serial.print("\n");
    Serial.print("bytes sent: ");
    Serial.println(bytes);
    digitalWrite(LED_BUILTIN, LOW);
}

void setup() {
    Wire.begin(SLAVE_ADDRESS);
    Serial.begin(115200);
    for (int sensorPin : sensors)
        pinMode(sensorPin, INPUT);
    Wire.onRequest(sample);
}

void loop() {}
