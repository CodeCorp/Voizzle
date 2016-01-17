var socket = io();

socket.on('initial connection', function(data) {
	setHighlightColor(data.colorCode);

	newGame(data.puzzleArray);

	animateTimer(data.timer.height, data.timer.millis);

	data.words.forEach(function(currentWord) {
		spokenWords.push(currentWord);
		searchWord(currentWord.word, currentWord.highlightColor);
	});
});

socket.on('spoken word', function(data) {
	searchWord(data.word, data.highlightColor);
});

function socketNewGame(puzzleNumber) {
	socket.emit('new game', {'puzzleNumber': puzzleNumber});
}

socket.on('new game', function(data) {
	newGame(data.puzzleArray);
	animateTimer(data.timer.height, data.timer.millis);
});