function _connect(c){var a=Object.assign({},_Servo);for(var b in c)a[b]=c[b];return global.servos==undefined?(global.servos=[],a.device='servo0'):a.device='servo'+global.servos.length,global.servos.push(a),a}function _setup(c){var a=0;for(var b of c)global['servo'+a]=_connect({pin:NodeMCU[b]}),global['servo'+a].id=a,a++;global.sleep=_sleepAll,global.wake=_wakeAll,global.calibrate=_calibrateAll,global.stop=_stop,global.pause=_pause}function _pause(a){return new Promise((b,c)=>{setTimeout(c=>{global.servos[0].msg('pause: '+a,1),b()},a)})}function _stop(){clearInterval();for(var a of servos)global[a.device]=null;setTimeout(a=>{global.servos=null,log('+ servos nullified +')},200)}function _sleepAll(){return new Promise(d=>{var a=[],b;for(var c of global.servos)b=c.sleep(),a.push(b);Promise.all(a).then(a=>(log('all asleep'),d('done')))})}function _wakeAll(){return new Promise(d=>{var a=[],b;for(var c of global.servos)b=c.wake(),a.push(b);Promise.all(a).then(a=>(log('all awake'),d('done')))})}function _calibrateAll(a,b){return new Promise(e=>{var b=[],c;for(var d of global.servos)c=d.calibrate(a),b.push(c);Promise.all(b).then(b=>(log('all calibrated('+a+')'),e('done')))})}function _checkStatus(a,b){return new Promise(e=>{var c=[];if(a!=null)c.push(a[b]);else if(a==null)for(var d of global.servos)c.push(d[b]);e(c)})}function stepper(a,b,c,d,e){var f=function(a){a.emit('stepper'),a.removeAllListeners('stepper')};a.alive===!0&&b.toFixed(2)!==c.toFixed(2)?setTimeout(f=>{a.position=b,a.msg('step',0,a),b+=e*a.increment,stepper(a,b,c,d,e)},d):(a.position=c,f(a))}var move=['m','move',0,undefined],pulse=['p','pulse',1];global.log=function(){};var _Servo={id:null,pin:null,position:2.7,duration:40,increment:.01,wait:20,steps:undefined,verbose:!1,interval:null,alive:!1,timeout:500,idle:!0};_Servo.msg=function(b,c,a){(this.verbose||c)&&(a||(a=this),log(a.device+'  '+b+'  '+a.position))},_Servo.calibrate=function(a){return new Promise(b=>{pulse.includes(a)?this.pulse(2.7).then(a=>{this.msg('calibrate(p)',1),b()}):move.includes(a)&&this.move(2.7,10).then(a=>{this.msg('calibrate(m)',1),b(a)})})},_Servo.pulse=function(a){return new Promise(c=>{this.position=a;var b=function(a){setTimeout(b=>{a.msg('pulse',1),c()},a.timeout)};this.alive==0?this.wake().then(a=>b(this)):b(this)})},_Servo.wake=function(){return new Promise((a,b)=>{this.alive==0?(this.interval=setInterval(a=>{digitalPulse(this.pin,HIGH,E.clip(this.position,.5,4.5))},20),this.alive=!0,setTimeout(()=>{this.msg('wake',1),a()},this.timeout)):b()})},_Servo.sleep=function(){return new Promise(a=>{clearInterval(this.interval),this.alive=!1,setTimeout(()=>{this.msg('sleep',1),a()},this.timeout)})},_Servo.movePromise=function(b,d,c){this.idle=!1;var a=Math.round((d-b)/this.increment);return new Promise(f=>{var e=function(e){e.msg('move('+b+'>'+d+'/'+c+')',1),e.on('stepper',a=>{setTimeout(a=>{e.idle=!0,e.msg('move_complete'),f('moved')},e.timeout)}),stepper(e,b,d,c,a/Math.abs(a)),e.msg('step-duration: '+c+', steps :'+a+', TimeOut: '+Math.abs(c*a)+'ms')};this.alive==0?(this.position=b,this.wake().then(a=>e(this))):e(this)})},_Servo.move=function(){var b,c,d,a=arguments;a.length==1?a[0]>=.9&&a[0]<=4.5?(b=this.position,c=a[0],d=this.duration,this.movePromise(b,c,d)):this.msg('out-of-bounds (stop)'):a.length==2?a[0]>=.9&&a[0]<=4.5&&a[1]>=1&&a[1]<=4.5?(b=a[0],c=a[1],d=this.duration,this.movePromise(b,c,d)):a[0]>=.9&&a[0]<=4.5&&a[1]>=10?(c=a[0],d=a[1],b=this.position,this.movePromise(b,c,d)):this.msg('out-of-bounds (start/stop | stop/duration)'):a.length==3&&a[2]>=10&&a[0]>=.9&&a[0]<=4.5&&a[1]>=1&&a[1]<=4.5?(b=a[0],c=a[1],d=a[2],this.movePromise(b,c,d)):this.msg('out-of-bounds (start | stop | duration)')};var exports={connect:function(a){return _connect(a)},setup:function(a){return _setup(a)},status:function(a,b){return _checkStatus(a,b)},stop:function(){return _stop()}}