function randomBetween(a, b) {
	var d = b - a + 1;
	return Math.floor(Math.random() * d + a);
}

function randomBool() {
	return ((Math.floor(Math.random() * 100)) > 50);
}

function addNumbers(a, b) {
	if (a == "0" || a == "") a = 0;
	if (b == "0" || b == "") b = 0;
	
	if (a.toString().length > 14 || b.toString().length > 14) {
		return addBigNumbers(a, b);
	}
	else {
		return parseInt(a) + parseInt(b);
	}
}

function addBigNumbers(a, b) {
	// Convert to string
	a = a.toString();
	b = b.toString();
	
	// Determine padding
	var pad = 0;
	if (a.length > b.length) {
		pad = a.length;
	}
	else {
		pad = b.length;
	}
	
	// Pad
	a = "0".repeat(pad - a.length) + a;
	b = "0".repeat(pad - b.length) + b;
	
	// Add
	var remainder = 0;
	var result = "";
	
	for (var i = pad - 1; i >= 0; i--) {
		var d1 = parseInt(a[i]);
		var d2 = parseInt(b[i]);
		var sum = d1 + d2 + remainder;
		
		if (sum >= 10) {
			sum = sum - 10;
			remainder = 1;
		}
		else {
			remainder = 0;
		}
		
		result = sum + result;
	}
	
	if (remainder) {
		result = remainder + result;
	}
	
	return result;
}

function substractNumbers(a, b) {
	if (a == "0" || a == "") a = 0;
	if (b == "0" || b == "") b = 0;
	
	if (a.toString().length > 14 || b.toString().length > 14) {
		return substractBigNumbers(a, b);
	}
	else {
		return parseInt(a) - parseInt(b);
	}
}

function substractBigNumbers(a, b) {
	// Convert to string
	a = a.toString();
	b = b.toString();
	
	// Determine padding
	var pad = 0;
	if (a.length > b.length) {
		pad = a.length;
	}
	else {
		pad = b.length;
	}
	
	// Pad
	a = "0".repeat(pad - a.length) + a;
	b = "0".repeat(pad - b.length) + b;
	
	// Substract
	var remainder = 0;
	var result = "";
	
	for (var i = pad - 1; i >= 0; i--) {
		var d1 = parseInt(a[i]);
		var d2 = parseInt(b[i]);
		var sub = d1 - d2 - remainder;
		
		if (sub < 0) {
			sub = sub + 10;
			remainder = 1;
		}
		else {
			remainder = 0;
		}
		
		result = sub + result;
	}
	
	// Unpad
	while (result[0] == "0") {
		result = result.substr(1);
	}
	if (result == "") result = "0";
	
	return result;
}

function multiplyNumbers(a, b) {
	if (a == "0" || a == "") a = 0;
	if (b == "0" || b == "") b = 0;
	
	// Return 0
	if (a == 0 || b == 0) return 0;
	
	// Convert
	var extras = 0;
	if (typeof a == "number") {
		if (a % 1 != 0) {
			a = a.toString();
			var decimals = a.length - a.indexOf(".") - 1;
			if (decimals > 5) decimals = 5;
			a = a.substr(0, a.indexOf(".") + decimals + 1).replace(".", "");
			extras += decimals;
		}
	}
	if (typeof b == "number") {
		if (b % 1 != 0) {
			b = b.toString();
			var decimals = b.length - b.indexOf(".") - 1;
			if (decimals > 5) decimals = 5;
			b = b.substr(0, b.indexOf(".") + decimals + 1).replace(".", "");
			extras += decimals;
		}
	}
	
	if (a.toString().indexOf("e") != -1) a = convertSN(a);
	if (b.toString().indexOf("e") != -1) b = convertSN(b);
	
	// Calculate
	var result;
	if (a.toString().length + b.toString().length > 14) {
		result = multiplyBigNumbers(a, b);
	}
	else {
		result = parseInt(a) * parseInt(b);
	}
	
	// Reconvert
	result = result.toString();
	return result.substr(0, result.length - extras);
}

function multiplyBigNumbers(a, b) {
	// Convert to string
	a = a.toString();
	b = b.toString();
	
	// Multiply
	var step = 0;
	var result = "0";
	
	for (var i = b.length - 1; i >= 0; i--) {
		var m1 = parseInt(b[i]);
		var subresult = "0".repeat(step);
		var remainder = 0;
		
		for (var j = a.length - 1; j >= 0; j--) {
			var m2 = parseInt(a[j]);
			var mul = m1 * m2 + remainder;
			subresult = (mul % 10) + subresult;
			remainder = Math.floor(mul / 10);
		}
		
		if (remainder > 0) {
			subresult = remainder + subresult;
		}
		
		result = addNumbers(result, subresult);
		
		step++;
	}
	
	return result;
}

function convertSN(n) {
	n = n.toString();
	
	if (n.indexOf("e") == -1) return n;
	
	var mantissa = n.substr(0, n.indexOf('e'));
	var exp = n.substr(n.indexOf('+') + 1);
	
	return mantissa.replace(".", "") + "0".repeat(exp - (mantissa.length - 2));
}

function GTE(a, b) {
	if (typeof a == "undefined") a = 0;
	if (typeof b == "undefined") b = 0;
	
	a = a.toString();
	b = b.toString();
	
	if (a.length > b.length) return true;
	if (a.length < b.length) return false;
	if (a.length = b.length) return (a >= b);
}
