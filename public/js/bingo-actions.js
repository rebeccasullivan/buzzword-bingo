$(document).ready(function() {

	fillFreeSquare();

	function fillFreeSquare() {
		var $bingoGrid = $('.bingoCard');
		var $middleRow = $bingoGrid.find('.row:nth-child(3)');
		var $middleSpace = $middleRow.find('.square:nth-child(3)');
		$middleSpace.addClass('checked');
		var $middleDiv = $middleSpace.find('.table-cell div');
		$middleDiv.html("FREE!");

		var $checkmarkImg = $middleSpace.find('img');
		$checkmarkImg.toggle();
		$checkmarkImg.css("display", "inherit");
	}

	function checkBuzzwordCount() {
		var numBuzzwords = $('#buzzwords option').length;
		console.log(numBuzzwords);
		if (numBuzzwords < 30) {
			$('#generateCardBtn').hide();
		} else {
			$('#generateCardBtn').show();
		}
	}

	Handlebars.registerHelper('grouped_each', function(every, context, options) {
	    var out = "", subcontext = [], i;
	    if (context && context.length > 0) {
	        for (i = 0; i < context.length; i++) {
	            if (i > 0 && i % every === 0) {
	                out += options.fn(subcontext)
	                subcontext = []
	            }
	            subcontext.push(context[i])
	        }
	        out += options.fn(subcontext)
	    }
	    return out
	});

	$('#generateCardBtn').click(function() {
		// Generate card!
		var buzzwords = [];

		$("#buzzwords option").each(function() {
			buzzwords.push(this.innerText);
		});
		console.log('buzzwords before shuffle: ' + buzzwords)

		// Shuffle buzzwords
		buzzwords.sort(function() { return 0.5 - Math.random() });
		buzzwords = buzzwords.slice(0, 25);

		// Compile template for bingo card and add buzzwords from list
		var template = $('#bingoCardTemplate').html();
		var compiledTemplate = Handlebars.compile(template);
		var testHtml = compiledTemplate({buzzwords: buzzwords});
		$('#customBingoCard').html(testHtml);
		fillFreeSquare();
	});

	$('#addBuzzwords').click(function() {
		var numBuzzwords = $('#numAdditionalBuzzwords option:selected').val();
		console.log('numBuzzwords: ' + numBuzzwords);

		$.ajax({
			url: "/buzzwords?number=" + numBuzzwords,
			success: function(result) {
				// Add results to select box
				result.forEach(function(buzzword) {
					var text = buzzword.square_text;
					$('#buzzwords').append('<option> ' + text + '</option>');
				})
				checkBuzzwordCount();
			}
		});
	});

  $('#buzzwordSubmit').click(function() {
			if ($('#addBuzzword').val().length > 0) {
				$('#buzzwords').append('<option> ' + $('#addBuzzword').val() + '</option>');
			}
			checkBuzzwordCount();
	});

	$('#removeBuzzwords').click(function() {
		$("#buzzwords option:selected").remove();
		checkBuzzwordCount();
	});

  $(document).on('click','.item',function() {
      $(this).parent().remove();
  });

	$('#bingo-custom-btn').click(function() {
		$('#bingoCardInput').show();
		$('#bingo-back-container').show();
		$('#bingo-btns').hide();
	});

	$('#bingo-back-btn').click(function() {
		$('#bingo-btns').show();
		$('#bingoCard').hide();
		$('#bingo-back-container').hide();
		$('#bingoCardInput').hide();
	});

	$('#bingo-single-btn').click(function() {
		$('#bingoCard').show();
		$('#bingo-back-container').show();
		$('#bingo-btns').hide();
	});

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

		if ($checkmarkImg.css('display') != 'none') {
			$checkmarkImg.css("display", "none");
		} else {
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
