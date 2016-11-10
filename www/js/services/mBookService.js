(function () {
	'use strict';
	var module = angular.module('PrayerServices');

	module.factory('prBookService', function(prLanguageService) {
		return {
			getDefaultBookIDForCurrentLanguage: function () {
				switch (prLanguageService.getCurrentLanguage()) {
					//TODO: It would be great to have all this functionality on remote
					case 'UA' : return 1;
					case 'PL' : return 3;
					case 'RU' : return 4;
					default : return 2;
				}
			}
		};
	});
})();