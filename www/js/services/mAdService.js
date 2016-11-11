(function () {
    'use strict';
    var module = angular.module('PrayerServices');

    module.factory('prAdService', function() {
        return {
            showBannerAd : function (show) {
                if (window.admob) {
                    window.admob.showBannerAd(show);
                }
            }
        }
    });
})();