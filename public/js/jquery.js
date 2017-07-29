$(document).ready(function() {
	fillFreeSquare();

	function fillFreeSquare() {
		var $bingoGrid = $('#bingoCard').find('.table');
		var $middleRow = $bingoGrid.find('tr:nth-child(3)');
		var $middleSpace = $middleRow.find('td:nth-child(3)');
		var $middleDiv = $middleSpace.find('div');
		$middleDiv.html("FREE!");
		$middleDiv.addClass()
		
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
		$checkmarkImg.parent('td').addClass('checked');
	}
	
	function evaluateRows() {
		var $bingoGrid = $('#bingoCard').find('.table');
		var $rows = $bingoGrid.find('> tbody > tr');
		var hasWon = false;
		
		for (i = 0; i < $rows.length; i++) {
			if(evaluateRow($rows[i])) {
				hasWon = true;
			}
		}
		return hasWon;
	}
	
	function evaluateRow(row) {
		// Return a bool of whether all 5 are checked
		var $squares = $(row).find('td');
		var winningRow = true;
		
		for (i = 0; i < $squares.length; i++) {
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
		for (i = 0; i < $rows.length; i++) {
			var $squares = $($rows[i]).find('td');
			
			for (j = 0; j < $squares.length; j++) {
				$columns[j].push($squares[j]);
			}
		}
		
		for (i = 0; i < $columns.length; i++) {
			if (evaluateColumn($columns[i])) {
				hasWon = true;
			}
		}
		return hasWon;
	}
	
	function evaluateColumn(column) {
		var winningColumn = true;
		
		for (i = 0; i < column.length; i++) {
			if (!$(column[i]).hasClass('checked')) {
				winningColumn = false;
			}
		}
		console.log(winningColumn);
		return winningColumn;
	}
	
	
});