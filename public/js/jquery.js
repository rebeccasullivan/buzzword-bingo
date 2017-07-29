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
		
		if (evaluateRows()) {
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
	
	
});