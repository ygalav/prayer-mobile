var context = {
	systemproperties: {
		keys: {
			firstLaunch: 'firstLaunch',
			religion: 'religion',
			language: 'language',
			scaling: 'scaling'
		},

		setValue: function (key, value) {
			localStorage.setItem(key, value);
		},

		getValue: function (key, defaultValue) {
			return localStorage.getItem(key) || defaultValue;
		}
	},

	storage_name : 'prays-storage'
};

(function () {
    'use strict';

	var calculateTextSizes = function() {
		var scaling_middle = 50;
		var scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);
		var delta = (scaling - scaling_middle) / 50; /*delta value*/

		var getValueMinusDeltaPercentage = function(value, delta, scalingRate) {
			//scalingRate = scalingRate | 0.2; //TODO: Default value
			var scalingMaximumValue = value * scalingRate;

			if (delta < 0) {
				return Math.round(value - (scalingMaximumValue * delta * -1));
			}
			else if (delta == 0) {
				return value;
			} else {
				return Math.round(value + (scalingMaximumValue * delta));
			}
		};

		return {
			'pray_title_font_size' : getValueMinusDeltaPercentage(18, delta, 0.3) + 'px',
			'pray_content_font_size' : getValueMinusDeltaPercentage(16, delta, 0.4) + 'px',
			'menu_item_font_size' : getValueMinusDeltaPercentage(18, delta, 0.3),
			'navigation_bar_font_size' : getValueMinusDeltaPercentage(18, delta, 0.3)
		}
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

			$scope.$root.textSizes = calculateTextSizes();
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
				$scope.$root.textSizes = calculateTextSizes();
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

