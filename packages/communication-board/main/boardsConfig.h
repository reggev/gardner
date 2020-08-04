#ifndef __BOARDS_CONFIGURATIONS__
#define __BOARDS_CONFIGURATIONS__
#include "SensorBoard.h"
#define CONFIGURED_BOARDS 1

struct BoardConfig boardsConfiguration[] = {{
    id : 0,
    address : 9,
    sensors : {// A0
               // boardId, dryValue, wetValue
               {1, 658, 377},
               // A1
               {2, 661, 366},
               // A2
               {3, 657, 360},
               // A3
               {4, 661, 365}}
}};

#endif // __BOARDS_CONFIGURATIONS__