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

    module.controller('DetailController', function ($scope, Services) {
        $scope.category = $scope.navi.getCurrentPage().options.category;
        Services.getPraysForCategory($scope.category.id, function(data) {
            $scope.prays = data;
        });
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
            }
        };
    });

})();

