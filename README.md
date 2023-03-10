# moesspruino
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

binary workflow
---------------
0. for portability reasons and offline use `moesspruino.exe` is a nexe-build of a node project
1. it starts a node.js server and provides a customized espruino-ide-webpage on localhost:8080/index.html
2. the system's default browser is targeted to that URL  
   note that your webbrowser must support the web-serial interface (e.g. chrome or MS edge)
3. connect with your NodeMCU microcontroller via the left upper corner button
4. follow instruction and tutorials from espruino.com

node.js workflow
----------------
run `moesspruino.bat` from the moesspruino folder  
make sure to have a working [node.js](https://nodejs.org/en/) runtime environment

compiling executables
---------------------
to compile for windows use the `build_nexe.bat` and set appropriate parameters for your OS in the batch file  
make sure you have the [nexe](https://github.com/nexe/nexe) module installed
