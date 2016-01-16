var PUZZLE_SIZE = 10;
var PUZZLE_ROWS = [];
PUZZLE_ROWS[0] = "QWERTYUIOP";
PUZZLE_ROWS[1] = "DUCK567890";
PUZZLE_ROWS[2] = "READP67890";
PUZZLE_ROWS[3] = "1234O67890";
PUZZLE_ROWS[4] = "1234W67890";
PUZZLE_ROWS[5] = "1234E67890";
PUZZLE_ROWS[6] = "1234R67890";
PUZZLE_ROWS[7] = "1234567890";
PUZZLE_ROWS[8] = "1234567890";
PUZZLE_ROWS[9] = "1234567890";
var PUZZLE_COLUMNS = [];
var MINIMUM_WORD_LENGTH = 3;
var myHighlightColor;
var spokenWords = [];

function drawBoard(){
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		for (var j = 0; j < PUZZLE_SIZE; j++) {
			$("#puzzle-wrapper").append("<div id='"+i+"-"+j+"' class='pixel'><p class='puzzle-char'>"+PUZZLE_ROWS[i][j]+"</p></div>");
		};
	};
}

function generateColumns(argument) {
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		temp="";
		for (var j = 0; j < PUZZLE_SIZE; j++) {
			temp+=PUZZLE_ROWS[j][i];
		};
		PUZZLE_COLUMNS[i] = temp;
	};
}

function searchWord(word, highlightColor) {
	if(spokenWords.indexOf(word) > -1) return false;
	if(word.length < MINIMUM_WORD_LENGTH) return false; 
	if(rowSearch(word, highlightColor) || columnSearch(word, highlightColor)) {
		spokenWords.push(word);
		return true;
	}
}


function rowSearch(word, highlightColor) {
	var start_index;
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		start_index = PUZZLE_ROWS[i].indexOf(word);
		if (start_index>-1) {
			for (var j = 0; j < word.length; j++) {
				$("#"+i+"-"+(j+start_index)).addClass(highlightColor);
			};
			return true;
		};
	};
	return false;	
}

function columnSearch(word, highlightColor) {
	var start_index;
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		start_index = PUZZLE_COLUMNS[i].indexOf(word);
		if (start_index>-1) {
			for (var j = 0; j < word.length; j++) {
				$("#"+(j+start_index)+"-"+i).addClass(highlightColor);
			};
			return true;
		};
	};
	return false;
}

function scoreUpdate(player1Score,player2Score) {
	// body...
}

function setHighlightColor(playerNo){
	myHighlightColor = "highlight-" + playerNo;
}


$( document ).ready(function() {
	drawBoard();
	generateColumns();
});

//--------------------------------------------------------
var finalTextMessage = '';
var isRecognizing = false;

if ('webkitSpeechRecognition' in window) {

	var recognition = new webkitSpeechRecognition();

	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() {
		isRecognizing = true;
	};

	recognition.onerror = function(event) {
		console.log(event.error);
	};

	recognition.onend = function() {
		isRecognizing = false;
	};

	recognition.onresult = function(event) {
		var interimText = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				finalTextMessage = event.results[i][0].transcript.toUpperCase().trim();				
				socket.emit('spoken word', {'word': finalTextMessage,
					'highlightColor': myHighlightColor,
					'inGrid': searchWord(finalTextMessage, myHighlightColor)
					});
				document.getElementById('voice-input').value = finalTextMessage;
				interimText = '';
			} else {
				interimText = event.results[i][0].transcript;
			}
			document.getElementById('interim').innerHTML = interimText;
		}
	};
}

function toggleDictation(event) {
	if (isRecognizing) {
		recognition.stop();
		return;
	}
	finalTextMessage = '';
	recognition.lang = 'en-IN';
	recognition.start();
}
