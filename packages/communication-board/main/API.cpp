#include "API.h"

String API::handleRequest(HTTPClient& http, int httpCode, String method,
                          String failError) {
    // httpCode will be negative on error
    if (httpCode > 0) {
        Serial.println("[HTTP]::" + method + "... code: " + (String)httpCode);

        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED) {
            String payload = http.getString();
            http.end();
            return payload;
        }
    } else {
        Serial.println("[HTTP]::" + method + "... failed, error: %s" +
                       (String)http.errorToString(httpCode).c_str());
    }
    http.end();
    return failError;
}

String API::post(String url, String body) {
    HTTPClient http;

    const String failError = "";

    if (http.begin(client, url)) {
        http.addHeader("Content-Type", "application/json");
        Serial.println("[HTTP]::POST " + url);
        digitalWrite(LED_BUILTIN, LOW);
        int httpCode = http.POST(body);
        digitalWrite(LED_BUILTIN, LOW);
        return handleRequest(http, httpCode, "POST", failError);
    } else {
        Serial.printf("[HTTP]::Unable to connect\n");
    }
    return failError;
}

String API::fetch(String uri) {
    HTTPClient http;

    const String fetchUri = uri;
    const String failError = "";
    if (http.begin(client, fetchUri)) {
        Serial.println("[HTTP]::GET " + fetchUri);
        digitalWrite(LED_BUILTIN, LOW);
        int httpCode = http.GET();
        digitalWrite(LED_BUILTIN, LOW);
        return handleRequest(http, httpCode, "GET", failError);
    } else {
        Serial.printf("[HTTP]::Unable to connect\n");
    }
    return failError;
}

String API::fetchInfo() {
    String payload = fetch(hostUri + "/");
    return payload;
}

double API::fetchMinutesUntilNextSample() {
    String payload = fetch(hostUri + "/next-sample");
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    double minutes = doc["minutes"].as<double>();
    return minutes;
}

double API::postSamples(int boardId, double (&samples)[4]) {
    StaticJsonDocument<400>
        doc; // estimated using https://arduinojson.org/v6/assistant/
    JsonArray samplesCollection = doc.createNestedArray("boards");
    JsonObject board = samplesCollection.createNestedObject();
    board["id"] = boardId;
    JsonArray readings = board.createNestedArray("readings");
    for (double sample : samples) {
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