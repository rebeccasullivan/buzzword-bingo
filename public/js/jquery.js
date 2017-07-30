$(document).ready(function() {
	fillFreeSquare();

	function fillFreeSquare() {
		var $bingoGrid = $('#bingoCard').find('.table');
		var $middleRow = $bingoGrid.find('tr:nth-child(3)');
		var $middleSpace = $middleRow.find('td:nth-child(3)');
		$middleSpace.addClass('checked');
		var $middleDiv = $middleSpace.find('div');
		$middleDiv.html("FREE!");
		
		var $checkmarkImg = $middleSpace.find('img');
		$checkmarkImg.toggle();
	}
	
	$('.bingoSquare').click(function() {
		addMark(this);
		
		var hasWon = false;
		
		if (evaluateRows() || evaluateColumns() || evaluateDiagonals()) {
			hasWon = true;
		}
		
		if (hasWon) {
			alert("You've won!");
		}
	});
	
	function addMark(caller) {
		var $checkmarkImg = $(caller).find('img');
		$checkmarkImg.toggle();
		$checkmarkImg.parent('td').toggleClass('checked');
	}
	
	function evaluateRows() {
		var $bingoGrid = $('#bingoCard').find('.table');
		var $rows = $bingoGrid.find('> tbody > tr');
		var hasWon = false;
		
		for (var i = 0; i < $rows.length; i++) {
			if (isWinningRow($rows[i])) {
				hasWon = true;
			}
		}
		return hasWon;
	}
	
	function isWinningRow(row) {
		// Determines whether all 5 squares in row are checked
		var $squares = $(row).find('td');
		var winningRow = true;
		
		for (var i = 0; i < $squares.length; i++) {
			if (!$($squares[i]).hasClass('checked')) {
				winningRow = false;
			}
		}
		return winningRow;
	}
	
	function evaluateColumns() {
		var $bingoGrid = $('#bingoCard').find('.table');
		var $rows = $bingoGrid.find('> tbody > tr');
		var $columns = [[], [], [], [], []];
		var hasWinningColumn = false;
		
		// Create columns
		for (var i = 0; i < $rows.length; i++) {
			var $squares = $($rows[i]).find('td');
			
			for (var j = 0; j < $squares.length; j++) {
				$columns[j].push($squares[j]);
			}
		}
		
		for (var i = 0; i < $columns.length; i++) {
			if (isWinningArray($columns[i])) {
				hasWinningColumn = true;
			}
		}
		return hasWinningColumn;
	}
	
	function isWinningArray(array) {
		var isWinningArray = true;
		
		for (var i = 0; i < array.length; i++) {
			if (!$(array[i]).hasClass('checked')) {
				isWinningArray = false;
			}
		}
		return isWinningArray;
	}
	
	function evaluateDiagonals() {
		// Select bingo grid
		var $bingoGrid = $('#bingoCard').find('.table');
		var $rows = $bingoGrid.find('> tbody > tr');
		
		// Create diagonal arrays
		var upperLeftDiag = createUpperLeftDiag($rows);
		var upperRightDiag = createUpperRightDiag($rows);
		var hasWinningDiagonal = false;
		
		// Determine whether diagonals have all checked boxes
		if (isWinningArray(upperLeftDiag) || isWinningArray(upperRightDiag)) {
			hasWinningDiagonal = true;
		}
		return hasWinningDiagonal;
	}
	
	function createUpperLeftDiag(rows) {
		var upperLeftDiag = [];
		for (var i = 0, j = 0; i < rows.length; i++, j++) {
			var $squares = $(rows[i]).find('td');
			upperLeftDiag.push($squares[j]);
		}
		return upperLeftDiag;
	}
	
	function createUpperRightDiag(rows) {
		var upperRightDiag = [];
		
		// Start from lower left corner 
		for (var i = rows.length - 1, j = 0; i >= 0; i--, j++) {
			var $squares = $(rows[i]).find('td');
			upperRightDiag.push($squares[j]);
		}
		return upperRightDiag;
	}
});