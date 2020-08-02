#include "API.h"
#include "Button.h"
#include "WiFiConnection.h"
#include "boardsConfig.h"
#include "config.h"
#include "env.h"
#include "pinout.h"
#include <Arduino.h>
#include <neotimer.h>

WiFiConnectionClient connection;
API api;

Neotimer sampleTimer = Neotimer(0);

Button sampleNowButton(SAMPLE_NOW_PIN);

BoardsCollection sensorBoards = BoardsCollection();

bool hasSampleDuration = false;
bool isFirstRun = true;

void restartTimer(double minutesUntilNextSample) {
    sampleTimer.stop();
    sampleTimer.set(minutesUntilNextSample * 60 * 1000);
    sampleTimer.start();
}

void handleRead(int boardId, int (&samples)[4]) {
    Serial.print("[READING]::samples: ");
    for (int sample : samples) {
        Serial.printf("%d\t", sample);
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
    connection.connect();
    delay(4000);
    sampleNowButton.onClick([]() { sensorBoards.sampleAll(); });
    for (int ii = 0; ii < CONFIGURED_BOARDS; ii++) {
        sensorBoards.boards[ii].onRead(handleRead);
    }
    Wire.begin();
    sampleTimer.start();
}

void loop() {
    connection.update();
    if (connection.hasFailed)
        return;
    if (!connection.isConnected)
        return;

    sampleNowButton.update();

    for (int ii = 0; ii < CONFIGURED_BOARDS; ii++) {
        sensorBoards.boards[ii].update();
    }

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
