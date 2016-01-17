var app = require('express')();
var https = require('https');
var io = require('socket.io')();
var fs = require('fs');
var url = require('url');
var path = require('path');
var puzzles = require('./puzzles.js');

const credentials = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem')
};

var httpsServer = https.createServer(credentials, app);

app.get('/', function(req, res){
	// res.send('<h1>Hello World</h1>');
	res.sendFile(__dirname + '/index.html');
});

app.get(/\/(style|js|resources)\/*/, function(req, res) {
	var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
	var parsedURL = url.parse(fullURL);
	res.sendFile(__dirname + parsedURL.pathname);
});

var playerCount = 1;
var players = {};
var words = [];
var currentPuzzle = puzzles.puzzle1;
var curentGameTimeLeft;
var maxTime = 60 * 1000;
var lagAllowed = 300;
var currentGameInterval;

function startNewGame(puzzleNumber) {
	words = [];
	currentPuzzle = puzzles.allPuzzles[puzzleNumber];
	io.emit('new game', {
		puzzleArray: currentPuzzle,
		timer: (function() {
			curentGameStartTime = Date.now();
			return {
				'height': 100,
				'millis': maxTime
			};
		})()
	});

	clearInterval(currentGameInterval);
	currentGameInterval = setInterval(function() {
		io.emit('stop current game', {});
		clearInterval(currentGameInterval);
	}, maxTime + lagAllowed);
}

io.on('connection', function(socket) {
	var address = socket.request.connection.remoteAddress;
	if(!players[address]) {
		players[address] = playerCount++;
		console.log('Player #' + players[address] + ' added with ip ' + address);
	}

	socket.emit('initial connection', (function() {
		var timeLeft = curentGameStartTime + maxTime - Date.now();
		if(timeLeft < 0) timeLeft = 0;
		var height = timeLeft * 100 / maxTime;
		return {
			'colorCode' : players[address],
			'words': words,
			'puzzleArray': currentPuzzle,
			'timer': {
				'height': height,
				'millis': timeLeft
			}
		}
	})()
	);

	socket.on('spoken word', function(data) {
		if(data.inGrid) {
			words.push(data);
			io.emit('spoken word', data);
		}
	});

	socket.on('new game', function(data) {
		if(data.puzzleNumber && data.puzzleNumber < puzzles.numberOfPuzzles) {
			startNewGame(data.puzzleNumber);
		} 
		else {
			startNewGame(0);
		}
	});
});

httpsServer.listen(4000, function() {
	console.log('listening on *:4000');
	// start a new game as soon as the server starts
	startNewGame(0); 
});

io.listen(httpsServer);