function refreshCard() {
	var httpReq = new XMLHttpRequest(), 
				  method = "GET", 
				  url = "http://localhost:3000/bingo-squares";
	httpReq.onreadystatechange = function() {
		// ReadyState == 4 -> Status of 'DONE'
	    if (this.readyState == 4 && this.status == 200) {
			document.getElementById("bingo-square").innerHTML = this.responseText;
	    }
	};
	httpReq.open(method, url, true);
	httpReq.send();
}