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

class API {
  private:
    WiFiClient client;
    bool isPending = false;
    String hostUri = HOST_URI;
    String handleRequest(HTTPClient& http, int httpCode, String method,
                         String failError);
    String post(String url, String body);
    String fetch(String uri);

  public:
    String fetchInfo();
    double fetchMinutesUntilNextSample();
    double postSamples(int boardId, double (&samples)[4]);
};

#endif // __API__