$(document).ready(function() {

	console.log('Entered document.ready function');
	fillFreeSquare();

	function fillFreeSquare() {
		console.log("Entered 'fillFreeSquare method");
		var $bingoGrid = $('#bingoSquare').find('.table');
		var $middleRow = $bingoGrid.find('tr:nth-child(3)');
		var $middleSpace = $middleRow.find('td:nth-child(3)');
		var $middleDiv = $middleSpace.find('div');
		$middleDiv.html("FREE!");
		$middleDiv.addClass()
		
		var $checkmarkImg = $middleSpace.find('img');
		$checkmarkImg.toggle();
	}
	
	
});