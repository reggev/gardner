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

    String payload = api.fetchInfo();
    gotResult = true;
    Serial.print(payload);
    return;
}
