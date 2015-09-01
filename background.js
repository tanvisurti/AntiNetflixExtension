//This Extension tracks how much time you are spending on Netflix in a day and tells you to stop after you pass a certain limit
//The default time limit is 90 minutes, unless it is changed by the user

function endoftimeout (id) {
	var navigateUrl = chrome.extension.getURL("timesup.html");
	chrome.tabs.update(id, {url: navigateUrl})
	chrome.storage.local.set({'remaining': 0}, function() {});
}


function start(id) {
	timerOn = true;

	globalTimer = setInterval(function() {timer-= 1; 	
							if (timer < 0) {
								endoftimeout(id);
				}}, 1000);
}

function stop () {
	timerOn = false;
	clearInterval(globalTimer);
	chrome.storage.local.set({'remaining': timer}, function() {});
}

//This function checks if the current tab is Netflix. If it is, it starts the timer. If it was Netflix and was changed, it stops the timer
function checkTab() {
	chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
	var url = arrayOfTabs[0].url;

		if (url.indexOf("netflix.com") > -1) {
		
			//show the button if netflix is the current tab
			var id = arrayOfTabs[0].id;
			chrome.pageAction.show(id);
			if (timerOn == false) {

				//check if the day has changed
				var d = new Date();
				var n = parseInt(d.getDate());
				if (n != current) {
					chrome.storage.local.set({'remaining': reset, 'current': n}, function(something) {});
				}			
				
				//start the timer

				start(id);
			}
		}
		
		//if the current tab is not netflix but the timer is on, turn it off
		if (url.indexOf("netflix.com") == -1 && timerOn == true) {
			var id = arrayOfTabs[0].id;
			chrome.pageAction.hide(id);
			stop(id);
		}
	});
}

//On popup invoke, send them the timer
chrome.runtime.onMessage.addListener(function(message) {
	if (message == "popup was invoked") {
		chrome.runtime.sendMessage(timer);
	}
})

//On Install, save timer as the default at 1 hour
chrome.runtime.onInstalled.addListener(function() {
	var d = new Date();
	var d = d.getDate();
	chrome.tabs.create({'url': 'options.html'}, function(){});
	chrome.storage.local.set({'remaining': '3600', 'default': '3600', 'current': d}, function(something) {});
})

//global variables
var timer = 0;
var current = 0;
var timerOn = false;
var globalTimer = '';
var reset = 0;
chrome.storage.local.get('remaining', function (leftover) {
	timer = parseInt(leftover.remaining);
});
chrome.storage.local.get('current', function (leftover) {
	current = parseInt(leftover.current);
});
chrome.storage.local.get('default', function (leftover) {
	reset = parseInt(leftover.default);
});

//Listen for options changes
chrome.storage.onChanged.addListener(function () {
	chrome.storage.local.get('remaining', function (leftover) {
	timer = parseInt(leftover.remaining);
	});
	
	chrome.storage.local.get('default', function (leftover) {
	reset = parseInt(leftover.default);
	});
});

//Event for navigations
chrome.webNavigation.onCommitted.addListener(function () {checkTab()});
chrome.tabs.onActivated.addListener(function () {checkTab()})
