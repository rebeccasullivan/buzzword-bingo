function refreshCard() {
	var httpReq = new XMLHttpRequest(), 
				  method = "GET", 
				  url = "http://localhost:3000/bingo-squares";

	httpReq.onreadystatechange = function() {
		// ReadyState == 4 -> Status of 'DONE'
	    if (this.readyState == 4 && this.status == 200) {
			document.getElementById("bingoSquare").innerHTML = this.responseText;
	    }
	};
	
	httpReq.open(method, url, true);
	httpReq.send();
	fillFreeSquare();
}



function fillFreeSquare() {
	console.log("Entered 'fillFreeSquare method");
	var $bingoGrid = $('#bingoCard').find('.table');
	var $middleRow = $bingoGrid.find('tr:nth-child(3)');
	var $middleSpace = $middleRow.find('td:nth-child(3)');
	var $middleDiv = $middleSpace.find('div');
	$middleDiv.html("FREE!");
	$middleDiv.addClass()
	
	var $checkmarkImg = $middleSpace.find('img');
	$checkmarkImg.toggle();
}