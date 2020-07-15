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
    String post(String url, String body) {
        if (http.begin(client, url)) {
            Serial.println("[HTTP] POST:: " + url);
            Serial.println(body);
            digitalWrite(LED_BUILTIN, LOW);
            int httpCode = http.POST(body);
            digitalWrite(LED_BUILTIN, LOW);
            // httpCode will be negative on error
            if (httpCode > 0) {
                Serial.printf("[HTTP] POST... code: %d\n", httpCode);
                if (httpCode == HTTP_CODE_OK ||
                    httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
                    return http.getString();
                }
            } else {
                Serial.printf("[HTTP] POST... failed, error: %s\n",
                              http.errorToString(httpCode).c_str());
            }
            http.end();
        } else {
            Serial.printf("[HTTP} Unable to connect\n");
        }
        return "";
    }
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
    double postSamples(int boardId, int (&samples)[4]) {
        StaticJsonDocument<400>
            doc; // estimated using https://arduinojson.org/v6/assistant/
        JsonArray samplesCollection = doc.createNestedArray("boards");
        JsonObject board = samplesCollection.createNestedObject();
        board["id"] = boardId;
        JsonArray readings = board.createNestedArray("readings");
        for (int sample : samples) {
            readings.add(sample);
        }
        String body;
        serializeJson(doc, body);
        String payload = post(hostUri + "/samples", body);
        DynamicJsonDocument response(1024);
        deserializeJson(response, payload);
        double minutes = response["minutes"].as<double>();
        return minutes;
    }
};

#endif // __API__