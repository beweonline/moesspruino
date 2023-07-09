var sg90 = require("sg90.js");
var myServos = ["D0","D1","D2","D3"];
sg90.setup(myServos);

function animation(){
  calibrate(1)
  //comment
  .then(_=> servo3.pulse(3.3) )
  .then(_=> servo3.move(3, 2.7, 100) )
  .then(_=> myMove(20) )
  .then(_=> pause(1000) )
  .then(_=> calibrate() )
  .then(_=> sleep() );
}

function myMove(x){
    return Promise.all([
    servo0.move(4, x),
    servo1.move(4, x),
    servo2.move(1, x) ]);
}

animation();
