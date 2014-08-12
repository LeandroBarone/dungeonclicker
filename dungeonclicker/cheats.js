$(function() {
	$("#coin-gui").click(function(e) {
		if (!e.ctrlKey) return;
		addCoin(1000000);
		toLog("<span class='notification'>It's a kind of magic &#9836;</span>");
	});
	
	$("#logo").click(function(e) {
		if (!e.ctrlKey) return;
		$.jStorage.deleteKey("dC");
		window.location.reload();
	});
});
