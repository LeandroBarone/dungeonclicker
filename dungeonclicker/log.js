var logLines = 0;

$(function() {
	$("#log-padding").mCustomScrollbar();
	
	for (var i = 0; i < 15; i++) {
		toLog("&nbsp;");
	}
});

function toLog(line) {
	$("#log-lines").append("<div class='line'>" + line + "</div>");
	logLines++;
	if (logLines > 100) {
		$("#log-lines .line").slice(0, 1).remove();
	}
	$("#log-padding").mCustomScrollbar("update");
	$("#log-padding").mCustomScrollbar("scrollTo", "bottom",{scrollInertia:0});
}
