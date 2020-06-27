#include "WiFiTools.h"
#include "api.h"
#include <Arduino.h>

int gotResult = 0;
void setup() {
    Serial.begin(115200);
    connectToWiFi();
}

void loop() {
    if (gotResult)
        return;
    String payload = fetchInfo();
    gotResult = 1;
    Serial.print(payload);
    return;
}
