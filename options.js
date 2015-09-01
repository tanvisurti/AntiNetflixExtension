function processForm() {

    var hours = document.getElementById('hours').value;
	var minutes = document.getElementById('minutes').value;
	var timer = (parseInt(hours) * 60 * 60) + (parseInt(minutes) * 60);
	
	chrome.storage.local.set({'remaining': timer}, function() {});
	chrome.storage.local.set({'default': timer}, function() {});
	
	
	document.getElementById('label').innerHTML = 'Your changes have been saved!';
	
	
}

var form = document.getElementById('my-form');
form.addEventListener("submit", processForm);

chrome.storage.local.get('default', function (leftover) {
	var timer = parseInt(leftover.default);

	var seconds = parseFloat(timer);
	var hours = (Math.round(seconds * 0.00027777777));
	var minutes = (Math.round((seconds - (hours*60*60)) * 0.01666666666));
	hours = hours.toString();
	minutes = minutes.toString();
	
	
	if (hours.length == 1) {
		hours = '0' + hours;
	}
	if (minutes.length == 1) {
		minutes = '0' + minutes;
	}
	
	document.getElementById('hours').value = hours;
	document.getElementById('minutes').value = minutes;

});



