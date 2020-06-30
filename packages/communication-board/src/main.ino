
#include "API.h"
#include "WiFiConnection.h"
#include <Arduino.h>

bool gotResult = false;
WiFiConnectionClient connection;
API api;

void setup() {
    Serial.begin(115200);
    connection.connect();
    delay(4000);
}

void loop() {
    connection.update();
    if (connection.hasFailed)
        return;
    if (!connection.isConnected)
        return;
    if (gotResult)
        return;

    long minutesUntilNextSample = api.fetchMinutesUntilNextSample();
    Serial.print(minutesUntilNextSample);

    gotResult = true;
    return;
}
