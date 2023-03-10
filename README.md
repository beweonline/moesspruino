# moesspruino
customized Espruino IDE for Moessinger high school design and technology education
for an overview of changes have a look at customizations.txt

workflow
--------

0. for portability reasons 'moesspruino.exe' is a nexe-build of a node project
1. it starts a node.js server and provides a customized espruino-ide-webpage on localhost:8080/index.html
2. the system's default browser is targeted to that URL
   note that your webbrowser must support the web-serial interface (e.g. chrome or MS edge)
3. connect with your NodeMCU microcontroller via the left upper corner button
4. follow instruction and tutorials from espruino.com


compiling executables
---------------------
to compile for windows use the build_nexe.bat and set appropriate parameters for your OS
make sure to have a working node.js environment and the nexe module installed
