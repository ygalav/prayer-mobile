(function () {
    'use strict';
    var module = angular.module('app', ['onsen']);

    module.controller('AppController', function ($scope) {
        $scope.doSomething = function () {
            setTimeout(function () {
                ons.notification.alert({message: 'tapped'});
            }, 100);
        };
    });

    module.controller('MasterController', ['$scope', '$http', 'Services', function ($scope, $http, Services) {
        $scope.items = {};
        Services.getAllCategories(function(data) {
            $scope.items = data;
        });

        $scope.showDetail = function (selectedCategory) {
            navi.pushPage('detail.html', {category: selectedCategory});
        };
    }]);

    module.controller('PraysListController', function ($scope, Services) {
        $scope.category = $scope.navi.getCurrentPage().options.category;
        Services.getPraysForCategory($scope.category.id, function(data) {
            $scope.prays = data;
        });

        $scope.showPrayItem = function (pray) {
            navi.pushPage('PrayItemView.html', {prayItemId: pray.id});
        };
    });

    module.controller('PraysItemViewController', function ($scope, Services) {
        var prayItemId = $scope.navi.getCurrentPage().options.prayItemId;
        Services.getPrayItemById(prayItemId, function(data) {
            $scope.prayItem = data;
        });
    });

    module.factory('Services', function ($http) {
        var siteUrl = 'http://rest.prayer.com.ua/rest';
        var doGET = function (url, onSuccess, onError) {
            var responsePromise = $http.get(url);
            onError = onError || function () {
                alert("Problem loading data");
            };
            onSuccess = onSuccess || function(){};
            responsePromise.success(onSuccess);
            responsePromise.error(onError);
        };
        return {
            getAllCategories: function (onSuccess, onError) {
                doGET(siteUrl + '/category', onSuccess, onError);
            },

            getPraysForCategory : function(categoryId, onSuccess, onError) {
                var url = siteUrl + '/pray/list?category=' + categoryId;
                doGET(url, onSuccess, onError);
            },

            getPrayItemById : function(prayItemId, onSuccess, onError) {
                var url = siteUrl + '/pray/' + prayItemId;
                doGET(url, onSuccess, onError);
            }
        };
    });

})();

