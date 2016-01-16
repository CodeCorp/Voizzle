var socket = io();

socket.on('initial connection', function(data) {
	setHighlightColor(data.colorCode);
});

socket.on('spoken word', function(data) {
	searchWord(data.word, data.highlightColor);
});