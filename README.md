# [moesspruino](https://beweonline.github.io/)
a robotics project originally for Moessinger junior high school design and technology education  
includes a customized Espruino IDE, an object-orientated sg90 servo library, schematics for a robot arm, an ajax interface for its mobile cnc  
changes to the original IDE are documented in `customizations.txt`  
tutorials and walkthrough to be handed in after test run, late 2023

background
----------
main interrest is constructing a model of a articulated robot with pick-and-place functionality from scratch  
K8/9 pupils want to program animations for several servo motors with minimal supervision  
gentle exposure to cnc and oo-programming to comply with Austrian national curriculum changes  
aside initial setup costs the project's annual recurrent expense per unit shouldn't exceed 10 - 15€  
as of spring 2023 the total post-covid expenditure for a single moessARM robot including all the items from the list below amounts to roughly 36€

cost
----
affording robotics projects in a public school without funding is very cost sensitive  
every effort has been taken to design a system that strikes a balance between managablility and affordability  
bulk order is crucial as is 

| item  | quantity | price € |
| ------------- | ------------- | ------------- |
| Servo SG90 | 4 | 7.55 |
| NodeMCU Amica | 1 | 4.34 |
|  |  | 12 |
|  |  |  |
| 9V adapter | 1 | 5.04 |
| breadboard | 1 | 3.36 |
| micro USB cable | 1 | 2.35 |
| HW313 breadboard ps module | 1 | 1.79 |
| Dupont cable male-male | 4x3 | 1.09 |
| Dupont cable female-male | 1x3 | 0.30 |
|  |  | 14 |
|  |  |  |
| flanged rotary bearing | 1 | 3.53 |
| rubber collar M4 | 16 | 0.95 |
| crimp-on ring terminals | 10 | 0.81 |
| screw eye 4/10 | 17 | 0.64 |
| micro screw M2 | 10 | 0.39 |
| M4 bolt 10mm | 12 | 0.20 |
| M4 bolt 40mm | 2 | 0.06 |
| M4 6-edge nut | 15 | 0.14 |
| wooden rod M4 | 1 | 0.06 |
| bolt sleeve | 2 | 0.10 |
|  |  |  |
| 4mm plywood birch A3 | 1 | 1.99 |
| 2cm^3 cube beech | 12 | 1.21 |
| spatula beech | 10 | 0.32 |
| skewer bamboo | 6 | 0.04 |
|  |  | 10.5 |
|  |  |  |
|  |  | 36.25 |

descent
-------
[espruino](https://github.com/espruino) provides low-threshold access to microcontrollers  
wifi equipped chips can act as servers and host websites / services  
programming of hardware, server and websites done in only one concurrent language: [JavaScript](https://en.wikipedia.org/wiki/JavaScript)  
an interactive development evnironment [IDE](https://www.espruino.com/ide/) is provided as a webpage  
from there compatible chips can be addressed interactively through a responsive [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) console  
espruino facilitates [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)) communication and thus remote control and telemetry via hotspots  
it's an established project that's very well [documented](https://www.espruino.com/) with a supportive [forum](https://forum.espruino.com/) and a concise [API](https://www.espruino.com/Reference#software) reference

ide status
----------
- [x] moesspruino binaries and web-ide tested to run on personal win10 win7 linux64 installations, however:  
- [ ] web-serial might not be accessing usb devices properly on every windows machine  
      monitor chrome's device log @

```javascript
chrome://device-log/?refresh=%3Csec%3E
```

- [ ] confirm compatibility of your machine with [google's web serial demo](https://googlechromelabs.github.io/serial-terminal/) and look out for 'framing errors'  
      a version of Teranishi's Terminal for working with the ESP8266 is provided as a temporary workaround  
      or use linux or a virtual machine with a linux image as an alternative environment
      with moessbian a VirtualBox image of an especially frugal version of debian with chrome and moeXpruino preinstalled is provided
      this was necessary due to restrictions of my school's system administration making debugging driver impediments impossible

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
sudo usermod -a -G dialout $USER
```
to start up moeXpruino64.bin locally, make it executable
```console
sudo chmod 777 moeXpruino64.bin
```
to shut the server and release localhost:8080 kill the process through the terminal
```console
killall -9 moeXpruino64.bin
```
if running a vbox linux guest in windows, forward host com ports as [host devices](https://docs.oracle.com/en/virtualization/virtualbox/6.0/user/serialports.html) and note that tty is zero based  
`com1 == ttyS0 | com2 == ttyS1 etc.`

firmware for ESP8266 (win)
--------------------------
the `flash` directory contains a `regFLASH.bat` to flash any ESP8266 board automatically  
with the included espruino firmware by checking the windows registry for Silab devices on COM ports

SililconLabs usb driver (win)
-----------------------------
if `infoCOM.bat` in the `flash` directory can not detect an ESP8266 device you might have to install [CP210x USB to UART Bridge](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads)
