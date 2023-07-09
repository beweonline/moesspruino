espruino -v -m -b 115200 --board ESP8266_4MB.json -e "require('Storage').erase('.varimg')" oninit.js -e "save()"
PAUSE