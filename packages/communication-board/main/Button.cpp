#include "Button.h"

Button::Button(int buttonPin, bool isInverted) {
    pinId = buttonPin;
    shouldInvert = isInverted;
}