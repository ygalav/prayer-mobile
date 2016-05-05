(function () {
	'use strict';
	var module = angular.module('PrayerServices');

	module.config(function($logProvider){
		$logProvider.debugEnabled(debug.services);
	});

		module.factory('prLanguageService', function($log, context) {
		var services = {
			defineLanguage : function(callback) {
				if (!context.systemproperties.getValue(context.systemproperties.keys.language)) {
					$log.debug("No language has been set, setting language based on device preferences");
				} else {
					callback(context.systemproperties.getValue(context.systemproperties.keys.language));
				}
				$log.debug("Session language is: " + context.systemproperties.getValue(context.systemproperties.keys.language));
			},

			hasLanguageDefined : function () {
				return context.systemproperties.getValue(context.systemproperties.keys.language) != undefined;
			},

			getCurrentLanguage : function() {
				return context.systemproperties.getValue(context.systemproperties.keys.language, 'UA');
			},

			setCurrentLanguage : function(languageCode) {
				context.systemproperties.setValue(context.systemproperties.keys.language, languageCode);
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