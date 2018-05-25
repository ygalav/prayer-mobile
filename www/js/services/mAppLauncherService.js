(function () {
    'use strict';
    var module = angular.module('PrayerServices');

    module.factory('prDSLauncherService', function(prLanguageService) {
        return {
            launchDSAppIfAllowed: function () {
                return new Promise(function (resolve, reject) {
                    if (!prLanguageService.hasLanguageDefined()) {
                        return;
                    }

                    var currentLanguage = prLanguageService.getCurrentLanguage();
                    if (currentLanguage === LANGUAGE_CODES.Ukrainian) {
                        var successCanLaunch = function(data) {
                            window.plugins.launcher.launch({
                                uri: CONFIGURATION.DSCAL_APP_URL_SCHEME_HOME_LINK
                            }, resolve(), reject());
                        };
                        window.plugins.launcher.canLaunch({
                            uri: CONFIGURATION.DSCAL_APP_URL_SCHEME_HOME_LINK
                        }, successCanLaunch, reject());
                    }
                });
            }
        };
    });
})();