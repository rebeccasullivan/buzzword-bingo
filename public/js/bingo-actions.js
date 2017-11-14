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
		if (numBuzzwords < 30) {
			$('#generateCardBtn').hide();
		} else {
			$('#generateCardBtn').show();
		}
	}

	// Handlebars helper to group bingo squares in rows of 5
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

	// Event listener to generate bingo card upon "Generate Card" button click
	$('#generateCardBtn').click(function() {
		// Get buzzwords from user-input list
		var buzzwords = [];

		$("#buzzwords option").each(function() {
			buzzwords.push(this.innerText);
		});

		// Shuffle buzzwords and grab top 25
		buzzwords.sort(function() { return 0.5 - Math.random() });
		buzzwords = buzzwords.slice(0, 25);

		// Compile template for bingo card and add buzzwords from list
		var template = $('#bingoCardTemplate').html();
		var compiledTemplate = Handlebars.compile(template);
		var html = compiledTemplate({buzzwords: buzzwords});
		$('#customBingoCard').html(html);
		fillFreeSquare();
	});

	// Event listener to add randomly generated buzzwords to list
	$('#addBuzzwords').click(function() {
		var numBuzzwords = $('#numAdditionalBuzzwords option:selected').val();

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

	// Event listener to generate a single bingo card with randomly generated buzzwords from db
	$('#bingo-single-btn').click(function() {
		$.ajax({
			url: "/buzzwords?number=25",
			success: function(result) {
				var buzzwords = [];

				result.forEach(function(buzzword) {
					buzzwords.push(buzzword.square_text);
				});

				// Compile template for bingo card and add buzzwords from list
				var template = $('#bingoCardTemplate').html();
				var compiledTemplate = Handlebars.compile(template);
				var html = compiledTemplate({buzzwords: buzzwords});
				$('#defaultBingoCard').html(html);
				$('#defaultBingoCard').show();
				fillFreeSquare();
			}
		});
	});

	// Event listener for button to add a single buzzword to the user-input list on click event
  $('#buzzwordSubmit').click(function() {
			if ($('#addBuzzword').val().length > 0) {
				addBuzzwordItem();
			}
			checkBuzzwordCount();
	});

	// Event listener to add single buzzword upon user hitting 'enter'
	$('#addBuzzword').on('keypress', function (e) {
			if ($('#addBuzzword').val().length > 0 && e.which === 13) {
				addBuzzwordItem();
			}
			checkBuzzwordCount();
   });

	 // Helper function to add buzzword to list
	 function addBuzzwordItem() {
		 $('#buzzwords').append('<option> ' + $('#addBuzzword').val() + '</option>');
		 $('#addBuzzword').val('');
	 }

	$('#removeBuzzwords').click(function() {
		$("#buzzwords option:selected").remove();
		checkBuzzwordCount();
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

		// Empty bingo cards that were generated
		$('#defaultBingoCard').empty();
		$('#customBingoCard').empty();
	});

	$('#bingo-single-btn').click(function() {
		$('#bingoCard').show();
		$('#bingo-back-container').show();
		$('#bingo-btns').hide();
	});

	$(document).on('click','.square',function() {
		addMark(this);

		var hasWon = false;
		var $bingoCard = $(this).parent().parent();

		if (isWinningCard($bingoCard)) {
			setTimeout(function() {
				alert("You've won!");
			}, 10)
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

	function isWinningCard($bingoCard) {
		return hasWinningRow($bingoCard) || hasWinningColumn($bingoCard) || hasWinningDiagonal($bingoCard);
	}

	function hasWinningRow($bingoCard) {
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

	function hasWinningColumn($bingoCard) {
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

	function hasWinningDiagonal($bingoCard) {
		// Select bingo grid
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
