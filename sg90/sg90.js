// george.kiwi 2023.03 servo control for sg90 V2.3.8b "don't var inside for()"

var move = ["m", "move", 0, undefined];
var pulse = ["p", "pulse", 1];

// object instantiation & option merging
function _connect(options) {
  var deepCopy = Object.assign({}, _Servo);
  for (var key in options) {
    deepCopy[key] = options[key];
  }
  if (global.servos == undefined) {
    global.servos = [];
    deepCopy.device = "servo0";
  } else {
    deepCopy.device = "servo" + (global.servos.length);
  }
  global.servos.push(deepCopy);
  return deepCopy;
}

function _setup(servos) {
  var i = 0;
  for (var servo of servos) {
    global["servo" + i] = _connect({
      pin: NodeMCU[servo]
    });
    global["servo" + i].id = i;
    i++;
  }
  global.sleep = _sleepAll;
  global.wake = _wakeAll;
  global.calibrate = _calibrateAll;
  global.stop = _stop;
  global.pause = _pause;
}

function _pause(duration) {
  return new Promise((res, rej) => {
    setTimeout(_ => {global.servos[0].msg('pause: '+duration, 1); res();}
    , duration);
  });
}

function _stop(){
	// in case of emergency
	clearInterval();
	for(var servo of servos){
		global[servo.device] = null;
	}
	setTimeout(_=> {
		global.servos = null;
		print('+ servos nullified +');
	}, 200);
}

function _sleepAll() {
  return new Promise((res) => {
    var sleepers = [];
	var promise;
    for (var servo of global.servos) {
      promise = servo.sleep();
      sleepers.push(promise);
    }
    Promise.all(sleepers).then(_ => (print('all asleep'), res("done")) );
  });
}

function _wakeAll() {
  return new Promise((res) => {
    var risers = [];
	var promise;
    for (var servo of global.servos) {
      promise =  servo.wake();
      risers.push(promise);
    }
    Promise.all(risers).then(_ => (print('all awake'), res("done")) );
  });
}

function _calibrateAll(mode, sleep) {
  return new Promise((res) => {
    var calibrations = [];
	var promise;
    for (var servo of global.servos) {
      promise = servo.calibrate(mode);
      calibrations.push(promise);
    }
    Promise.all(calibrations).then(_ => (print('all calibrated('+mode+')'), res("done")) );
  });
}

function _checkStatus(servo, property) {
  return new Promise((res) => {
    var result = [];
    if (servo != null) {
      result.push(servo[property]);
    } else if (servo == null) {
      for (var globalServo of global.servos) {
        result.push(globalServo[property]);
      }
    }
    res(result);
  });
}

function  stepper(servo, start, stop, duration, direction) {
  // purpose: #1 mem control through recursion
  //          #2 keep Servo.move() thenable
  var event = function(servo) {
    servo.emit('stepper');
    servo.removeAllListeners('stepper');
  };
  if (servo.alive === true && (start.toFixed(2) !== stop.toFixed(2)) ) {
    setTimeout(_ => {
      servo.position = start;
      servo.msg('step', 0, servo);
      start += direction * servo.increment;
      stepper(servo, start, stop, duration, direction);
    }, duration);
  } else {
	servo.position = stop;
    event(servo);
  }
}

// Servo object
var _Servo = {
  id: null,
  pin: null,
  position: 2.7,
  duration: 40,
  increment: 0.01,
  wait: 20,
  steps: undefined,
  verbose: false,
  interval: null,
  alive: false,
  timeout: 500
};

_Servo.msg = function(msg, force, servo){
	if(this.verbose || force){
		if(!servo){servo = this;}
		print(servo.device+'  '+msg+'  '+servo.position);
	}
};

_Servo.calibrate = function(mode) {
  return new Promise((res) => {
    if (pulse.includes(mode)) {
      this.pulse(2.7)
      .then(_=> {this.msg("calibrate(p)", 1); res();});
    } else if (move.includes(mode)) {
      this.move(2.7,10)
      .then(msg => {this.msg("calibrate(m)", 1); res(msg);});
    }
  });
};

_Servo.pulse = function(pos) {
  // pulse a discrete POSITION - sets this.position!
  return new Promise((res) => {
    this.position = pos;
    var cont = function(servo){
		setTimeout(_ => {servo.msg('pulse', 1); res();}, servo.timeout);
	};
    if (this.alive == false) {
		this.wake()
		.then(_=> cont(this));
	} else { cont(this); }
  });
};

_Servo.wake = function() {
  return new Promise((res, rej) => {
    if (this.alive == false) {
      this.interval = setInterval(_ => {
        digitalPulse(this.pin, HIGH, E.clip(this.position, 0.5, 4.5));
      }, 20);
      this.alive = true;
	  setTimeout(() => {this.msg("wake", 1); res();}, this.timeout);
    } else {rej();}
  });
};

_Servo.sleep = function() {
  return new Promise((res) => {
	clearInterval(this.interval); this.alive = false;
	setTimeout(() => {this.msg("sleep", 1); res();}, this.timeout);
  });
};

_Servo.move = function() {
  // sweep through a range of positions
  // check for valid arguments
  var start, stop, duration;
  var arg = arguments;
  if (arg.length == 1) {
    if (arg[0] >= 1 && arg[0] <= 4.5) {
      start = this.position;
      stop = arg[0];
      duration = this.duration;
    } else {
      return this.msg("out-of-bounds (stop)");
    }
  } else if (arg.length == 2) {
    //(start, stop) i.e. pulse to start + step to stop
    if (arg[0] >= 1 && arg[0] <= 4.5 && arg[1] >= 1 && arg[1] <= 4.5) {
      start = arg[0];
      stop = arg[1];
      duration = this.duration;
    }
    //(stop, duration)
    else if (arg[0] >= 1 && arg[0] <= 4.5 && arg[1] >= 10) {
      stop = arg[0];
      duration = arg[1];
      start = this.position;
    } else {
      return this.msg("out-of-bounds (start/stop | stop/duration)");
    }
    //(start, stop, duration)
  } else if (arg.length == 3 && arg[2] >= 10 && arg[0] >= 1 &&
    arg[0] <= 4.5 && arg[1] >= 1 && arg[1] <= 4.5) {
    start = arg[0];
    stop = arg[1];
    duration = arg[2];
  } else {
    return this.msg("out-of-bounds (start | stop | duration)");
  }
  // sweep through range of positions
  var steps = Math.round((stop - start) / this.increment);
  return new Promise((res) => {
	var cont = function(servo){
		servo.msg('move('+start+'>'+stop+'/'+duration+')', 1);
		servo.on('stepper', _ => {
		  setTimeout(_ => {servo.msg('move_complete'); res('moved');}, servo.timeout);
		});
		stepper(servo, start, stop, duration, (steps / Math.abs(steps)));
		servo.msg('step-duration: '+duration+', steps :'+steps+
			', TimeOut: '+Math.abs((duration) * steps)+'ms');
	};
    if (this.alive == false) {
      this.position = start; this.wake().then(_=> cont(this));
    } else { cont(this); }
  });
};

// module export
var exports = {
	connect: function(options) {
	  return _connect(options);
	},
	setup: function(servos) {
	  return _setup(servos);
	},
	status: function(id, property) {
	  return _checkStatus(id, property);
	},
	stop: function(){
		return _stop();
	}
};
