dCi["buildings"] = new Object();
dCi["buildings"]["Tavern"] =				{"income":"1",				"basePrice":"100",			"quote":"Adventurers meet here, so glasses, plates and furniture are disposable."};
dCi["buildings"]["Orchard"] =				{"income":"2",				"basePrice":"430",			"quote":"A garden filled with beautiful trees and even more beautiful dryads."};
dCi["buildings"]["Butcher shop"] =	 		{"income":"5",				"basePrice":"1060",			"quote":"&laquo;Meat so fresh it still moans-- I mean, mooes!&raquo;<br />&ndash; Khar, local butcher"};
dCi["buildings"]["Farm"] =	 			{"income":"10",				"basePrice":"2080",			"quote":"It is said that some of the sheep are in fact people, who were victim of failed polimorphing attempts. Wizards, local authorities and the sheep deny this."};
dCi["buildings"]["Granite quarry"] =			{"income":"50",				"basePrice":"11800",			"quote":"&laquo;I bet I can break a granite block with my head.&raquo;<br />&ndash; Last words of dwarven prince Vorfin"};
dCi["buildings"]["Vineyard"] =	 			{"income":"100",			"basePrice":"22030",			"quote":"&laquo;Let me tell you, our wine is the best you have tasted. Here, take a sip. Don't be shy.&raquo;<br />&ndash; Lord Angus, vineyard owner, to himself"};
dCi["buildings"]["Inn"] =	 			{"income":"500",			"basePrice":"119400",			"quote":"quote"};
dCi["buildings"]["Copper mine"] =			{"income":"1000",			"basePrice":"282880",			"quote":"quote"};
dCi["buildings"]["Archery range"] =			{"income":"5000",			"basePrice":"1076800",			"quote":"quote"};
dCi["buildings"]["Blacksmith"] =			{"income":"10000",			"basePrice":"3001000",			"quote":"quote"};
dCi["buildings"]["Iron mine"] =	 			{"income":"50000",			"basePrice":"12767000",			"quote":"quote"};
dCi["buildings"]["Item shop"] =	 			{"income":"100000",			"basePrice":"27685000",			"quote":"quote"};
dCi["buildings"]["Alchemy lab"] =			{"income":"500000",			"basePrice":"163960000",		"quote":"quote"};
dCi["buildings"]["Silver mine"] =			{"income":"1000000",			"basePrice":"308390000",		"quote":"quote"};
dCi["buildings"]["Martial training hall"] =		{"income":"5000000",			"basePrice":"1285700000",		"quote":"quote"};
dCi["buildings"]["Coliseum"] =	 			{"income":"10000000",			"basePrice":"3115930000",		"quote":"quote"};
dCi["buildings"]["Gold mine"] =	 			{"income":"50000000",			"basePrice":"13640000000",		"quote":"quote"};
dCi["buildings"]["Rogue academy"] =	 		{"income":"100000000",			"basePrice":"38015500000",		"quote":"quote"};
dCi["buildings"]["Airship dock"] =	 		{"income":"500000000",			"basePrice":"170243300000",		"quote":"quote"};
dCi["buildings"]["Gladiator arena"] =	 		{"income":"1000000000",			"basePrice":"333166200000",		"quote":"quote"};
dCi["buildings"]["Arcane university"] =	 		{"income":"5000000000",			"basePrice":"2077028000000",		"quote":"quote"};
dCi["buildings"]["Magic item emporium"] = 		{"income":"10000000000",		"basePrice":"3534560000000",		"quote":"quote"};
dCi["buildings"]["Mercantile city-state"] =		{"income":"50000000000",		"basePrice":"16286879000000",		"quote":"quote"};
dCi["buildings"]["Dragon garden"] =	 		{"income":"100000000000",		"basePrice":"41445317000000",		"quote":"quote"};
dCi["buildings"]["Adventurers guild"] =	 		{"income":"500000000000",		"basePrice":"193115440000000",		"quote":"quote"};
dCi["buildings"]["Golemworks"] =	 		{"income":"1000000000000",		"basePrice":"481568924000000",		"quote":"quote"};
dCi["buildings"]["Astral gate"] =	 		{"income":"5000000000000",		"basePrice":"1833102577000000",		"quote":"quote"};
dCi["buildings"]["Planar fortress-ship"] =		{"income":"10000000000000",		"basePrice":"4442578011000000",		"quote":"quote"};
dCi["buildings"]["Mana generator"] =	 		{"income":"50000000000000",		"basePrice":"21735312920000000",	"quote":"quote"};
dCi["buildings"]["Infinite library"] =	 		{"income":"100000000000000",		"basePrice":"49487875626000000",	"quote":"quote"};
dCi["buildings"]["Chronospire"] =	 		{"income":"500000000000000",		"basePrice":"279135184187000000",	"quote":"quote"};
dCi["buildings"]["Soulwell"] =	 			{"income":"1000000000000000",		"basePrice":"425013658705000000",	"quote":"quote"};
dCi["buildings"]["Forge of realities"] = 		{"income":"5000000000000000",		"basePrice":"2446328617901000000",	"quote":"quote"};
dCi["buildings"]["Artificial deification lab"] =	{"income":"10000000000000000",		"basePrice":"7957005715067000000",	"quote":"quote"};

