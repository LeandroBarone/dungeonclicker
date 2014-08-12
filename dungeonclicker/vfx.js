var mousePosX = 0;
var mousePosY = 0;
var wWidth = 0;
var wHeight = 0;

var particles = new Array();
var particleId = 0;
var numberOfParticles = 0;

$(function() {
	$("#dungeon-clicker").mousemove(function(e) {
		mousePosX = Math.floor(e.pageX - $("#dungeon-clicker").offset().left);
		mousePosY = Math.floor(e.pageY - $("#dungeon-clicker").offset().top);
	});
	$(window).resize(function() {
		wWidth = $("#dungeon-clicker").width();
		wHeight = $("#dungeon-clicker").height();
	});
});

function whiteTransition() {
	if (dC["options"]["ShowTransitions"] == false) return;
	$("#white-transition").css("opacity", 1);
	$("#white-transition").stop().animate({"opacity":0},300);
}

function spawnParticles(particle, number) {
	if (dC["options"]["Particles"] == false) return;

	for (var i = 0; i < number; i++) {
		spawnParticle(particle);
	}
}

function spawnParticle(particle) {
	if (numberOfParticles > 30 && dC["options"]["AdditionalParticles"] != true) return;

	particleId++;
	numberOfParticles++;
	
	var id = particleId;
	
	var left = mousePosX;
	var top = mousePosY;
	
	var speedX = Math.floor(Math.random() * 10) + 4;
	if (randomBool()) speedX = 0 - speedX;
	
	var speedY = 0 - (Math.floor(Math.random() * 10) + 10);
	
	var BGPosition = 0;
	
	$("#particles").append("<div id='particle" + id + "' class='particle " + particle + "' style='left:" + left + "px;top:" + top + "px;'></div>");
	
	var particleInterval = setInterval(function() {
		if (numberOfParticles < 1) {
			clearInterval(particleInterval);
			return;
		}
		
		left += speedX;
		top += speedY;
		speedY += 1.5;
		
		if (top > wHeight + 20) {
			$("#particle"+id).remove();
			numberOfParticles--;
			clearInterval(particleInterval);
			return;
		}
		
		$("#particle"+id).css("left", left);
		$("#particle"+id).css("top", top);
		
		if (particle == "star") {
			$("#particle"+id).css("background-position", ((!BGPosition) * 100) + "%");
			BGPosition = !BGPosition
		}
	}, 20);
}

function clearAllParticles() {
	numberOfParticles = 0;
	$("#particles").empty();
}
