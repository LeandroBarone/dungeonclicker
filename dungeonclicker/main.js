String.prototype.repeat = function(num) {
	if (num < 1) return "";
	return new Array(num + 1).join(this);
}

String.prototype.addCommas = function(doNotAddSpaces) {
	if (doNotAddSpaces === true) {
		return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	else {
		return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",<span class='ws'> </span>");
	}
}

String.prototype.capitalize = function () {
	return this.replace(/^./, function (char) {
		return char.toUpperCase();
	});
}

String.prototype.toString = function() {
	return this;
}

Number.prototype.addCommas = function(doNotAddSpaces) {
	return this.toString().addCommas(doNotAddSpaces);
}

// Main game container
var dC = new Object();

// Game info
var dCi = new Object();
dCi["version"] = "9";
dCi["updated"] = "Aug 16, 2014";
dCi["changes"] = "Complete rebalance, income GUI. Please restart your game.";
dCi["quote"] = "\"Immortality is a long shot, I admit. But somebody has to be first\".<br />&mdash; Bill Cosby";
dC["v"] = dCi["version"]; // Game version

// Panels
dC["panels"] = new Object(); // Panels unlocked
dC["panels"]["Adventure"] = true;
dC["panels"]["Options"] = true;

// Panels
dCi["panels"] = new Object();
dCi["panels"]["Adventure"] = {"unlock":0,	"desc":"Go on an adventure and earn a small reward. This is your basic source of coin.", "hotkey":"1"};
dCi["panels"]["Options"] = {"unlock":0,		"desc":"Adjust the game settings.", "hotkey":"0"};
dCi["panels"]["Buildings"] = {"unlock":100,	"desc":"Purchase taverns, shops and other buildings and get a steady income of coin per second.", "hotkey":"2"};
dCi["panels"]["Artifacts"] = {"unlock":200,	"desc":"Purchase powerful items that grant you permanent bonuses.", "hotkey":"3"};

// Currency
var income;
var incomeIsBig = false;
var incomeMultiplier = 1;
var lastUpdateCoin = new Date().getTime() - 100;
dC["coin"] = "0";
dC["sn"] = false; // Use scientific notation?

// Income loop
var incomeRest = 0;
var incomeStart = new Date().getTime();
var incomeTime = 0;
var incomePeriod = 80;

// Buffs
var buffs = new Object();

// Panels
var activePanel = "";
var unlockPanelIsHidden = false;

// Keys
var receivingKeys = true;

$(function() {
	// Load settings
	var dCc = $.jStorage.get("dC", "undefined");
	if (dCc != "undefined") {
		
		if (dCc["v"] <= 7) {
			if (typeof dCc["options"]["RotateAdventureLight"] == "undefined") dCc["options"]["RotateAdventureLight"] = true;
			if (typeof dCc["options"]["ShowAdventureLight"] == "undefined") dCc["options"]["ShowAdventureLight"] = true;
			if (typeof dCc["options"]["ShowTransitions"] == "undefined") dCc["options"]["ShowTransitions"] = true;
		}

		if (dCc["v"] == 8) {
		}
		
		if (dCc["v"] < dCi["version"]) {
			dCc["v"] = dCi["version"];
		}
		
		dC = dCc;
	}
	
	// Save settings each 30 secs
	setInterval(function() {
		saveGame();
	}, 30 * 1000);
	
	initAdventurePanel();
	initOptionsPanel();
	initArtifactsPanel();
	initBuildingsPanel();
	
	showPanel("Adventure");
	
	generalUpdateCoin();
	
	for (var key in dC["panels"]) {
		if (dC["panels"][key] == true) {
			$("#btnMenu" + key).show();
		}
	}
	
	// Income interval
	setTimeout(earnIncome, incomePeriod);
	setInterval(generalUpdateCoin, 1000);
	
	$(window).load(function() {
		$(window).resize();
		$("#loading").remove();
		toLog("Welcome to <span class='gamename'>Dungeon Clicker</span> v" + dCi["version"] + "!");
		toLog("<span class='unimportant'>Updated: " + dCi["updated"]) + "</span>";
		toLog("<span class='unimportant'>" + dCi["changes"]) + "</span>";
	});
	
	$("#menu .button").mouseup(function() {
		changePanel($(this).attr("id").replace("btnMenu", ""));
	});

	// Resize code
	$(window).resize(function() {
		// Window
		var w = $(window).width();
		var h = $(window).height();
		if (h < 350) h = 350;
		if (w < 600) w = 600;
		$("#dungeon-clicker, #header, #footer").width(w);
		$("#dungeon-clicker").height(h);
		
		// Log
		var llH = $("#log-gui .line").slice(0,1).outerHeight();
		var lH = Math.floor(h * 0.18 / llH) * llH + 40;
		$("#log-gui").height(lH);
		$("#log-padding").mCustomScrollbar("scrollTo", "bottom",{scrollInertia:0});
		
		// Gold GUI
		reconfigureGoldGUI();
		
		// DC frames
		var bW = w - 30;
		if (unlockPanelIsHidden) {
			var bT = $("#coin-gui").position().top + $("#coin-gui").outerHeight() + $("#income-gui").outerHeight() + 15;
			var bH = h - ($("#log-gui").outerHeight() + $("#coin-gui").position().top + $("#coin-gui").outerHeight() + $("#income-gui").outerHeight() + 40);
		}
		else {
			var bT = $("#coin-gui").position().top + $("#coin-gui").outerHeight() + $("#unlock-gui").outerHeight() + 15;
			var bH = h - ($("#log-gui").outerHeight() + $("#coin-gui").position().top + $("#coin-gui").outerHeight() + $("#unlock-gui").outerHeight() + 40);
		}
		var bbW = Math.floor((bW - 30) / 2 - 20);
		$(".dcframe").width(bW);
		$(".dcframe").height(bH);
		$(".dcframe").css("top", bT);
		$(".dcframe .element").width(bbW);
		
		// Coin GUI
		$("#coin-gui").css("width", w - 30);
	});
	
	// Keys
	$(document).keyup(function(e) {
		if (!receivingKeys) return;
		
		if (e.which >= 48 && e.which <= 57) {
		
			var keyPressed = String.fromCharCode(e.which);
			
			for (key in dCi["panels"]) {
				if (dCi["panels"][key]["hotkey"] == keyPressed) {
					if (dC["panels"][key] == true) {
						changePanel(key)
					}
				}
			}
		}
	});
});

