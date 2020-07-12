# `@gardner/sensor-board`

> TODO: description

## JSON document
The size of json document for sending
can be estimated using this tool https://arduinojson.org/v6/assistant/

For the current version only the sensor value is needed
so an array of numbers should enough.
# API
```
{
  "sensors": [int,int,int,int]
}
```
* on an 8 bit system (AVR) a 32 byte document should be enough
* on a 16 bit system (esp8266) 64 bytes are needed