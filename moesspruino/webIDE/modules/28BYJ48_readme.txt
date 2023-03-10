http://forum.espruino.com/conversations/291438/

Inspired by @Gordon writeup to control a stepper motor here, I decided to write a control module for the ubiquitous 28BYJ-48 stepper. These are used everywhere and are manufactured by the millions, so they can be had for very cheap (I just bought 10 with free shipping on eBay for about U$1 apiece). In "4 step" mode there are 2048 steps in a full turn. 8 stepping gets you 4096 discrete steps per 360 degrees.

Note, this is a work in progress, so there are still aspects/concepts evolving in how it works. For now, though, here's what's implemented:

connect(pin1, pin2, pin3, pin4): Used to initialize the driver when loading the module. The pins are the 4 stepper motor coil drivers. Returns an object for controlling the attached stepper motor.

obj.step([ccw[, step8]]): Turns the stepper one step. Optional flags, if true, change direction to counter-clockwise (default is clockwise), and to step with the 8-step schema vs. the 4-step schema (read up on stepper motors, and this will be totally clear).

obj.move(steps[, ccw[, step8[, fnDone]]]): Move the motor shaft 'steps' steps. The true/false flags 'ccw' and 'step8' operate as explained above; the optional parameter 'fnDone' is a callback that gets invoked with the move is completed; this parameter is necessary because the call is non-blocking -- i.e. doesn't wait for the move to complete. Negative 'steps' values will simply reverse the sense of the 'ccw' flag -- i.e. moving -100 steps with ccw 'true' will move cw.

obj.moveAngle(angle[, ccw[, step8[, fnDone]]]): Same as obj.move() except the amount is specified in angular degrees rather than steps.

obj.zero(): Set the current position as location 0 for the following two functions.

obj.moveTo(target[, ccw[, step8[, fnDone]]]): Move to specific step count relative to zero set.

obj.moveToAngle(target[, ccw[, step8[, fnDone]]]): Move to a specific location relative to zero, target in angular degrees.

Properties of the stepper class that can be set separately:

obj.speed: A float value between 0.0 and 1.0, where 1.0 is the maximum speed the shaft can turn, and still maintain accuracy. Setting to 0.5 will cause the shaft to turn half as fast. This parameter affects the delay time between steps, which right now seems to only work 100% reliably if 3ms, but works almost 100% reliably at 2ms so long as the initial steps are a bit slower to allow acceleration of the internal, geared-down motor. I'm still playing with this. Default is 1.0 when the object is created.

Example:

stepper = require("28BYJ48").connect(B3, B4, B5, B6);
/* on instantiation, the driver will be zeroed at the stepper's current position */
stepper.moveAngle(45); //turn clockwise 45 degrees
stepper.move(256, true); //turn counterclockwise 256 steps, which is 45deg in 4 step mode
stepper.move(-1024, false, true); //turn counterclockwise 1024 steps in 8-step mode; ==90deg
stepper.moveTo(90, false, false, done); //will turn 180deg/1024 steps clockwise in 4-step mode, then call function 'done()'