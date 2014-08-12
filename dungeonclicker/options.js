dC["options"] = new Object();
dC["options"]["VFX"] = true;
dC["options"]["Particles"] = true;
dC["options"]["AdditionalParticles"] = true;
dC["options"]["SFX"] = true;

function initOptionsPanel() {
	$("#options").mCustomScrollbar();
	
	for (var key in dC["options"]) {
		if (dC["options"][key]) $("#chk" + key).attr("checked", "checked");
	}

	$(".options-checkbox").change(function() {
		var key = $(this).attr("data-key");
		dC["options"][key] = $(this).is(":checked");
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

function showOptionsPanel() {
	$("#bg-texture").css("background-color", "rgb(125, 168, 47)");
	$("#options").mCustomScrollbar("update");
}