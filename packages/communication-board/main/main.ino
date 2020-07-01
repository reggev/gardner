#include "API.h"
#include "Button.h"
#include "WiFiConnection.h"
#include "config.h"
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
    sampleNowButton.onClick(handleClick);
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
        // @todo - handle fail case
        // the object returned should be either data or fail
        Serial.print(minutesUntilNextSample);
        gotResult = true;
    }
    return;
}
