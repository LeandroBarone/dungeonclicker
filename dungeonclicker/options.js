dC["options"] = new Object();
dC["options"]["ShowAdventureLight"] = true;
dC["options"]["RotateAdventureLight"] = true;
dC["options"]["ShowTransitions"] = true;
dC["options"]["Particles"] = true;
dC["options"]["AdditionalParticles"] = true;
dC["options"]["SFX"] = true;

function initOptionsPanel() {
	$("#options").mCustomScrollbar();
	
	for (var key in dC["options"]) {
		if (dC["options"][key]) $("#chk" + key).attr("checked", "checked");
	}
	
	updateOptions();

	$(".options-checkbox").change(function() {
		var key = $(this).attr("data-key");
		dC["options"][key] = $(this).is(":checked");
		updateOptions();
	});
	
	$("#btnSave").click(function() {
		saveGame();
	});
	
	$("#btnReset").click(function() {
		var res1 = confirm("Your progress will be deleted. Are you sure?");
		if (!res1) return;
		var res2 = confirm("This can't be undone! Are you REALLY sure??");
		if (!res2) return;
		
		$.jStorage.deleteKey("dC");
		window.location.reload();
	});
}

function updateOptions() {
	if (dC["options"]["RotateAdventureLight"] == true) {
		$("#light").addClass("rotate");
	}
	else {
		$("#light").removeClass("rotate");
	}
}

function showOptionsPanel() {
	$("#bg-texture").css("background-color", "#313");
	$("#options").mCustomScrollbar("update");
}