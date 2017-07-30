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
		
		if (evaluateRows() || evaluateColumns()) {
			hasWon = true;
		}
		
		if (hasWon) {
			alert("You've won!");
		}
		// evaluateColumns();
		// evaluateDiagonals();
	});
	
	function addMark(caller) {
		var $checkmarkImg = $(caller).find('img');
		$checkmarkImg.toggle();
		$checkmarkImg.parent('td').toggleClass('checked');
	}
	
	function evaluateRows() {
		var $bingoGrid = $('#bingoCard').find('.table');
		var $rows = $bingoGrid.find('> tbody > tr');
		console.log($rows);
		console.log('$Rows length: ' + $rows.length);
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
			console.log($($squares[i]));
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
		var hasWon = false;
		
		// Create columns
		for (var i = 0; i < $rows.length; i++) {
			var $squares = $($rows[i]).find('td');
			
			for (var j = 0; j < $squares.length; j++) {
				$columns[j].push($squares[j]);
			}
		}
		
		for (var i = 0; i < $columns.length; i++) {
			if (isWinningColumn($columns[i])) {
				hasWon = true;
			}
		}
		return hasWon;
	}
	
	function isWinningColumn(column) {
		var winningColumn = true;
		
		for (var i = 0; i < column.length; i++) {
			if (!$(column[i]).hasClass('checked')) {
				winningColumn = false;
			}
		}
		console.log(winningColumn);
		return winningColumn;
	}
	
	
});