var app = require('express')();
var https = require('https');
var io = require('socket.io')();
var fs = require('fs');
var url = require('url');
var path = require('path');

const credentials = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem')
};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(4000, function() {
	console.log('listening on *:4000');
});

io.listen(httpsServer);

app.get('/', function(req, res){
	// res.send('<h1>Hello World</h1>');
	res.sendFile(__dirname + '/index.html');
});

app.get(/\/(style|js)\/*/, function(req, res) {
	var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
	var parsedURL = url.parse(fullURL);
	res.sendFile(__dirname + parsedURL.pathname);
});

var playerCount = 1;
var players = {};
var words = [];

io.on('connection', function(socket) {
	var address = socket.request.connection.remoteAddress;
	if(!players[address]) {
		players[address] = playerCount++;
		console.log('Player #' + players[address] + ' added with ip ' + address);
	}

	socket.emit('initial connection', {'colorCode' : players[address], 'words': words});

	socket.on('spoken word', function(data) {
		if(data.inGrid) {
			words.push(data);
			io.emit('spoken word', data);
		}
	});
});