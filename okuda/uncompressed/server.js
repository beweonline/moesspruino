function server(){

const wifi = require('Wifi');
const storage = require('Storage');

if(global.log == undefined){
	global.log = function(){};
}

var blinkStatus = true, LED = NodeMCU.D0;
function blink(){
	blinkStatus = !blinkStatus;
	digitalWrite(NodeMCU.D0, blinkStatus);
}
var i = setInterval(blink, 300);

var Ajax = {};
Ajax.test = function(data, method){
	if(!Ajax[data.servo]){
		Ajax[data.servo] = {};
		Ajax[data.servo].pos = 2.7;
		Ajax[data.servo].duration = 40;
		Ajax[data.servo].status = 0;
		Ajax[data.servo].posSlider = ['positionSlider', 0, 0];
		Ajax[data.servo].incSlider = ['incrementSlider', 0, 0];
	}
	if(method == 'push'){return Ajax.push(data);}
	else if(method == 'pull'){return Ajax.pull(data);}
};
Ajax.push = function(data){
	var sg90servo = data.servo.slice(-1)-1; //'Servo1' => '0'
	if(Object.keys(data).length == 2){
		Ajax[data.servo].status = data.status;
			servos[sg90servo].sleep();
	} else {
		Ajax[data.servo].pos = data.pos;
		Ajax[data.servo].duration = data.duration;
			servos[sg90servo].duration = data.duration;
		Ajax[data.servo].status = data.status;
			servos[sg90servo].move(Number(data.pos), Number(data.duration));
		Ajax[data.servo].posSlider = data.posSlider;
		Ajax[data.servo].incSlider = data.incSlider;
	}
	return Ajax[data.servo];
};
Ajax.pull = function(data){
	var sg90servo = data.servo.slice(-1)-1; //'Servo1' => '0'
	data = [Ajax[data.servo].pos = servos[sg90servo].position.toFixed(1),
			Ajax[data.servo].duration = servos[sg90servo].duration,
			Ajax[data.servo].status = servos[sg90servo].alive,
			Ajax[data.servo].posSlider,
			Ajax[data.servo].incSlider];
	return data;
};

// GET & POST routs
function router(req, res) {
	var r = url.parse(req.url, true);
	function logReq(data){
		if(data){
			log('request{method: '+req.method+', url:'+req.url+
				', data:'+JSON.stringify(data)+'}');
		} else {
			log('request{method: '+req.method+', url:'+req.url+'}');
		}
	}
	//POST
	var data='';
	if(req.method=='POST') {
		req.on('data',function(chunk){
			if(chunk){data+=chunk;}
			if(data.length >= Number(req.headers['Content-Length'])){
				data = JSON.parse(data);
			//logReq(data);
			//package data
			if(r.pathname == "/pull"){
				data = {servo: data.servo, values: Ajax.test(data, 'pull')};
				res.writeHead(200);
				res.end(JSON.stringify(data));
			}else if(r.pathname == "/push"){
				Ajax.test(data, 'push');
				data = {servo: data.servo, values: Ajax.test(data, 'pull')};
			//safety on
			var i = 0;
			var tries = 40;
			function testMove(res){
				i++;
				if(servos[data.servo.slice(-1)-1].idle == true){return res();}
				if(i < tries){wait(res);}
			}
			function wait(res){
				setTimeout(testMove, 500, res);
			}
			var promise = new Promise((res, rej) =>{
				wait(res);
			});
			promise.then(_=> {
				res.writeHead(200);
				res.end(JSON.stringify(data));}
			);
			}
			}else if(data.length > Number(req.headers['Content-Length'])){
				res.writeHead(418);
				res.end("alert('data was corrupted')");
			}
		});
	}
	//GET
	else if(r.method == 'GET'){
	logReq();
	function stream(file){
		// write response in packets
		file = storage.read(file);
		var packet = 1024;
		var chunks = Math.ceil(file.length/packet);
		var n = 1;
		res.on('drain',function() {
			if(n===1){res.write(file.slice(0,packet*n));}
			else if(n>=2 && n<=chunks){
				res.write(file.slice(packet*(n-1),packet*n));
			}
			n++;
			if(n>chunks){res.end();}
		});
		res.write();
	}
	if (r.pathname == '/') {
		clearInterval(i);
		setTimeout(_=> {digitalWrite(NodeMCU.D0, true);}, 1000);
		res.writeHead(200, {'Content-Type': 'text/html'});
		stream('okuda.html');
	}
	else if (r.pathname=='/SVG') {
		res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
		stream('okuda.svg');
	}
	else if (r.pathname=='/okuda.js') {
		res.writeHead(200, {'Content-Type': 'text/javascript; charset=UTF-8'});
		stream('okuda.js');
	}
	else if (r.pathname=='/msg') {
		//log('msg >>>', r.search.slice(1,r.search.length));
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('logged');
	}
	else if (r.pathname=='/servos') {
		var servoList = [];
		for(servo of servos){servoList.push(
			[servo.device, espToNode(servo.pin.toString())
		]);}
		//log(servoList);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify(servoList));}
	else {
		res.writeHead(404);
		res.end('404: Not found');
	}
	}//stream
}

// http server & wifi credentials
function createServer(IP) {
	require('http').createServer(router).listen(80);
	log('Listening on ' +IP);
	changeInterval(i, 800);
}

function APIPsettings(){
	var id = storage.read("id.txt");
	var settings = {
	ip: '192.168.4.'+id,
	netmask: '255.255.255.0',
	gw: '192.168.4.'+ id};
	return settings;
}

function setIPcallback(err) {
	if (err) {
		log(err);
	} else {
		log('access point at', APIPsettings().ip);
		createServer(APIPsettings().ip);
		servoSetup();
	}
}

wifi.disconnect();
wifi.setAPIP(APIPsettings(), setIPcallback);
wifi.startAP('moessARM_'+APIPsettings().ip, {authMode:'wpa2'; password: 1234});

function espToNode(pin){
	var node = ['D0','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10'];
	var esp = ['D16','D5','D4','D0','D2','D14','D12','D13','D15','D3','D1'];
	return node[esp.indexOf(pin)];
}

//moessARM demo setup
function servoSetup(){
	var sg90 = require('sg90.js');
	var myServos = ['D0','D1','D2','D3'];
	sg90.setup(myServos);
}

}//bootCode

var exports = {
  server: _=> server()
};