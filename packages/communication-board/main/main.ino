#include "API.h"
#include "Button.h"
#include "Sensors.h"
#include "WiFiConnection.h"
#include "config.h"
#include "env.h"
#include "pinout.h"
#include <Arduino.h>
#include <neotimer.h>

WiFiConnectionClient connection;
API api;

Neotimer sampleTimer = Neotimer(0); // 1 second timer

Button sampleNowButton(SAMPLE_NOW_PIN);
Sensors sensorBoard(SLAVE_ADDRESS);
bool hasSampleDuration = false;
bool isFirstRun = true;

void restartTimer(double minutesUntilNextSample) {
    sampleTimer.stop();
    sampleTimer.set(minutesUntilNextSample * 60 * 1000);
    sampleTimer.start();
}

void sampleSensors() {
    Serial.println("opening a new read");
    sensorBoard.startRead();
}

void handleRead(int (&samples)[4]) {
    Serial.print("samples: ");
    for (int sample : samples) {
        Serial.printf("%d\t", sample);
    }
    Serial.print("\n");
    double minutesUntilNextSample = api.postSamples(0, samples);

    restartTimer(minutesUntilNextSample);
}

void setup() {
    Serial.begin(115200);
    connection.connect();
    delay(4000);
    sampleNowButton.onClick(sampleSensors);
    sensorBoard.onRead(handleRead);
    Wire.begin();
    Serial.println("up and running!");
    sampleTimer.start();
}

void loop() {
    connection.update();
    if (connection.hasFailed)
        return;
    if (!connection.isConnected)
        return;

    sampleNowButton.update();
    sensorBoard.update();
    if (sampleTimer.done()) {
        if (isFirstRun) {
            double minutesUntilNextSample = api.fetchMinutesUntilNextSample();
            if (minutesUntilNextSample) {
                isFirstRun = false;
                Serial.printf("minutes until next sample %f\n",
                              minutesUntilNextSample);
                restartTimer(minutesUntilNextSample);
            } else {
                // if the request has failed let it retry after 1 second
                restartTimer(1000);
            }
        } else {
            sampleSensors();
        }
    }
    return;
}
