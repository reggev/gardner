#include "API.h"
#include "Button.h"
#include "WiFiConnection.h"
#include "boardsConfig.h"
#include "config.h"
#include "env.h"
#include "pinout.h"
#include <Arduino.h>
#include <neotimer.h>

// TODO:: add a global logger
WiFiConnectionClient connection;
API api;
BoardsCollection sensorBoards;

Neotimer sampleTimer = Neotimer(0);

// TODO:: replace with 3rd party library with debouncing
Button sampleNowButton(SAMPLE_NOW_PIN);

bool isFirstRun = true;

void restartTimer(double minutesUntilNextSample) {
    sampleTimer.stop();
    sampleTimer.set(minutesUntilNextSample * 60 * 1000);
    sampleTimer.start();
}

void handleRead(int boardId, double (&samples)[4]) {
    Serial.print("[READING]::samples: ");
    for (double sample : samples) {
        Serial.printf("%f\t", sample * 100);
    }
    Serial.print("\n");
    double minutesUntilNextSample = api.postSamples(boardId, samples);
    Serial.println("[INFO]::minutesUntilNextSample: " +
                   (String)minutesUntilNextSample);
    restartTimer(minutesUntilNextSample);
}

void setup() {
    Serial.begin(115200);
    sensorBoards.setup(boardsConfiguration, CONFIGURED_BOARDS);
    sensorBoards.onRead(handleRead);
    sampleNowButton.onClick([]() { sensorBoards.sampleAll(); });
    connection.connect();
    delay(4000);
    Wire.begin();
    sampleTimer.start();
}

void loop() {
    connection.update();
    if (connection.hasFailed || !connection.isConnected)
        return;

    sampleNowButton.update();
    sensorBoards.update();

    if (sampleTimer.done()) {
        if (isFirstRun) {
            double minutesUntilNextSample = api.fetchMinutesUntilNextSample();
            if (minutesUntilNextSample) {
                isFirstRun = false;
                Serial.printf("[INFO]::minutes until next sample %f\n",
                              minutesUntilNextSample);
                restartTimer(minutesUntilNextSample);
            } else {
                // if the request has failed let it retry after 1 second
                restartTimer(1000);
            }
        } else {
            sensorBoards.sampleAll();
        }
    }
    return;
}
