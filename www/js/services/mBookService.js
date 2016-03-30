(function () {
	'use strict';
	var module = angular.module('PrayerServices');

	module.factory('prBookService', function(prLanguageService) {
		return {
			getDefaultBookIDForCurrentLanguage: function () {
				switch (prLanguageService.getCurrentLanguage()) {
					case 'UA' : return 1;
					case 'PL' : return 3;
					default : return 2;
				}
			}
		};
	});
})();