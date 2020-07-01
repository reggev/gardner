#ifndef __BUTTON__
#define __BUTTON__

#include <Arduino.h>

class Button {
  private:
    bool lastState = false;
    bool currentState = false;
    bool isClicked = false;
    bool shouldInvert;
    int pinId;
    void (*cbPtr)();

  public:
    Button(int buttonPin, bool isInverted = false);
    bool read() { return shouldInvert ? !isClicked : isClicked; };
    void onClick(void (*callback)()) { cbPtr = callback; }
    void update() {
        // catch only the button down event
        isClicked = !lastState && digitalRead(pinId);
        lastState = digitalRead(pinId);
        if (isClicked && cbPtr) {
            cbPtr();
        }
    }
};

#endif