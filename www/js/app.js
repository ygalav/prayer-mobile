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

    module.controller('DetailController', function ($scope) {
        $scope.category = $scope.navi.getCurrentPage().options.category;
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
        return {
            getAllCategories: function (onSuccess, onError) {
                var responsePromise = $http.get("http://rest.prayer.com.ua/rest/category");
                onError = onError || function () {
                    alert("Problem loading data");
                 };
                responsePromise.success(onSuccess);
                responsePromise.error(onError);
            }
        }
    });

})();

