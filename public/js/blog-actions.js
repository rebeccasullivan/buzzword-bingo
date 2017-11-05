$(document).ready(function() {

	$('#search-btn').click(function() {

		var searchInput = $('#search-input').val();
		console.log('searchInput: ' + searchInput);
		searchContentful(searchInput);
	});

	$('.search').on('keyup', function(e) {
		if(e.keyCode === 13) {
			var searchInput = $('#search-input').val();
			console.log('searchInput: ' + searchInput);

			searchContentful();
		}
	});

	function searchContentful(searchText) {

	}

});
