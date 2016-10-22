(function () {
	'use strict';
	var module = angular.module('prayer',
		[
			'onsen',
			'ngSanitize',
			'PrayerControllers'
		]);
})();



angular.element(document).ready(function () {
	if (window.cordova) {
		document.addEventListener('deviceready', function () {
			console.log("Deviceready event has fired, bootstrapping AngularJS.");
			console.log(navigator.globalization);
			angular.bootstrap(document.body, ['prayer']);
		}, false);
	} else {
		console.log("Running in browser, bootstrapping AngularJS now.");
		angular.bootstrap(document.body, ['prayer']);
	}
});
