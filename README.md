# [moesspruino](https://beweonline.github.io/)
a robotics project originally for Moessinger junior high school design and technology education  
includes a customized Espruino IDE, an object-orientated sg90 servo library, schematics for the robot arm, an ajax interface for its mobile cnc  
changes to the original IDE are documented in `customizations.txt`  
tutorials and walkthrough to be handed in after test run, late 2023

background
----------
main interrest is constructing a model of a portal/gantry robot with pick-and-place functionality from scratch  
K8/9 pupils want to program animations for several servo motors with minimal supervision  
gentle exposure to cnc and oo-programming to comply with Austrian national curriculum changes  
project total cost per individual robot including NodeMCU esp8266 is limited to 10-15€

descent
-------
[espruino](https://github.com/espruino) provides easy access to microcontrollers  
wifi equipped chips can act as servers and host websites / services  
programming of hardware, server and websites done in a single language: [JavaScript](https://en.wikipedia.org/wiki/JavaScript)  
an interactive development evnironment [IDE](https://www.espruino.com/ide/) is provided as a webpage  
from there compatible chips can be addressed immediately through an interactive REPL console  
espruino facilitates [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)) communication and thus remote control and telemetry via smartphones  
established project is a very well [documented](https://www.espruino.com/) with a supportive [forum](https://forum.espruino.com/) and concise [API](https://www.espruino.com/Reference#software) reference

ide status
----------
- [x] moesspruino binaries and webide tested to run on personal win10 win7 linux64 installations, however:  
- [ ] web-serial might not be accessing usb devices properly on every windows machine.  
      monitor chrome's device log @

```javascript
chrome://device-log/?refresh=%3Csec%3E
```

- [ ] confirm compatibility of your machine with [google's web serial demo](https://googlechromelabs.github.io/serial-terminal/) and look out for 'framing errors'  
      a version of Teranishi's Terminal for working with the ESP8266 is provided as temporary workaround  
      or use linux or a virtual machine with a linux image as an alternative

online access
-------------
- moesspruino is hosted [here on github.io](https://beweonline.github.io/moesspruino/webIDE/index.html)
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
make sure to have a working [node.js](https://nodejs.org/en/) runtime environment and [node-powers-moesspruino](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
from the moesspruino working directory containing `package.json` run `npm install` to download the npm-modules

compiling executables
---------------------
to compile for/under windows run `build_nexe.bat`  
to compile for/under linux run `./build_nexe.sh`  
set appropriate parameters for your target OS in the batch/shell file  
make sure you've got the [nexe](https://github.com/nexe/nexe) module [installed](https://www.npmjs.com/package/nexe)

linux permissions
-----------------
on a \*nix OS, chrome must be allowed to open tty ports  
by default in a posix terminal you'd usually get
```console
foo@bar:~$ ls -l /dev/ttyUSB0
crw-rw----. 1 root dialout 188, 0 Jan 01 00:00 /dev/ttyUSB0
```
then make your $user-account a member of the dialout group with
```console
foo@bar:~$ sudo usermod -a -G dialout $USER
```
to start up moesspruinoX locally, make it executable
```console
foo@bar:~$ sudo chmod 644 moesspruino
```
to shut the server kill the process through a terminal
```console
foo@bar:~$ killall -9 moesspruino
```
if running a vbox linux guest in windows, forward com host-ports and note that  
`com1 == ttyS1 | com2 == ttyS2 etc.`

firmware for ESP8266
--------------------
the `flash` directory contains a `regFLASH.bat` to flash any ESP8266 board automatically  
with the included espruino firmware by checking the windows registry for Silab devices on COM ports

SililconLabs usb driver
-----------------------
if `infoCOM.bat` in the `flash` directory can not detect an ESP8266 device you might have to install [CP210x USB to UART Bridge](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads)
