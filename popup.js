chrome.runtime.sendMessage("popup was invoked");

function displayTime(timer) {

		var seconds = parseFloat(timer);
		var hours = Math.floor(seconds * 0.00027777777);
		var minutes = Math.floor((seconds - (hours*60*60)) * 0.01666666666);
		seconds = Math.floor(seconds - (hours*60*60) - (minutes*60));
		document.getElementById("time").innerHTML = hours + ":" + minutes + ":" + seconds;
}


chrome.runtime.onMessage.addListener(function(timer) {
	if (timer != "popup was invoked") {
		displayTime(timer);
		setInterval(function() {
								timer = parseInt(timer);
								timer-= 1; 	
								if (timer > 0) {
									displayTime(timer);
					}}, 1000);
	}
});