function saveGame() {
	$.jStorage.set("dC", dC);
	toLog("<span class='unimportant'>Game saved.</span>");
}

function reconfigureGoldGUI() {
	// Text size
	var coin = dC["coin"] + "";
	if (coin.length * 16.3 > wWidth - 60 && coin.length > 9) {
		dC["sn"] = true;
	}
	else {
		dC["sn"] = false;
	}
	
	// GUI position
	var gT = 15;
	var iT = 45;
	if (wWidth > 0 && $("#menu").width() > wWidth - ($("#coin-quantity").outerWidth() + parseInt($("#coin-gui").css("padding-left")) + 45)) {
		gT += 32; // Menu height
		iT -= 20;
	}
	$("#coin-gui").css("top", gT);
	$("#income-gui").css("top", iT);
}

function changePanel(panel) {
	if (activePanel == panel) return;
	
	clearAllParticles();
	whiteTransition();
	$(".panel").hide();
	
	showPanel(panel);
}

function showPanel(panel) {
	activePanel = panel;
	$("#panel-" + panel).show();
	
	if (panel == "Adventure") { showAdventurePanel(); }
	if (panel == "Options") { showOptionsPanel(); }
	if (panel == "Buildings") { showBuildingsPanel(); }
	if (panel == "Artifacts") { showArtifactsPanel(); }
	
	$(window).resize();
}

function addCoin(quantity) {
	if (quantity == 0 || quantity == "") return;
	
	dC["coin"] = addNumbers(dC.coin, quantity);
	
	updateCoin();
}

function substractCoin(quantity) {
	if (quantity == 0 || quantity == "") return;
	
	dC["coin"] = substractNumbers(dC.coin, quantity);
	
	updateCoin();
}

function updateCoin() {
	var currDate = new Date().getTime();
	if (currDate - lastUpdateCoin < incomePeriod) return; // Do not update too often
	lastUpdateCoin = currDate;
	
	var coin = dC["coin"].toString();

	if (dC["sn"]) {
		$("#coin-quantity").html("10<sup>" + (coin.length - 1) + "</sup>");
	}
	else {
		$("#coin-quantity").html(coin.addCommas());
		
	}
}

function generalUpdateCoin() {
	updateIncomeMultiplier();
	updateAdventureMultiplier();
	updateIncome();
	updateCoin();
	setTitle();
	updateBuildingsStatus();
	updateBuildingsNotificationStatus();
	updateArtifactsStatus();
	updateArtifactsNotificationStatus();
	reconfigureGoldGUI();
	unlockPanels();
}

function setTitle() {
	var coin = dC["coin"].toString();
	
	if (coin.length > 15) {
		document.title = "10^" + (coin.length - 1) + "g - Dungeon Clicker";
	}
	else {
		document.title = coin.addCommas(true) + "g - Dungeon Clicker";
	}
	
}

