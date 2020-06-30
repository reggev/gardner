#include "API.h"
#include "Button.h"
#include "WiFiConnection.h"
#include "env.h"
#include "pinout.h"
#include <Arduino.h>
WiFiConnectionClient connection;
API api;

Button sampleNowButton(SAMPLE_NOW_PIN);

bool gotResult = false;

void handleClick() { Serial.println("clicked"); }

void setup() {
    Serial.begin(115200);
    connection.connect();
    delay(4000);
    sampleNowButton.subscribe(handleClick);
}

void loop() {
    connection.update();
    if (connection.hasFailed)
        return;
    if (!connection.isConnected)
        return;

    sampleNowButton.update();

    if (!gotResult) {
        long minutesUntilNextSample = api.fetchMinutesUntilNextSample();
        Serial.print(minutesUntilNextSample);
        gotResult = true;
    }
    return;
}
