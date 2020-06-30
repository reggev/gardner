#include "API.h"
#include "Button.h"
#include "WiFiConnection.h"
#include "env.h"
#include "pinout.h"
#include <Arduino.h>
WiFiConnectionClient connection;
API api;

Button submitNowButton(5);

bool gotResult = false;

void handleClick() { Serial.println("clicked"); }

void setup() {
    Serial.begin(115200);
    connection.connect();
    delay(4000);
    submitNowButton.subscribe(handleClick);
}

void loop() {
    connection.update();
    if (connection.hasFailed)
        return;
    if (!connection.isConnected)
        return;

    submitNowButton.update();

    if (!gotResult) {
        long minutesUntilNextSample = api.fetchMinutesUntilNextSample();
        Serial.print(minutesUntilNextSample);
        gotResult = true;
    }
    return;
}