dC["buildings"] = new Object();

for (var key in dCi["buildings"]) {
	dC["buildings"][key] = new Object();
	dC["buildings"][key]["q"] = 0;
}

function initBuildingsPanel() {
	for (var key in dCi["buildings"]) {
		dC["buildings"][key]["p"] = calculateBuildingPrice(key, dC["buildings"][key]["q"]);
	}

	for (var key in dCi["buildings"]) {
		var markup = "";
		markup += '<div class="element building transparent unavailable" data-key="' + key + '">';
		markup += "<div class='fg'></div>";
		markup += "<div class='element-light'></div>";
		markup += "<div class='element-name'>" + key + "</div>";
		markup += "<div class='element-price'>0</div>";
		markup += "<div class='element-quantity'>0</div></div>";
		$("#building-list").append(markup);
	}
	$("#buildings").append("<div class='cb'></div>");
	$("#buildings").mCustomScrollbar();
	
	updateBuildings();

	// Buy building
	$(document).on("click", "#buildings .available", function() {
		var key = $(this).attr("data-key");
		var price = dC["buildings"][key]["p"];
		
		if (!GTE(dC["coin"], price)) {
			toLog("<span class='error'>Not enough gold!</span>");
			return;
		}
		
		dC["buildings"][key]["q"]++;
		substractCoin(price);
		generalUpdateCoin();
		
		dC["buildings"][key]["p"] = calculateBuildingPrice(key, dC["buildings"][key]["q"]);
		
		spawnParticles("coin", 5);
		
		updateBuildings();
		
		toLog("<span class='notification'>" + key + " purchased!</span>");
		$(this).mouseenter();
		
		if (key == "Artificial deification lab" && dC["buildings"][key]["q"] == 1) {
			toLog("<span class='enemy'><em>An evil intent turns its attention to you...<em></span>");
		}
	});
}

function showBuildingsPanel() {
	$("#bg-texture").css("background-color", "#004E96");
	$("#buildings").mCustomScrollbar("update");
	updateBuildingsStatus();
}

function updateBuildingsStatus() {
	if (dC.coin.toString().length > 20) {
		$("#buildings .element").addClass("opaque available");
		$("#buildings .element").removeClass("transparent unavailable");
		return;
	}
	
	for (var key in dCi["buildings"]) {
		if (dC["buildings"][key]["q"] > 0 || GTE(dC["coin"], dC["buildings"][key]["p"])) {
			$('#buildings .element[data-key="' + key + '"]').removeClass("transparent");
			$('#buildings .element[data-key="' + key + '"]').addClass("opaque");
		}
		else {
			$('#buildings .element[data-key="' + key + '"]').addClass("transparent");
			$('#buildings .element[data-key="' + key + '"]').removeClass("opaque");
		}
		
		if (GTE(dC["coin"], dC["buildings"][key]["p"])) {
			showNotification = true;
			
			$('#buildings .element[data-key="' + key + '"]').addClass("available");
			$('#buildings .element[data-key="' + key + '"]').removeClass("unavailable");
		}
		else {
			$('#buildings .element[data-key="' + key + '"]').addClass("unavailable");
			$('#buildings .element[data-key="' + key + '"]').removeClass("available");
		}
	}
}

function updateBuildingsNotificationStatus() {
	if (dC["coin"].toString().length > 15) {
		$("#btnMenuBuildings .notification").hide();
		return;
	}
	
	for (var key in dCi["buildings"]) {
		if (GTE(dC["coin"], dC["buildings"][key]["p"])) {
			$("#btnMenuBuildings .notification").show();
			return;
		}
	}
	
	$("#btnMenuBuildings .notification").hide();
}

function updateBuildings() {
	for (var key in dCi["buildings"]) {
		var price = dC["buildings"][key]["p"];
		if (price.length > 30) {
			price = "~10 <sup>" + (price.length - 1) + "</sup>";
		}
		else {
			price = price.addCommas();
		}
		$(".element-price", '#buildings .element[data-key="' + key + '"]').html("<span class='coin'>" + price + "<span class='symbol'>g</span> <span class='purchase'>purchase!</span></span>");
		$(".element-quantity", '#buildings .element[data-key="' + key + '"]').html(dC["buildings"][key]["q"].toString().addCommas());
	}
}

function calculateBuildingPrice(b, q) {
	var p = dCi["buildings"][b]["basePrice"];
	if (q > 5000) q = 5000;
	return multiplyNumbers(p, Math.pow(1.2, q)).toString();
}
