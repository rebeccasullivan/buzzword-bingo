$(document).ready(function() {
	fillFreeSquare();

	function fillFreeSquare() {
		var $bingoGrid = $('#bingoCard');
		var $middleRow = $bingoGrid.find('.row:nth-child(3)');
		var $middleSpace = $middleRow.find('.square:nth-child(3)');
		$middleSpace.addClass('checked');
		var $middleDiv = $middleSpace.find('.table-cell div');
		$middleDiv.html("FREE!");

		var $checkmarkImg = $middleSpace.find('img');
		$checkmarkImg.toggle();
		$checkmarkImg.css("display", "inherit");
	}

	$('.square').click(function() {
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

		console.log('checkmark css: ' + $checkmarkImg.css('display'))

		if ($checkmarkImg.css('display') != 'none') {
			console.log('in display:inherit block')
			$checkmarkImg.css("display", "none");
		} else {
			console.log('in else block')
			$checkmarkImg.css("display", "inherit");
		}
		$checkmarkImg.parent().parent().toggleClass('checked');
	}

	function evaluateRows() {
		var $bingoCard = $('#bingoCard');
		var $rows = $bingoCard.find('> .row');
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
		var $squares = $(row).find('.square');
		var winningRow = true;

		for (var i = 0; i < $squares.length; i++) {
			if (!$($squares[i]).hasClass('checked')) {
				winningRow = false;
			}
		}
		return winningRow;
	}

	function evaluateColumns() {
		var $bingoCard = $('#bingoCard');
		var $rows = $bingoCard.find('.row');
		var $columns = [[], [], [], [], []];
		var hasWinningColumn = false;

		// Create columns
		for (var i = 0; i < $rows.length; i++) {
			var $squares = $($rows[i]).find('.square');

			for (var j = 0; j < $squares.length; j++) {
				$columns[j].push($squares[j]);
			}
		}

		for (var i = 0; i < $columns.length; i++) {
			if (isWinningArray($columns[i])) {
				hasWinningColumn = true;
			}
		}
		console.log('isWinningColumn = ' + hasWinningColumn);
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
		var $bingoCard = $('#bingoCard');
		var $rows = $bingoCard.find('.row');

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
			var $squares = $(rows[i]).find('.square');
			upperLeftDiag.push($squares[j]);
		}
		return upperLeftDiag;
	}

	function createUpperRightDiag(rows) {
		var upperRightDiag = [];

		// Start from lower left corner
		for (var i = rows.length - 1, j = 0; i >= 0; i--, j++) {
			var $squares = $(rows[i]).find('.square');
			upperRightDiag.push($squares[j]);
		}
		return upperRightDiag;
	}
});
