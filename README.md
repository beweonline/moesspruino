# [moessARM](https://beweonline.github.io/)

...is a robotics project originally for [Moessinger](https://www.moessinger.at/index.php/angebot/htl-kooperationsklasse) junior high school's design and technology education  
it's originally intended for the school's H track that cooperates with the adjacent vocational institute for [electrical engineering](https://htl-klu.at/et)  
the project includes a number of subsystems like  
-  a *project website* with videos and code samples  
-  *didactic material* - presentations on coding and microcomputing  
-  **moesspruino** on- and offline versions of a customized Espruino IDE  
-  **sg90.js** an object-orientated sg90 servo library  
-  **sg91.js** version for use with mobile programming (gentle on resources)  
-  **moessARM** schematics / handouts for a 4-servos robotic arm  
-  **moessARMjunior** schematics for a simple 2-servos arm  
-  **okuda rc** an ajax sliders interface for mobile cnc  
-  **editor rc** an ajax repl for mobile programming  
-  **moessbian** a custom Debian as a vbox virtual machine  

tutorials and walkthroughs can be expected summer 2025

background
----------
- the main interrest lies in constructing a model of an articulated robot with pick-and-place functionality, _from scratch_  
- K8/9 pupils want to program animations for several servo motors with minimal supervision  
- offer gentle exposure to cnc and oo-programming to comply with Austrian national curriculum changes in t/d education  
- aside from initial setup costs the project's annual *recurrent* expense per unit shouldn't exceed 10€  
if electronic equipment were to remain at school, parents would cover the expense of the mechanical structure which pupils would get to keep; as one may learn from the below statement of costs, school would've to fund 26€ for reusable materials while legal guardians would contribute a mere 10€; if teamwork is employed as a means of speeding up mechanical construction, an amicable mode of sharing or assigning cost may have to be found;

cost
----
...is a matter of particular interest when affording robotics within the public schooling sector and without government funding  
every effort has been taken to design a didactic system that strikes a balance between affordability and the prerequisite to foster independent crafting by the student  
needles to mention that bulk order from global retailers is crucial in obtaining favourable discount  
as of spring 2023 the total post-covid expenditure for a single moessARM robot including all the items from the list below amounted to roughly 36€  
common workshop expendables like sand paper, drillers, express white glue, hot glue and such have been neglected here

| **_electronics_**  | quantity | price € || **_lab accessories_**  | quantity | price € |
| ------------- | ------------- | ------------- |-| ------------- | ------------- | ------------- |
|  | |  |  |  ||  |  |
| Servo SG90 | 4 | 7.55 || 9V adapter | 1 | 5.04 |
| NodeMCU Amica | 1 | 4.34 || breadboard | 1 | 3.36 |
| Dupont cable male-male | 4x3 | 1.09 || micro USB cable | 1 | 2.35 |
| Dupont cable female-male | 1x3 | 0.30 || HW313 breadboard ps module | 1 | 1.79 |
|  |  | **13,-** | |  |  | **13,-** |

| **_mechanical components_** | quantity | price € || **_structural material_** | quantity | price € |
| ------------- | ------------- | ------------- |-| ------------- | ------------- | ------------- |
| flanged rotary bearing | 1 | 3.53 || wooden rod M4 | 1 | 0.06 |
| rubber collar M4 | 16 | 0.95 || 4mm plywood birch A3 | 1 | 1.99 |
| crimp-on ring terminals | 10 | 0.81 || 2cm<sup>3</sup> cube beech | 12 | 1.21 |
| screw eye 4/10 | 17 | 0.64 || spatula beech | 10 | 0.32 |
| micro screw M2 | 10 | 0.39 || skewer bamboo | 6 | 0.04 |
| M4 bolt 10mm | 12 | 0.20 |
| M4 bolt 40mm | 2 | 0.06 |
| M4 6-edge nut | 15 | 0.14 |
| plastic bolt sleeve | 2 | 0.10 |
|  |  |||  |  | **10.5,-** |

moesspruino's descent
-------
[espruino](https://github.com/espruino) provides low-threshold access to microcontrollers  
wifi equipped chips can act as servers and host websites / services  
programming of hardware, server and websites done in only one concurrent language: [JavaScript](https://en.wikipedia.org/wiki/JavaScript)  
an interactive development evnironment [IDE](https://www.espruino.com/ide/) is provided as a webpage  
from there compatible chips can be addressed interactively through a responsive [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) console or a full-fledged editor  
espruino facilitates [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)) communication and thus remote control and telemetry via hotspots  
it's an established project that's very well [documented](https://www.espruino.com/) with a supportive [forum](https://forum.espruino.com/) and a concise [API](https://www.espruino.com/Reference#software) reference  
changes to the original IDE are documented in `customizations.txt`  

*below information is intended for the tech savvy*
ide status
----------
- [x] moesspruino binaries and web-ide tested to run on personal win10 win7 linux64 installations, however:  
- [ ] behind the fences of institutional security systems, web-serial might not be accessing usb devices properly on every windows machine! check access to the device by monitoring chrome's device log @

```javascript
chrome://device-log/?refresh=%3Csec%3E
```

- [ ]  verify cleanliness of the signal & confirm compatibility of your machine with [google's web serial demo](https://googlechromelabs.github.io/serial-terminal/) and look out for 'framing errors'

a version of Teranishi's Terminal for working with the ESP8266 is provided as a temporary workaround on MS windows machines with impedence  
or use linux or a virtual machine with a linux image as an alternative environment  
with **_moessbian_** a [VirtualBox](https://www.virtualbox.org/) image of an especially frugal version of debian with chrome and **_moeXpruino_** preinstalled is provided  
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
0. for portability reasons and offline use `moesspruino.exe` is a nexe-build of a node project for windows
   `moeXpruino.bin` is the same nexe-build but fot linux  
2. it starts a node.js server and provides a customized espruino-ide-webpage on localhost:8080/index.html
3. the system's default browser is called and pointed to that URL  
   note that your webbrowser must support the web-serial interface (e.g. chrome, brave or MS edge)

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
by default, in a posix terminal, you'd usually get
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
if running a vbox linux guest in windows, first make sure the ESP8266 is registered on a COM port less than 4 (because virtual box may loop through only ports 0 to 3). to set go to device manager > ports > cp210x > port settings > advanced > COM port number  
then forward host com ports as [host devices](https://docs.oracle.com/en/virtualization/virtualbox/6.0/user/serialports.html) and note that in linux tty is zero based  
`com1 == ttyS0 | com2 == ttyS1 etc.`

firmware for ESP8266 (win)
--------------------------
the `flash` directory contains a `regFLASH.bat` to flash any ESP8266 board automatically with the included espruino firmware by checking the windows registry for Silab devices on COM ports. if that fails, you may want to try `baudFLASH.bat` to chose the device by it's baud rate of 115200.

SililconLabs usb driver (win)
-----------------------------
if `infoCOM.bat` in the `flash` directory can not detect an ESP8266 device you might have to install [CP210x USB to UART Bridge](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads)
