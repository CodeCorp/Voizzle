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

$( document ).ready(function() {
	drawBoard();
});
