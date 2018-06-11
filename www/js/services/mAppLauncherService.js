(function () {
    'use strict';
    var module = angular.module('PrayerServices');

    module.factory('prDSLauncherService', function(prLanguageService) {
        var launchAppOnAppStore = function (appId) {
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
        };

        return {
            launchApp : function (options) {
                var urlScheme = options.url;
                var appId  = options.appId;
                var successCanLaunch = function(data) {
                    window.plugins.launcher.launch({
                        uri : urlScheme
                    });
                };
                window.plugins.launcher.canLaunch({
                    uri: urlScheme,
                    successCallback : successCanLaunch,
                    errorCallback : function () {
                        launchAppOnAppStore(appId)
                    }
                });
            }
        };
    });
})();
