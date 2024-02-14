#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Replace with your network credentials


const char* ssid     = "Hotspot2";
const char* password = "pass";
// Set web server port number to 80
WiFiServer server(80);

WiFiClient client;
// Decode HTTP GET value

int pos1 = 0;
int pos2 = 0;
int pos3 = 0;
const int dimmDelay = 5;

// Variable to store the HTTP req  uest


// Red, green, and blue pins for PWM control
const int redPin = 13;     // 13 corresponds to GPIO13
const int greenPin = 12;   // 12 corresponds to GPIO12
const int bluePin = 14;    // 14 corresponds to GPIO14

//Red, green and blue values

int redValue;
int greenValue; 
int blueValue; 
// Setting PWM bit resolution
const int resolution = 256;

// Current time
unsigned long currentTime = millis();
// Previous time
unsigned long previousTime = 0; 
// Define timeout time in milliseconds (example: 1000ms = 1s)
const long timeoutTime = 1000;

void setup() {
  Serial.begin(115200);
  
  // configure LED PWM resolution/range and set pins to LOW
  analogWriteRange(resolution); 
  analogWrite(redPin, 0);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);
  
  // Connect to Wi-Fi network with SSID and password
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  //fadeLED(redPin, greenPin, bluePin);

  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();
  fadeLED(redPin, greenPin, bluePin);
}

void loop() {
  WiFiClient client = server.available();
  if (currentTime - previousTime >= timeoutTime) 
    // Salvăm timpul curent pentru următorul interval
    previousTime = currentTime;

  if (client) {
    Serial.println("New Client.");

    while (client.connected()) {
      if (client.available()) {
        String request = client.readStringUntil('\r');
        Serial.println(request);

        if (request.indexOf("POST /setcolor") != -1) {
          // Doar dacă cererea este de tip POST și este pentru ruta /setcolor
          // poți procesa și extrage datele.
          processSetColorRequest(request);
        }else if (request.indexOf("POST /setbrightness") != -1) {
          // Doar dacă cererea este de tip POST și este pentru ruta /setbrightness
          // poți procesa și extrage datele.
          processSetBrightnessRequest(request);
        }
        else if (request.indexOf("POST /setOnOff") != -1){
          processSetOnOffRequest(request);
        }
        

        // Trimite un răspuns simplu către client
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: text/html");
        client.println("Connection: close");
        client.println();

        // Ieșirea din bucla while pentru a nu procesa cereri ulterioare de la același client
        break;
      }
    }
    
    // Eliberează resursele clientului
    //client.stop();
    //Serial.println("Client disconnected.");
  }
}
void processSetOnOffRequest(String request)
{
  int pos = request.indexOf("toggle=");
  if(pos != -1)
  {
    int onOff = request.substring(pos+7).toInt();
    Serial.print("Set: ");
    if(onOff == 1)
      {
        onLED(redPin, greenPin, bluePin);
        
        Serial.print("ON");        
      }
    else
      {
        offLED(redPin, greenPin, bluePin);
        Serial.print("OFF");        
        
      }
  }
}

void processSetBrightnessRequest(String request)
{
  int pos = request.indexOf("brightness=");
  if(pos != -1)
  {
    float brightness = request.substring(pos+11).toFloat();

    Serial.print("Received brightness: Brightness ");
    Serial.println(brightness);

    analogWrite(redPin, redValue * brightness);
    analogWrite(greenPin, greenValue * brightness);
    analogWrite(bluePin, blueValue * brightness);
  }
}

void processSetColorRequest(String request) {
  // Exemplu de procesare a cererii POST pentru /setcolor
  int pos1 = request.indexOf("r=");
  int pos2 = request.indexOf("&g=");
  int pos3 = request.indexOf("&b=");
  
  if (pos1 != -1 && pos2 != -1 && pos3 != -1) {
    // Extrage valorile r, g și b din cererea POST și convertește-le la întregi
    int red = request.substring(pos1 + 2, pos2).toInt();
    redValue = red;
    int green = request.substring(pos2 + 3, pos3).toInt();
    greenValue = green;
    int blue = request.substring(pos3 + 3).toInt();
    blueValue = blue;
   
    
    // Setează culorile pentru banda LED folosind analogWrite
    analogWrite(redPin, red);
    analogWrite(greenPin, green);
    analogWrite(bluePin, blue);

    // Poți utiliza valorile red, green și blue în setarea culorilor pentru banda LED
    Serial.print("Received colors: Red=");
    Serial.print(red);
    Serial.print(", Green=");
    Serial.print(green);
    Serial.print(", Blue=");
    Serial.println(blue); 
  }
}

void offLED(int pinR, int pinG, int pinB) {
 
 int newRed = redValue;
 int newGreen = greenValue;
 int newBlue = blueValue;
 Serial.print("RED BREFORE FOR: ");
 Serial.println(redValue);
 bool turnOff = true;
  while(turnOff)
  {
    Serial.print("FOR RED OFF: ");
    Serial.println(newRed);
    Serial.println(newGreen);
    Serial.println(newBlue);
    newRed--;
    newGreen--;
    newBlue--;
    if(newRed <= 0)
      newRed = 0;
    if (newGreen <= 0)
      newGreen = 0;
    if (newBlue <= 0)
      newBlue = 0;   
    
    analogWrite(pinR, newRed);
    analogWrite(pinG, newGreen);
    analogWrite(pinB, newBlue);
    delay(dimmDelay);
    if(newRed <= 0 && newGreen <= 0 && newBlue <= 0)
      turnOff = false;
  }
}

void onLED(int pinR, int pinG, int pinB) {
  
  int newRed = 0;
 int newGreen = 0;
 int newBlue = 0;
  Serial.print("RED BREFORE FOR: ");
  Serial.println(redValue);
  Serial.print("GREEN BREFORE FOR: ");
  Serial.println(greenValue);
  Serial.print("BLUE BREFORE FOR: ");
  Serial.println(blueValue);
  bool turnOn = true;    
  while(turnOn)
  { 
    Serial.print("RED FOR ON: ");
    Serial.println(newRed);
    Serial.println(newGreen);
    Serial.println(newBlue);
    analogWrite(pinR, newRed);
    analogWrite(pinG, newGreen);
    analogWrite(pinB, newBlue);
    delay(dimmDelay);
    newRed++;
    newGreen++;
    newBlue++;
    if(newRed >= redValue)
      newRed = redValue;
    if (newGreen >= greenValue)
      newGreen = greenValue;
    if (newBlue >= blueValue)
      newBlue = blueValue; 
    if(newRed >= redValue && newGreen >= greenValue && newBlue >= blueValue)
      turnOn = false;
  }
}

void fadeLED(int pinR, int pinG, int pinB) {
  for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(pinR, brightness);
    analogWrite(pinG, brightness);
    analogWrite(pinB, brightness);
    delay(dimmDelay);
  }
}