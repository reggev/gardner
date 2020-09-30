#include "config.h"
#include "env.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>
#include <neotimer.h>

#ifndef __WiFi_TOOLS__
#define __WiFi_TOOLS__

ESP8266WiFiMulti WiFiMulti;
Neotimer timer = Neotimer(1000);

class WiFiConnectionClient {
  private:
    bool _isConnected = false;
    bool isLedOn = false;
    bool _hasFailed = false;
    int retries = 0;
    const char* ssid = WIFI_SSID;
    const char* password = WIFI_PASSWORD;
    int maxConnectionRetries = MAX_CONNECTION_RETRIES;

  public:
    bool& isConnected = _isConnected;
    bool& hasFailed = _hasFailed;
    void connect() {
        if (_isConnected)
            return;
        WiFi.mode(WIFI_STA);
        WiFiMulti.addAP(ssid, password);
    }
    bool update() {
        if (_hasFailed) {
            // failedLed.Update();
            return false;
        }
        if (_isConnected)
            return true;
        // pendingLed.Update();
        if (timer.started() && !timer.done()) {
            return false;
        }
        if ((WiFiMulti.run() != WL_CONNECTED)) {
            Serial.printf("[SETUP]::%d/%d, connection retries\n", retries,
                          maxConnectionRetries);
            retries++;
            if (retries > maxConnectionRetries) {
                _hasFailed = true;
                return false;
            }
            timer.reset();
            timer.start();
        } else {
            _isConnected = true;
            retries = 0;
            Serial.printf("[SETUP]::connected to %s\n", ssid);
            // pendingLed.Stop();
            return _isConnected;
        }
    }
};

#endif // __WiFi_TOOLS__