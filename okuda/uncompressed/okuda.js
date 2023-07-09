/* section I - GLOBALS*/
body.style.margin='0px';
body.style.backgroundColor='RGB(0,0,0)';
// globals
var IO = true; var idle = true; var click = false;
var sliders = {1: [2.7,40,0], 2: [2.7,40,0], 3: [2.7,40,0], 4: [2.7,40,0]};
sliders.active = '1'; sliders.current = null;
var svgPos = [];
// populate svgPos
for(var i=1; i<5; i++) {
	svgPos[i] = [];
	svgPos[i][0] = ['positionSlider', 0, 0];
	svgPos[i][1] = ['incrementSlider', 0, 0];
}

function  colors() {
	// on servoSwap save color to restore after blue flash
	window.colors = {};
	colors.current = 'Servo1';
	colors[colors.current] = document.getElementById(colors.current).style.fill;
}

function  idArrays() {
	// id arrays as globals after svgLoad
	window.servos = ['Servo1','Servo2','Servo3','Servo4',
		'Servo1Text','Servo2Text','Servo3Text','Servo4Text'];
	window.servoText = ['tspan1019','tspan1023','tspan1027', 'tspan1031'];
	window.servoBars = ['Servo1b','Servo2b','Servo3b','Servo4b'];
	window.pluses = ['plusTop','plusBottom','plusTopSymbol','plusBottomSymbol'];
	window.minuses = ['minusTop','minusBottom','minusTopSymbol','minusBottomSymbol'];
	window.bars = ['positionBar','incrementBar'];
	window.sliderPosition = ['positionText','positionSlider',
		document.getElementById("positionText").children[0].id,];
	window.sliderIncrement = ['incrementText','incrementSlider',
		document.getElementById("incrementText").children[0].id];
	window.resets = ['positionReset','incrementReset','positionResetText','incrementResetText'];
	window.playStop = ['Play', 'Stop', 'stripRight'];
	window.buttons = servos.concat(pluses,minuses,resets);
	window.colorSwap = bars.concat(['positionReset','incrementReset'],
		['plusTop','plusBottom'],['minusTop','minusBottom']);	
}

function  clearGlobals() {
	click = false;
	if(sliderPosition.includes(sliders.current)){
		post('position', 0);
	}
	sliders.current = null;
}

/* section II - client_UI.js */
function  button(e) {
	click = true;
	e.preventDefault();
	if(idle == true){
		//AJAX.push >>>
		if(playStop.includes(e.target.id)){
			togglePlayStop();
			var data = sliders[sliders.active].slice(0,-1);
			ajaxPOST(colors.current, data)
			.then(_=> ajaxGET(colors.current))
			.then(_=> servoSwap(colors.current));
		}
		if(servos.includes(e.target.id)){
			sliders.active = e.target.id.slice(-1);
			ajaxGET(e.target.id)
			.then(_=>servoSwap(e.target.id));
		}
	}
	if(IO == true){
		var target;
		// isolate text fields - replace with button fields
		if(buttons.includes(e.target.parentElement.id)){
			target = e.target.parentElement;
			if(target.id.endsWith("Text")){
				target = document.getElementById(target.id.slice(0,-4));
			} else if(target.id.endsWith("Symbol")){
				target = document.getElementById(target.id.slice(0,-6));
			}
			reaction();
		}
		else if(buttons.includes(e.target.id)){
			target = e.target;
			reaction();
		}
		// set slider param
		else if (sliderPosition.includes(e.target.id)){
			sliders.current = '0';
		} else if (sliderIncrement.includes(e.target.id)){
			sliders.current = '1';
		}
	}
	function reaction(){

		switch(target.id){
			case 'minusTop':
				sliders.current = '0';
				sliderUpdate('positionText', -0.1);
				break;
			case 'plusTop':
				sliders.current = '0';
				sliderUpdate('positionText', 0.1);
				break;
			case 'minusBottom':
				sliders.current = '1';
				sliderUpdate('incrementText', -0.6);
				break;
			case 'plusBottom':
				sliders.current = '1';
				sliderUpdate('incrementText', 0.6);
				break;
			case 'positionReset':
				sliders.current = '0';
				sliderUpdate('positionText', 1, 2.7);
				break;
			case 'incrementReset':
				sliders.current = '1';
				sliderUpdate('incrementText', 1, 40);
				break;
			default:
		}
		if(!target.id.startsWith('Servo')){
			target.style.fill = 'rgb(0, 0, 255)';
			setTimeout(_=> {IO = true; target.style.fill = colors[colors.current];}, 250);
		}
		IO = false;
	}
}

