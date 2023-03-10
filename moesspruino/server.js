// george.kiwi - 22/08/2022
// server @ stackoverflow.com/questions/6084360

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const open = require('open');

const baseDirectory = __dirname + "\\webIDE";
const port = 8080;

const server = http.createServer(function (request, response) {
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, GET',
		'Access-Control-Max-Age': 2592000,
	};
    try {
        const requestUrl = url.parse(request.url);
        const fsPath = baseDirectory+path.normalize(requestUrl.pathname);
		
        const fileStream = fs.createReadStream(fsPath);
        fileStream.pipe(response);
        fileStream.on('open', function() {
             response.writeHead(200, headers);
        });
        fileStream.on('error',function(e) {
             response.writeHead(404);
             response.end();
        });
    } catch(err) {
        response.writeHead(500);
        response.end(); 
        console.log(err);
    };
});

server.listen(port);

const promise = new Promise((res, rej) => {
	const loop = () => server.listening == true ? res(server.listening) : setTimeout(loop)
	loop();
});

promise.then((serverState) => {
	console.log("listen="+serverState, "running@ localhost:"+port);
	open('http://localhost:8080/index.html', {app: 'msedge'}); //chrome
});