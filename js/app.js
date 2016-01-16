var PUZZLE_SIZE = 10;
var PUZZLE_ROWS = [];
	PUZZLE_ROWS[0] = "QWERTYUIOP";
	PUZZLE_ROWS[1] = "1234567890";
	PUZZLE_ROWS[2] = "1234567890";
	PUZZLE_ROWS[3] = "1234567890";
	PUZZLE_ROWS[4] = "1234567890";
	PUZZLE_ROWS[5] = "1234567890";
	PUZZLE_ROWS[6] = "1234567890";
	PUZZLE_ROWS[7] = "1234567890";
	PUZZLE_ROWS[8] = "1234567890";
	PUZZLE_ROWS[9] = "1234567890";
var PUZZLE_COLUMNS = []

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

function searchWord(word) {
	generateColumns();
	rowSearch(word);
	columnSearch(word);
}


function rowSearch(word) {
	var start_index;
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		start_index = PUZZLE_ROWS[i].indexOf(word);
		if (start_index>-1) {
			for (var j = 0; j < word.length; j++) {
				$("#"+i+"-"+(j+start_index)).css('background','yellow');
			};
		break;
		};
	};	
}

function columnSearch(word) {
	var start_index;
	for (var i = 0; i < PUZZLE_SIZE; i++) {
		start_index = PUZZLE_COLUMNS[i].indexOf(word);
		if (start_index>-1) {
			for (var j = 0; j < word.length; j++) {
				$("#"+(j+start_index)+"-"+i).css('background','yellow');
			};
		break;
		};
	};	
}


$( document ).ready(function() {
	drawBoard();
	searchWord("1111");
});
