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
		evaluateRows();
		// evaluateColumns();
		// evaluateDiagonals();
	});
	
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
	
	function evaluateRow($row) {
		// Return a bool of whether all 5 are checked
		var $squares = $row.find('> td');
		console.log($squares);
	}
	
	
});