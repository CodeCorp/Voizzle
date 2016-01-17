var socket = io();

socket.on('initial connection', function(data) {
	setHighlightColor(data.colorCode);

	newGame(data.puzzleArray);

	data.words.forEach(function(currentWord) {
		spokenWords.push(currentWord);
		searchWord(currentWord.word, currentWord.highlightColor);
	});
});

socket.on('spoken word', function(data) {
	searchWord(data.word, data.highlightColor);
});

function socketNewGame() {
	socket.emit('new game', {});
}

socket.on('new game', function(data) {
	newGame(data.puzzleArray);
});