function  togglePlayStop(id) {
	var toggle;
	if(id == 'Stop'){toggle = 1; IO = true;}
	else if (id == 'Play'){toggle = 0;}
	else {
		var stop = document.getElementById("Play").style.opacity;
		toggle = stop == 0 ? 1 : 0;
		sliders[sliders.active][2] = toggle;
	}
	// styling - swap play/stop vectors + blue flash
	var below = document.getElementById(playStop[toggle]);
	below.style.opacity = 1;
	toggle = Math.abs(toggle-1);
	var above = document.getElementById(playStop[toggle]);
	above.style.opacity = 0;
	var parent = below.parentElement;
	parent.insertBefore(below, null);
	below.style.fill = 'rgb(0, 0, 255)';
	setTimeout(_=> {below.style.fill = 'rgb(0, 0, 0)';}, 250);
}

function  sliderUpdate(id, sign, reset) {
	elem = document.getElementById(id).children[0];
	if(reset){
		if(id.includes('position')){
			elem.innerHTML = 2.7;
			svgPos[sliders.active][0] = ["positionSlider", 0, 0];
		}else{
			svgPos[sliders.active][1] = ["incrementSlider", 0, 0];
			elem.innerHTML = 40;
		}
		loadSVGpos();
		sliders[sliders.active][sliders.current] = reset;
	} else {

	var value = parseFloat(elem.innerHTML);
	var upper, lower;

	if(Math.abs(sign) == 0.1){upper = 4.5; lower = 0.9;}
	else {upper = 70; lower = 10;}

	if(( sign < 0 && value > lower) || (sign > 0 && value < upper) ){
		value = (value+sign);
		if(Math.abs(sign) == 0.1){
			elem.innerHTML = value.toFixed(1);
			sliders[sliders.active][0] = value.toFixed(1);
		}
		else{
			elem.innerHTML = value.toFixed(0);
			sliders[sliders.active][1] = value.toFixed(0);
		}
		if(Math.abs(sign) == 0.1){
			moveSVG(elem.parentElement.id, Math.sign(sign)*4, 2);
			moveSVG(elem.parentElement.previousElementSibling.id, Math.sign(sign)*3, 1);
		}else{
			moveSVG(elem.parentElement.id, Math.sign(sign)*2.5, 2);
			moveSVG(elem.parentElement.previousElementSibling.id, Math.sign(sign)*1.8, 1);
		}
	}
	} //else
	setTimeout(_=> click = true, 10);
}

function  sliderMove(e) {
	e.preventDefault();
	if(click && sliders.current != null){
		click = false;
		if(e.type == 'touchmove'){
			e.clientX = e.touches[0].clientX;
		}
		if(sliderPosition.includes(e.target.id)){
			if(e.clientX < position()){
				sliderUpdate('positionText', -0.1);
			} else if(e.clientX > position()){
				sliderUpdate('positionText', 0.1);
			}
		} else if(sliderIncrement.includes(e.target.id)){
			if(e.clientX < position()){
				sliderUpdate('incrementText', -0.6);
			} else if(e.clientX > position()){
				sliderUpdate('incrementText', 0.6);
			}
		}
		function position(){
			var x = e.target.getBoundingClientRect().x;
			var width = e.target.getBoundingClientRect().width;
			var center = x+(width)/2;
			return center;
		}
	}
}

function  servoSwap(servo) {
	var elem = document.getElementById(servo);
	var col = elem.style.fill;
	if(!colors[servo]){colors[servo] = col;}
	for(item of colorSwap){
		document.getElementById(item).style.fill = col;
	}
	colors.current = servo;
	sliders.active = colors.current.slice(-1);
	for(var bar of servoBars){
		document.getElementById(bar).style.opacity = '0.2';
	}
	var currentBar = document.getElementById('Servo'+sliders.active+'b');
	currentBar.style.opacity = '1';
	currentBar.style.fill = 'rgb(0, 0, 255)';
	setTimeout(_=> {currentBar.style.fill = col;}, 250);
	// load slider values
	document.getElementById(sliderPosition[2]).innerHTML = sliders[sliders.active][0];
	document.getElementById(sliderIncrement[2]).innerHTML = sliders[sliders.active][1];
	loadSVGpos();
}

/* section III - client_AJAX.js */
function  ajaxSpit(msg) {
	const xhttp = new XMLHttpRequest();
	xhttp.open("GET","/msg?"+msg, true);
	xhttp.setRequestHeader('Content-Type', 'text/plain');
	xhttp.send();
}

