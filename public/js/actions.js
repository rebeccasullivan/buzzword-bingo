function refreshCard() {
	var httpReq = new XMLHttpRequest(), 
				  method = "GET", 
				  url = "http://localhost:3000/bingo-refresh";

	httpReq.onreadystatechange = function() {
		// ReadyState == 4 -> Status of 'DONE'
	    if (this.readyState == 4 && this.status == 200) {
			document.getElementById("bingoSquare").innerHTML = this.responseText;
	    }
	};

	httpReq.open(method, url, true);
	httpReq.send();
}


function reloadStylesheets() {
	var queryString = '?reload=' + new Date().getTime();
	$('link[rel="stylesheet"]').each(function () {
	    this.href = this.href.replace(/\?.*|$/, queryString);
	});
	console.log('Finished reloadStylesheets function');
}

function refreshStyle(stylesheet, event) {
	event.preventDefault();
	$('#mainStyle').attr('href', stylesheet);
	console.log('Stylesheet path: ' + stylesheet);
}

function refreshBootstrap(bootstrapUrl, event) {
	event.preventDefault();
	$('#bootstrap').attr('href', bootstrapUrl);
	console.log('Bootstrap path: ' + bootstrapUrl);
}