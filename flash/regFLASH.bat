:: george.kiwi 04/09/2022
:: for ESP8266NodeMCU find serial port with 115200 Baud
:: then flash firmware with max rate

@echo off
setlocal enableDelayedExpansion
cls

 FOR /F "tokens=1,3" %%I IN ('reg query HKLM\HARDWARE\DEVICEMAP\SERIALCOMM') DO (
  IF %%I == \Device\Silabser0 (
   ECHO %%I @ %%J
   esptool.exe --port %%J --baud 460800 write_flash --flash_freq 80m --flash_mode dio --flash_size 4MB-c1 0x0000 espruino_2v15_esp8266_4mb_combined_4096.bin
  )
 )

