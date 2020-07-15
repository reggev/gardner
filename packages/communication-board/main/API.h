#ifndef __API__
#define __API__

#include "config.h"
#include "env.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>

WiFiClient client;
HTTPClient http;

class API {
  private:
    bool isPending = false;
    String hostUri = HOST_URI;
    String fetch(String uri) {
        const String fetchUri = uri;
        const String failError = "";
        if (http.begin(client, fetchUri)) {
            Serial.println("[HTTP] GET:: " + fetchUri);
            digitalWrite(LED_BUILTIN, LOW);
            int httpCode = http.GET();
            digitalWrite(LED_BUILTIN, LOW);
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

  public:
    String fetchInfo() {
        String payload = fetch(hostUri + "/");
        return payload;
    }
    double fetchMinutesUntilNextSample() {
        String payload = fetch(hostUri + "/next-sample");
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, payload);
        double minutes = doc["minutes"].as<double>();
        return minutes;
    }
};

#endif // __API__