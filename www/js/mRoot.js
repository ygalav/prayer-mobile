(function () {
	'use strict';
	var module = angular.module('prayer',
		[
			'onsen',
			'ngSanitize',
			'PrayerControllers'
		]);
})();


/*document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(navigator.globalization);
}*/

angular.element(document).ready(function () {
	if (window.cordova) {
		console.log("Running in Cordova, will bootstrap AngularJS once 'deviceready' event fires.");
		document.addEventListener('deviceready', function () {
			console.log("Deviceready event has fired, bootstrapping AngularJS.");
			console.log(navigator.globalization);
            ons.disableAutoStatusBarFill(); //This line removes strange margin in the top for iOS.
			angular.bootstrap(document.body, ['prayer']);

			if (isShowAds()) {
				loadAds();
			}

		}, false);
	} else {
		console.log("Running in browser, bootstrapping AngularJS now.");
		angular.bootstrap(document.body, ['prayer']);
	}
});

function isShowAds() {
	var showAdsPropertyVal = localStorage.getItem('showAds');

	if (!showAdsPropertyVal) {
		return true; //First launch, vale not set
	}
	return String(showAdsPropertyVal) === 'true';
}

function loadAds() {
	var isAndroid = (/(android)/i.test(navigator.userAgent));
	var adPublisherIds = {
		ios: {
			banner: 'ca-app-pub-6587607434956727/8586926499'
		},
		android: {
			banner: 'ca-app-pub-6587607434956727/7609720897'
		}
	};

	var admobid;
	if (isAndroid) {
		alert("android");
		admobid = adPublisherIds.android;
	} else {
		admobid = adPublisherIds.ios;
	}

	if (window.admob) {
		// Set AdMobAds options:
		admob.setOptions({
			publisherId:admobid.banner,
			autoShowBanner: true,
			autoShowInterstitial: false
		});
		// Start showing banners (atomatic when autoShowBanner is set to true)
		admob.createBannerView();
	}
}