function unlockPanels() {
	if (unlockPanelIsHidden) return;
	
	for (var key in dCi["panels"]) {
		if (dC["panels"][key] == true) continue;
		
		if (GTE(dC.coin, dCi["panels"][key]["unlock"])) {
			toLog("<span class='notification'>You unlocked the <span class=''>" + key.capitalize() + " panel</span>! " + dCi["panels"][key]["desc"] + "</span>");
			$("#btnMenu" + key.capitalize()).show();
			dC["panels"][key] = true;
			playSound("notification");
		}
	}
	
	var label = "";
	var panelPrice = 999999;
	for (var key in dCi["panels"]) {
		if (dC["panels"][key] != true) {
			if (dCi["panels"][key]["unlock"] < panelPrice) {
				label = "Unlock the <span class='panel-name'>" + key.capitalize() + " panel</span> at <span class='coin'>" + dCi["panels"][key]["unlock"] + "</span><span class='symbol'>g</span>!";
				panelPrice = dCi["panels"][key]["unlock"];
			}
		}
	}
	
	if (label == "" && unlockPanelIsHidden != true) {
		console.log(label);
		unlockPanelIsHidden = true;
		$("#unlock-gui").remove();
	}
	else {
		$("#unlock-gui").html(label);
	}
}

function updateIncome() {
	income = "";
	incomeIsBig = false;
	
	for (var key in dC["buildings"]) {
		if (dC["buildings"][key]["q"] > 0) {
			var bIncome = multiplyNumbers(dCi["buildings"][key]["income"], dC["buildings"][key]["q"]);
			income = addNumbers(income, bIncome);
		}
	}
	
	if (hasBuff("Alchemist's Kit")) income = addNumbers(income, 33);
	if (hasBuff("Philosophic Mercury")) income = addNumbers(income, 33333);
	if (hasBuff("Philosopher's Stone")) income = addNumbers(income, 33333333);
	
	if (income == "") return;
	
	// Multipliers
	if (incomeMultiplier > 1) {
		income = multiplyNumbers(income, incomeMultiplier);
	}
	
	// Is it big?
	if (income.toString().length <= 15) {
		income = parseInt(income);
	}
	else {
		incomeIsBig = true;
	}
	
	if (income.toString().length > 50) {
		$("#income-gui").html("Income: <span class='coin'>10<sup>" + (income.length - 1) + "</sup></span><span class='symbol'>g</span>");
	}
	else {
		$("#income-gui").html("Income: <span class='coin'>" + income.addCommas() + "</span><span class='symbol'>g</span>");
	}
}

function updateIncomeMultiplier() {
	incomeMultiplier = 1;
	if (hasBuff("Talon of the Harpy")) incomeMultiplier += 0.01;
	if (hasBuff("Eye of the Cockatrice")) incomeMultiplier += 0.02;
	if (hasBuff("Sting of the Wyvern")) incomeMultiplier += 0.03;
	if (hasBuff("Claw of the Sphynx")) incomeMultiplier += 0.04;
	if (hasBuff("Left Horn of Mammorus")) incomeMultiplier += 0.05;
	if (hasBuff("Right Horn of Mammorus")) incomeMultiplier += 0.05;
	if (hasBuff("Scale of the Drake")) incomeMultiplier += 0.06;
	if (hasBuff("Spike of the Basilisk")) incomeMultiplier += 0.07;
	if (hasBuff("Tooth of the Manticore")) incomeMultiplier += 0.08;
	if (hasBuff("Heart of the Kraken")) incomeMultiplier += 0.09;
	if (hasBuff("Left Tusk of the Tarrasque")) incomeMultiplier += 0.1;
	if (hasBuff("Right Tusk of the Tarrasque")) incomeMultiplier += 0.1;
	if (hasBuff("Ring of Luck")) incomeMultiplier += 1;
}

function earnIncome() {
	var diff = (new Date().getTime() - incomeStart) - incomeTime;

	if (income != "") {
		if (incomeIsBig) {
			var timeMultiplier = diff / 1000;
			addCoin(multiplyNumbers(income, timeMultiplier));
		}
		else {
			var timeMultiplier = diff / 1000;
			var subIncome = parseInt(income) * timeMultiplier;
			var subIncomeInt = Math.floor(subIncome);
			var subIncomeDec = (subIncome - subIncomeInt);
			
			incomeRest += subIncomeDec * 10000;
			
			var subIncomeRestInt = Math.floor(incomeRest / 10000);
			incomeRest -= subIncomeRestInt * 10000;
			
			addCoin(subIncomeInt + subIncomeRestInt);
		}
	}
	
	incomeTime += diff;
	if (dC["sn"] || !isFocused) {
		setTimeout(earnIncome, 1000);
	}
	else {
		setTimeout(earnIncome, incomePeriod);
	}
}

function hasBuff(buff) {
	if (typeof buffs[buff] != "undefined") {
		return buffs[buff];
	}
	else {
		return false;
	}
}
