var PUZZLE_SIZE = 10;
var PUZZLE_ROWS = [];
var PUZZLE_COLUMNS = [];
var MINIMUM_WORD_LENGTH = 3;
var myHighlightColor;
var spokenWords = [];
var score1=0, score2=0;
var TIME = 100;
var gameOver;

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
	if(gameOver) return false;
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
	gameOver = true;

	var text1 = 'GREEN'
	var text2 = 'WINS!';
	var winnerClass = "highlight-2";

	if (score1>score2) {
		text1 = 'YELLOW';
		winnerClass = 'highlight-1';
	}
	else if(score1==score2) {
		text1 = "IT'S A";
		text2 = "DRAW!"
		winnerClass = "highlight";
	}

	$('#voice-input').val("");
	$('#interim').val("---");
	$('#voice-input').prop('disabled', true);
	$('#mic').prop('disabled', true);
	if (isRecognizing) {
		toggleDictation();
	}
	$('#winner-declaration #line-1').html(text1);
	$('#winner-declaration #line-2').html(text2);
	// alert(text+ " !!\nPress New Game to continue playing");
	$('#timer').stop();
	$('#timer-div').addClass(winnerClass);
	$('#winner-declaration').show();
}

// function startTimer(){

// 	var heightDecreasedPerSec = 595/TIME;

// 	var temp = setInterval(function(){
// 		var presentHeight = $('#timer').height();
// 		console.log(presentHeight);
// 		if (presentHeight>10) {
// 			$('#timer').height(presentHeight-heightDecreasedPerSec);
// 		}
// 		else{
// 			$('#timer').height(0);
// 			declareWinner();
// 			clearInterval(temp);
// 		}
// 	},1000);

// }


function animateTimer(height, millis) {
	$('#timer').stop().height(height + "%");
	$('#timer').animate({
		'height': '0%'
	}, millis, "linear");
}

function newGame(puzzleArray) {
	scoreUpdate(0,0);
	spokenWords = [];
	score1=0
	score2=0;
	$("#puzzle-wrapper").html("");
	$("#logs").html("");
	$("#timer-div").removeClass();
	setPuzzleRows(puzzleArray);
	drawBoard();
	generateColumns();
	$('#voice-input').prop('disabled', false);
	$('#mic').prop('disabled', false);
	$('#winner-declaration').hide();
	gameOver=false;
	// $('#timer').height(593);
	// startTimer();
}


$( document ).ready(function() {
	// newGame();
	$('#new-game-btn').on('click', function() {
		var puzzleNumber = Number($('#game-no').val());
		socketNewGame(puzzleNumber);
	});
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
			if (event.results[i].isFinal && !gameOver) {
				event.results[i][0].transcript.toUpperCase().trim().split(' ').forEach(function(currentWord) {
					finalTextMessage = currentWord;
					socket.emit('spoken word', {'word': finalTextMessage,
						'highlightColor': myHighlightColor,
						'inGrid': searchWord(finalTextMessage, myHighlightColor)
					});
					document.getElementById('voice-input').value = finalTextMessage;
				});
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
