var isFocused = true;

function onBlur() {
	isFocused = false;
	incomePeriod = 1000;
};
function onFocus(){
	isFocused = true;
	incomePeriod = 100;
};

if (/*@cc_on!@*/false) { // Check for IE
	document.onfocusin = onFocus;
	document.onfocusout = onBlur;
}
else {
	window.onfocus = onFocus;
	window.onblur = onBlur;
}
