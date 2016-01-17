var PUZZLE_SIZE = 10;
var PUZZLE_ROWS = [];
PUZZLE_ROWS[0] = "QWERTYIOPU";
PUZZLE_ROWS[1] = "DUCKINGHEN";
PUZZLE_ROWS[2] = "OPULKITEFA";
PUZZLE_ROWS[3] = "GATELFGLAU";
PUZZLE_ROWS[4] = "RNCDIHOLNG";
PUZZLE_ROWS[5] = "OTJYOZWOMH";
PUZZLE_ROWS[6] = "HKHINHLKOT";
PUZZLE_ROWS[7] = "ALMYELLOWY";
PUZZLE_ROWS[8] = "NNQPDEFSTI";
PUZZLE_ROWS[9] = "BSLJDHUOSK";
var PUZZLE_COLUMNS = [];
var MINIMUM_WORD_LENGTH = 3;
var myHighlightColor;
var spokenWords = [];
var score1=0, score2=0;

function setPuzzleRows(puzzleArray) {
	PUZZLE_ROWS = puzzleArray;
};

function drawBoard(){
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		for (var j = 0; j < PUZZLE_SIZE; j++) {
			$("#puzzle-wrapper").append("<div id='"+i+"-"+j+"' class='pixel'><p class='puzzle-char'>"+PUZZLE_ROWS[i][j]+"</p></div>");
		};
	};

	setCurrentPlayer();
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
	var playerNo = highlightColor[highlightColor.length-1];
	var newLogButton = $("<button type='button' class='btn log-button'>"+word+"</button>");
	if(spokenWords.indexOf(word) > -1) return false;
	if(word.length < MINIMUM_WORD_LENGTH) return false; 
	if(rowSearch(word, highlightColor) || columnSearch(word, highlightColor)) {
		spokenWords.push(word);
		switch(playerNo){
			case '1':scoreUpdate(++score1,score2); break;
			case '2':scoreUpdate(score1,++score2);break;
		}

		$('#logs').append(newLogButton.addClass(highlightColor));
		return true;
	}
}


function rowSearch(word, highlightColor) {
	var start_index;
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		start_index = PUZZLE_ROWS[i].indexOf(word);
		if (start_index>-1) {
			for (var j = 0; j < word.length; j++) {
				$("#"+i+"-"+(j+start_index)).removeClass().addClass(highlightColor).addClass('pixel');
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
				$("#"+(j+start_index)+"-"+i).removeClass().addClass(highlightColor).addClass('pixel');
			};
			return true;
		};
	};
	return false;
}

function scoreUpdate(player1Score,player2Score) {
	$('#score-1').html(player1Score);
	$('#score-2').html(player2Score);
}

function setHighlightColor(playerNo){
	myHighlightColor = "highlight-" + playerNo;
	setCurrentPlayer(playerNo);
}

function setCurrentPlayer(player){
		$('#score-wrapper-'+player).addClass('score-wrapper-highlight');
}

function declareWinner(){
	var text = 'Green wins';
	if (score1>score2){text = 'Yellow wins'}
	else if(score1==score2){text = 'Its a draw'}
	$('#voice-input').val("");
	$('#interim').val("---");
	$('#voice-input').prop('disabled', true);
	$('#mic').prop('disabled', true);
	if (isRecognizing) {
		toggleDictation();
	}
	alert(text+ " !!\nPress New Game to continue playing")
	
}

function newGame(puzzleArray) {
	scoreUpdate(0,0);
	spokenWords = [];
	score1=0
	score2=0;
	$("#puzzle-wrapper").html("");
	$("#logs").html("");
	setPuzzleRows(puzzleArray);
	drawBoard();
	generateColumns();
	$('#voice-input').prop('disabled', false);
	$('#mic').prop('disabled', false);
}

$( document ).ready(function() {
	// newGame();
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
		$('#voice-input').css('background-image', 'url(../resources/mic.gif)');
	};

	recognition.onerror = function(event) {
		console.log(event.error);
	};

	recognition.onend = function() {
		isRecognizing = false;
		$('#voice-input').css('background-image', 'url(../resources/mic.png)');
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
