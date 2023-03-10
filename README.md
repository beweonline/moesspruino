# moesspruino
<<<<<<< HEAD
customized Espruino IDE originally for Moessinger junior high school design and technology education  
changes to the original IDE are documented in `customizations.txt`

background
----------
main interrest is constructing a model of a portal/gantry robot with pick-and-place functionality from scratch  
K8/9 pupils want to program animations for several servo motors with minimal supervision  
project total cost per individual robot including NodeMCU esp8266 is limited to 10-15€

descent
-------
[espruino](https://github.com/espruino) provides easy access too microcontrollers  
wifi equipped chips can act as servers and host websites / services  
programming of hardware, server and websites done in a single language: [JavaScript](https://en.wikipedia.org/wiki/JavaScript)  
an interactive development evnironment [IDE](https://www.espruino.com/ide/) is provided as a webpage  
from there compatible chips can be addressed immediately through an interactive REPL console  
espruino facilitates [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)) communication and thus remote controll and telemetry via smartphones  
established project is a very well [documented](https://www.espruino.com/)  with a supportive [forum](https://forum.espruino.com/) and concise [API](https://www.espruino.com/Reference#software) reference

status
------
- [x] moesspruino binaries run on personal win10 win7 installations
- [ ] web-serial may not be working properly in school networks

online access
-------------
- moesspruino is hosted here on [github.io](https://beweonline.github.io/moesspruino/webIDE/index.html)
- connect with your microcontroller via the connection button
- follow the coding quick start from [espruino.com](http://www.espruino.com/Quick+Start+Code)  
```javascript
// for NodeMCU boards
var on = true;
function blink() {
 on = !on;
 digitalWrite(NodeMCU.D0, on);
}
var i = setInterval(blink, 500);
```

binary workflow
---------------
0. for portability reasons and offline use `moesspruino.exe` is a nexe-build of a node project
1. it starts a node.js server and provides a customized espruino-ide-webpage on localhost:8080/index.html
2. the system's default browser is called and pointed to that URL  
   note that your webbrowser must support the web-serial interface (e.g. chrome or MS edge)

node.js workflow
----------------
run `moesspruino.bat` from the moesspruino folder  
make sure to have a working [node.js](https://nodejs.org/en/) runtime environment

compiling executables
---------------------
to compile for windows use the `build_nexe.bat`  
set appropriate parameters for your target OS in the batch file  
make sure you have the [nexe](https://github.com/nexe/nexe) module installed

firmware for ESP8266
--------------------
the `flash` directory contains a `regFLASH.bat` to flash any ESP8266 board automatically  
with the included espruino firmware by checking the windows registry for Silab devices on COM ports
=======
customized Espruino IDE for Moessinger high school design and technology education
>>>>>>> parent of e55a15e (Update README.md)
