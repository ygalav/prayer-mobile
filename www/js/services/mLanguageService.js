(function () {
	'use strict';
	var module = angular.module('PrayerServices');

	module.config(function($logProvider){
		$logProvider.debugEnabled(debug.services);
	});

		module.factory('prLanguageService', function($log, context) {
		var services = {

			defineLanguage : function() {
				if (!context.systemproperties.getValue(context.systemproperties.keys.language)) {
					$log.debug("No language has been set, setting language based on device preferences");
					navigator.globalization.getPreferredLanguage(
						function (language) {
							switch (language.value.toLowerCase()) {
								case 'pl_PL'.toLowerCase():
								case 'pl-PL'.toLowerCase(): {
									context.systemproperties.setValue(context.systemproperties.keys.language, 'PL');
									break;
								}
								case 'be_BY'.toLowerCase():
								case 'be-BY'.toLowerCase():
								case 'ru_RU'.toLowerCase():
								case 'ru-RU'.toLowerCase():
								case 'RU'.toLowerCase():
								case 'uk_UA'.toLowerCase():
								case 'uk-UA'.toLowerCase(): {
									context.systemproperties.setValue(context.systemproperties.keys.language, 'UA');
									break;
								}
								default: {
									context.systemproperties.setValue(context.systemproperties.keys.language, 'EN');
								}
							}
						},
						function () {alert('Error getting language\n');}
					);
				}
				$log.debug("Session language is: " + context.systemproperties.getValue(context.systemproperties.keys.language));
			},

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