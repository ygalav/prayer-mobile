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
                                uri : CONFIGURATION.DSCAL_APP_URL_SCHEME_HOME_LINK,
                                successCallback : resolve(),
                                errorCallback : reject()
                            });
                        };
                        window.plugins.launcher.canLaunch({
                            uri: CONFIGURATION.DSCAL_APP_URL_SCHEME_HOME_LINK,
                            successCallback : successCanLaunch,
                            errorCallback : reject()
                        });
                    }
                });
            },

            launchApp : function (options) {
                var urlScheme = options.url;
                var appId  = options.appId;
                var onError = options.onError;
                var successCanLaunch = function(data) {
                    window.plugins.launcher.launch({
                        uri : CONFIGURATION.DSCAL_APP_URL_SCHEME_HOME_LINK
                    });
                };
                window.plugins.launcher.canLaunch({
                    uri: urlScheme,
                    successCallback : successCanLaunch,
                    errorCallback : onError()
                });
            },

            launchAppOnAppStore : function (appId) {
                return new Promise(function (resolve, reject) {
                    var url = 'itms-apps://itunes.apple.com/us/app/' + appId;
                    var successCanLaunch = function(data) {
                        window.plugins.launcher.launch({
                            uri: url,
                            successCallback : resolve(),
                            errorCallback : reject()
                        });
                    };

                    window.plugins.launcher.canLaunch({
                        uri: url,
                        successCallback : successCanLaunch,
                        errorCallback : reject()
                    });
                });
            }
        };
    });
})();