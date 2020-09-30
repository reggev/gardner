#ifndef __BOARDS_COLLECTION__
#define __BOARDS_COLLECTION__
#include "SensorBoard.h"

/** BoardConfig defines how to structure a board in the config file */
typedef struct BoardConfig {
    int id;
    int address;
    struct SensorConfig sensors[4];
};

/**
 * The BoardsCollection module manages the collection of the boards.
 * The module handles structuring a collection from the configuration
 * and enables iterating through the boards
 * */
struct BoardsCollection {
    int size;
    struct SensorBoard* boards;
    void setup(struct BoardConfig configurations[], int size);
    void sampleAll();
    void onRead(void (*callback)(int id, double (&samples)[4]));
    void update();
};

#endif // __BOARDS_COLLECTION__
