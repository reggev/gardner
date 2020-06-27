#include "env.h"
#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>

WiFiClient client;

HTTPClient http;

String fetch(String uri) {
    const char* hostUri = HOST_URI;
    const String fetchUri = hostUri + uri;
    const String failError = "";
    if (http.begin(client, fetchUri)) {
        Serial.println("[HTTP] GET:: " + fetchUri);
        int httpCode = http.GET();
        // httpCode will be negative on error
        if (httpCode > 0) {
            Serial.printf("[HTTP] GET... code: %d\n", httpCode);
            if (httpCode == HTTP_CODE_OK ||
                httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
                return http.getString();
            }
        } else {
            Serial.printf("[HTTP] GET... failed, error: %s\n",
                          http.errorToString(httpCode).c_str());
        }
        http.end();
    } else {
        Serial.printf("[HTTP} Unable to connect\n");
    }
    return failError;
}

String fetchInfo() {
    String payload = fetch("/");
    return payload;
}