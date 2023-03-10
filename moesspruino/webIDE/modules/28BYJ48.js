_28BYJ48 = function(pin1, pin2, pin3, pin4) {
	this.step4 = [0b0001,0b0010,0b0100,0b1000];
	this.step8 = [0b0001,0b0011,0b0010,0b0110,0b0100,0b1100,0b1000,0b1001];
	this.cw = [pin1, pin2, pin3, pin4];
	this.ccw = [pin4, pin3, pin2, pin1];
	this.sindex = 0;
	this.position = 0;
	this.speed = 1.0;
	this.minDly = 2;
};

_28BYJ48.prototype.step = function(ccw, step8) {
	digitalWrite(
		ccw ? this.ccw : this.cw,
		(step8 ? this.step8 : this.step4)[this.sindex = ++this.sindex % (step8 ? 8 : 4)]
	);
	this.position = (this.position + 4096 + (ccw?-1:1) * (step8?1:2)) % 4096;
};

_28BYJ48.prototype.move = function(steps, ccw, step8, fnDone) {
	var count = 0;
	ccw ^= (steps < 0);
	steps = Math.abs(steps);
	var dly = this.minDly / this.speed;
	if (dly < 4) dly = 5;
	var iid = setInterval(function(obj, ccw, step8) {
		obj.step(ccw, step8);
		if (++count >= 10) changeInterval(iid, obj.minDly / obj.speed);
		if (count >= steps) {
			clearInterval(iid);
			if (typeof fnDone === 'function') fnDone();
		}
	}, dly, this, ccw, step8);
};

_28BYJ48.prototype.moveAngle = function(angle, ccw, step8, fnDone) {
	this.move(angle * 2048 * (step8?2:1) / 360, ccw, step8, fnDone);
};

_28BYJ48.prototype.zero = function() { this.position = 0; };

_28BYJ48.prototype.moveTo = function(target, ccw, step8, fnDone) {
	this.move(target - this.position, ccw, step8, fnDone);
};

_28BYJ48.prototype.moveToAngle = function(angle, ccw, step8, fnDone) {
	this.moveAngle(angle - 360 * this.position / 2048, ccw, step8, fnDone);
};

exports.connect = function(pin1, pin2, pin3, pin4) {
	return new _28BYJ48(pin1, pin2, pin3, pin4);
}
