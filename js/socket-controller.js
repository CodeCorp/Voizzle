var socket = io();

socket.on('initial connection', function(data) {
	setHighlightColor(data.colorCode);

	data.words.forEach(function(currentWord) {
		spokenWords.push(currentWord);
		searchWord(currentWord.word, currentWord.highlightColor);
	});
});

socket.on('spoken word', function(data) {
	searchWord(data.word, data.highlightColor);
});