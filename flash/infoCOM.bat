:: george.kiwi 04/09/2022
:: for ESP8266NodeMCU find serial port with 115200 Baud
:: then flash firmware with max rate

@echo off
setlocal enableDelayedExpansion
cls
reg query HKLM\HARDWARE\DEVICEMAP\SERIALCOMM

FOR /F "tokens=1,3" %%I IN ('reg query HKLM\HARDWARE\DEVICEMAP\SERIALCOMM') DO (
  IF %%I == \Device\Silabser0 (
   ECHO %%I @ %%J
   MODE %%J:115200,N,8,1,P
  )
)

FOR /L %%G IN (1,1,5) DO (
 FOR /F "tokens=*" %%I IN ('mode com%%G ^| find "Baud"') DO (
  SET /A myVar=!%%I!
  ECHO !myVar! @ COM%%G
  IF !myVar! == 115200 (
   ECHO ESP8266 @ COM%%G
  )
)%)