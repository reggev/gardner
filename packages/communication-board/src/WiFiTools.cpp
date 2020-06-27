#include "env.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>
#include <neotimer.h>

ESP8266WiFiMulti WiFiMulti;

void wait(long duration) {
    Neotimer sleepTimer = Neotimer(duration); // 10 second timer
    sleepTimer.start();
    /*
     builtin led on the wemos is on when LOW and off when HIGH
     final state is HIGH - the led is off
    */
    while (sleepTimer.waiting()) {
        digitalWrite(LED_BUILTIN, LOW);
        delay(100);
        digitalWrite(LED_BUILTIN, HIGH);
        delay(100);
    }
}

int connectToWiFi() {
    const char* ssid = WIFI_SSID;
    const char* password = WIFI_PASSWORD;
    uint8_t maxConnectionRetries = MAX_CONNECTION_RETRIES;

    Serial.println('[SETUP] connecting to WiFi network');
    int ledState = LOW;
    unsigned long previousMillis = 0;
    const long interval = 1000;
    for (uint8_t t = 4; t > 0; t--) {
        Serial.printf("[SETUP] WAIT %d...\n", t);
        Serial.flush();
        delay(1000);
    }

    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP(ssid, password);

    uint8_t retries = 0;
    while ((WiFiMulti.run() != WL_CONNECTED)) {
        Serial.printf("[SETUP] %d/%d, connection retries\n", retries,
                      maxConnectionRetries);
        retries++;
        if (retries > maxConnectionRetries)
            return 0;
        wait(10000);
    }
    Serial.printf("[SETUP] connected to %s\n", ssid);
    return 1;
}