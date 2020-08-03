#ifndef __BOARDS_CONFIGURATIONS__
#define __BOARDS_CONFIGURATIONS__
#include "SensorBoard.h"
#define CONFIGURED_BOARDS 1

struct BoardConfig boardsConfiguration[] = {{
    id : 0,
    address : 9,
    sensors : {// A0
               // boardId, dryValue, wetValue
               {1, 804, 368},
               // A1
               {2, 648, 358},
               // A2
               {3, 633, 355},
               // A3
               {4, 703, 354}}
}};

#endif // __BOARDS_CONFIGURATIONS__