function  ajaxGET(servo) {
	return new Promise((res, rej) => {
	obj={servo: servo};
	obj=JSON.stringify(obj);
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST","/pull", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState === 4){
			var status = xhttp.status;
			var json;
			if(status == 200){
				json = xhttp.responseText;
				json = JSON.parse(json);
				const val = json.values;
				sliders[sliders.active]=[val[0],val[1],val[2]];
				svgPos[sliders.active][0]=val[3];
				svgPos[sliders.active][1]=val[4];
				setTimeout(_=>res(), 200);
			}else if(status == 418){
				json = xhttp.responseText;
				rej();
			}
		}
	};
	xhttp.send(obj);
	});
}

function  ajaxPOST(servo, values) {
	IO = false; idle = false;
	return new Promise( (res, rej) => {
	if(sliders[sliders.active][2]){
		obj={servo: servo,
			 pos: values[0],
			 duration: values[1],
			 status: sliders[sliders.active][2],
			 posSlider: svgPos[sliders.active][0],
			 incSlider: svgPos[sliders.active][1]
		};
	} else {
		// update play/stop status
		obj={servo: servo, status: sliders[sliders.active][2]};
	}
	obj=JSON.stringify(obj);
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST","/push", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState === 4){
			var status = xhttp.status;
			var json;
			if(status == 200){
				json = xhttp.responseText;
				json = JSON.parse(json);
				idle = true;
				res();
			}else if(status == 418){
				json = xhttp.responseText;
				rej();
			}
		}
	};
	xhttp.send(obj);
	});
}

/* section IV - client_VECTORS.js */
function  loadSVG() {
	return new Promise((res, rej)=>{
		const xhttp = new XMLHttpRequest();
		xhttp.onload = function() {
			res(xhttp.responseText);
		};
		xhttp.open("GET", "SVG");
		xhttp.send();
	});
}

function  moveSVG(id, x, idx) {
	var elem = document.getElementById(id);
	var translation; var value;
	var str = elem.getAttribute("transform");
	if(str === null){str = '';}
	if(str.includes("translate")){
		var strPos = str.search("translate")+10;
		var XY = str.slice(strPos).split(',');
		value = (parseFloat(XY[0])+x);
		translation = str.slice(0,strPos)+value+','+XY[1];
	} else {
		value = x;
		translation = str.concat('translate('+value+','+0+')');
	}
	elem.setAttribute('transform', translation);
	svgPos[sliders.active][sliders.current][idx] = value;
}

function  loadSVGpos() {
	const sliderPos = svgPos[sliders.active][0];
	const sliderInc = svgPos[sliders.active][1];
	var i = 0;
	for(var slider of [sliderPos, sliderInc]){
		elem = document.getElementById(slider[0]);
		resetSVG(elem.id, slider[1], 0, i);
		//...Slider>...Text
		resetSVG(elem.id.slice(0,-6)+"Text", slider[2], 0, i);
		i += 1;
	}
	if(sliders[sliders.active][2] == 0){
		togglePlayStop('Stop');
	}else{togglePlayStop('Play');}
}

function  resetSVG(id, x, y, slider) {
	var elem = document.getElementById(id);
	var translation;
	var str = elem.getAttribute("transform");
	if(str === null){str = '';}
	if(str.includes("translate")){
		var strPos = str.search("translate");
		translation = str.slice(0,strPos);
		translation = translation.concat('translate('+x+','+y+')');
		elem.setAttribute('transform', translation);
	}else{
		translation = str.concat('translate('+x+','+y+')');
		elem.setAttribute('transform', translation);
	}
	if(id.includes("Slider")){
		svgPos[sliders.active][slider][1] = x;
	}else{
		svgPos[sliders.active][slider][2] = x;
	}
}

function  getServos() {
	return new Promise((res, rej)=>{
		const xhttp = new XMLHttpRequest();
		xhttp.onload = function() {
			res(xhttp.responseText);
		};
		xhttp.open("GET", "servos");
		xhttp.send();
	});
}

/* section V - EVENTS */
document.addEventListener("touchstart", button, {passive: false});
document.addEventListener("touchend", clearGlobals, {passive: false});
document.addEventListener("touchmove", sliderMove, {passive: false});

document.addEventListener("mousedown", button);
document.addEventListener("mouseup", clearGlobals);
document.addEventListener("mousemove", sliderMove);

// prevent text selection
document.addEventListener("selectstart", e => e.preventDefault());

window.onload = (event) => {
	loadSVG()
	.then(svg => {
		document.getElementById('svg').innerHTML = svg;
		idArrays();
		colors();
		document.getElementById('Play').style.opacity = 0;
		document.getElementById('Stop').style.opacity = 0.6;
		getServos()
		.then( servoList => {
			servoList = JSON.parse(servoList);
			for(var i=0; i<4; i++){
				var label = document.getElementById(window.servos[i+4]);
				label.children[0].textContent = servoList[i][1];
				document.getElementById(window.servoText[i]).style.pointerEvents = "NONE";
			}
		});
	});
};