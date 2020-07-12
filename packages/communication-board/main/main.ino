#include "API.h"
#include "Button.h"
#include "Sensors.h"
#include "WiFiConnection.h"
#include "config.h"
#include "env.h"
#include "pinout.h"
#include <Arduino.h>

WiFiConnectionClient connection;
API api;

Button sampleNowButton(SAMPLE_NOW_PIN);
Sensors sensorBoard(SLAVE_ADDRESS);
bool gotResult = false;

void handleClick() {
    Serial.println("opening a new read");
    sensorBoard.startRead();
}

void handleRead(int (&samples)[4]) {
    Serial.print("samples: ");
    for (int sample : samples) {
        Serial.printf("%d\t", sample);
    }
    Serial.print("\n");
}

void setup() {
    Serial.begin(115200);
    // connection.connect();
    delay(4000);
    sampleNowButton.onClick(handleClick);
    sensorBoard.onRead(handleRead);
    Wire.begin();
    Serial.println("up and running!");
}

void loop() {
    // connection.update();
    // if (connection.hasFailed)
    //     return;
    // if (!connection.isConnected)
    //     return;

    sampleNowButton.update();
    sensorBoard.update();
    // if (!gotResult) {
    //     long minutesUntilNextSample = api.fetchMinutesUntilNextSample();
    //     // @todo - handle fail case
    //     // the object returned should be either data or fail
    //     Serial.println("minutesUntilNextSample");
    //     Serial.println(minutesUntilNextSample);
    //     gotResult = true;
    // }
    return;
}
