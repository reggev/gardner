#define SENSOR_PIN A0

void setup()
{
  Serial.begin(9600);
  pinMode(SENSOR_PIN, INPUT);
}

void loop()
{
  int value = analogRead(SENSOR_PIN);
  Serial.println(value);
  delay(100);
}