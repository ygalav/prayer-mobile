(function () {
	'use strict';
	var module = angular.module('PrayerServices');

		module.factory('prLanguageService', function(context) {
		var services = {
			getCurrentLanguage : function() {
				return context.systemproperties.getValue(context.systemproperties.keys.language, 'UA');
			},

			getLocalizationBundleForLanguage : function(language) {
				language = language ? language.toUpperCase() : 'UA';
				if (language === 'PL') {
					return PrayerLocalizations.pl;
				}
				else if (language === 'EN') {
					return PrayerLocalizations.en;
				}
				else {
					return PrayerLocalizations.ua;
				}
			}
		};
		return services;
	});
})();