#include <arduino.h>
#include <stdio.h>

#define SENSOR_PIN_0 A0
#define SENSOR_PIN_1 A1
#define SENSOR_PIN_2 A2
#define SENSOR_PIN_3 A3
char buffer[255];

void setup() {
    Serial.begin(9600);
    pinMode(SENSOR_PIN_0, INPUT);
    pinMode(SENSOR_PIN_1, INPUT);
    pinMode(SENSOR_PIN_2, INPUT);
    pinMode(SENSOR_PIN_3, INPUT);
}

void loop() {
    sprintf(buffer,
            "pin A0 reading: %d \t|\t pin A1 reading: %d \t|\t pin A2 reading: "
            "%d \t|\t pin A3 reading: %d\n",
            analogRead(SENSOR_PIN_0), analogRead(SENSOR_PIN_1),
            analogRead(SENSOR_PIN_2), analogRead(SENSOR_PIN_3));
    Serial.print(buffer);
    delay(1000);
}