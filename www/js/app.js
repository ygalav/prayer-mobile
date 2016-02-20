(function () {
    'use strict';

		var context = {
			systemproperties: {
				keys: {
					firstLaunch: 'firstLaunch',
					religion : 'religion',
					language : 'language',
					scaling : 'scaling'
				},

				setValue: function(key, value){
					localStorage.setItem(key, value);
				},

				getValue: function(key, defaultValue){
					return localStorage.getItem(key) || defaultValue;
				}
			}
		};

	var valuesCalculator = function() {
		var scaling_middle = 50;
		var scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);
		var pray_title_size = 16;
		var delta = (scaling - scaling_middle) / 50; /*delta value*/

		var getValueMinusDeltaPercentage = function(value, delta) {
			if (delta < 0) {
				return value - (value * delta * -1);
			}
			else if (delta == 0) {
				return value;
			} else {
				return value - (value * delta);
			}
		};
	};

    var module = angular.module('app', ['onsen', 'ngSanitize']);

    module.controller('AppController', function ($scope) {
			if (!context.systemproperties.getValue(context.systemproperties.keys.language)) {
				context.systemproperties.setValue(context.systemproperties.keys.language, 'UA');
			}
			if (!context.systemproperties.getValue(context.systemproperties.keys.religion)) {
				context.systemproperties.setValue(context.systemproperties.keys.religion, 'greek-catholic');
			}
			$scope.context = context;
    });

    module.controller('MasterController', ['$scope', '$http', 'Services', function ($scope, $http, Services) {
			$scope.items = {};

			Services.getAllCategories(function(data) {
					$scope.items = data;
			});

			$scope.showDetail = function (selectedCategory) {
					navi.pushPage('prayitems-list-page.html', {category: selectedCategory});
			};
    }]);

    module.controller('PraysListController', function ($scope, Services) {
        $scope.category = $scope.navi.getCurrentPage().options.category;
        Services.getPraysForCategory($scope.category.id, function(data) {
            $scope.prays = data;
            $scope.isReady=true;
        });

        $scope.showPrayItem = function (pray) {
            navi.pushPage('pray-item-view.html', {prayItemId: pray.id});
        };
    });

    module.controller('PraysItemViewController', function ($scope, Services) {
        var prayItemId = $scope.navi.getCurrentPage().options.prayItemId;
        Services.getPrayItemById(prayItemId, function(data) {
            $scope.prayItem = data;
        });
    });

		module.controller('SettingsPageController', function ($scope) {
			$scope.religion = context.systemproperties.getValue(
				context.systemproperties.keys.religion, 'greek-catholic'
			);

			$scope.language = context.systemproperties.getValue(context.systemproperties.keys.language, 'UA');
			$scope.scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);

			$scope.saveLanguage = function(value) {
				context.systemproperties.setValue(context.systemproperties.keys.language, value);
			};

			$scope.saveReligion = function(value) {
				context.systemproperties.setValue(context.systemproperties.keys.religion, value);
			};

			$scope.saveScaling = function(value) {
				context.systemproperties.setValue(context.systemproperties.keys.scaling, value);
			};

			$scope.saveSettings = function() {
				if ($scope.language) {
					context.systemproperties.setValue(context.systemproperties.keys.language, $scope.language);
				} else {
					alert('Please set Language');
					return;
				}

				if ($scope.religion) {
					context.systemproperties.setValue(context.systemproperties.keys.religion, $scope.religion);
				} else {
					alert('Please set Religion');
					return;
				}
				context.systemproperties.setValue(context.systemproperties.keys.firstLaunch, false);
				navi.popPage();
			}
		});

    module.factory('Services', function ($http, $timeout) {
        var siteUrl = 'http://rest.prayer.com.ua/rest';
        var doGET = function (url, onSuccess, onError) {
            var responsePromise = $http.get(url);
            onError = onError || function () {
                alert("Problem loading data");
            };
            onSuccess = onSuccess || function(){};
            $timeout(function(){
                responsePromise.success(onSuccess);
            },'700');
            responsePromise.error(onError);
        };
        return {
            getAllCategories: function (onSuccess, onError) {
							var language = context.systemproperties.getValue(context.systemproperties.keys.language, 'UA');
                doGET(siteUrl + '/category?language=' + language, onSuccess, onError);
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

