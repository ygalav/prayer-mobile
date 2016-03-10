(function () {
	'use strict';

	var module = angular.module('prayer');

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

	module.controller('MasterController', ['$scope', '$http', 'Services', 'Storage', function ($scope, $http, Services) {
		$scope.items = {};

		Services.getAllCategories(function (data) {
			$scope.items = data;
		});

		$scope.showDetail = function (selectedCategory) {
			navi.pushPage('prayitems-list-page.html', {category: selectedCategory});
		};
	}]);

	module.controller('PraysListController', function ($scope, Services, Storage) {
		$scope.category = $scope.navi.getCurrentPage().options.category;
		Services.getPraysForCategory($scope.category.id, function (data) {
			_.each(data, function (prayItem) {
				prayItem.isFavorite = Storage.isFavorite(prayItem);
			});
			$scope.prays = data;
			$scope.isReady = true;
		});

		$scope.showPrayItem = function (pray) {
			navi.pushPage('pray-item-view.html', {prayItemId: pray.id});
		};

		$scope.addItemToFavorites = function (pray) {
			Storage.addFavoritePray(pray);
			console.log(pray.id + " is added to favorites");
		}
	});

	module.controller('PraysItemViewController', function ($scope, Services) {
		var prayItemId = $scope.navi.getCurrentPage().options.prayItemId;
		Services.getPrayItemById(prayItemId, function (data) {
			$scope.prayItem = data;
		});
	});

	module.controller('FavoritePraysListController', function(Services) {
		var favoritePraysList = this;
		favoritePraysList.favoritePrays = Services.listFavoritePrays();
		favoritePraysList.getFavoritePray = function(pray) {
			console.log('getFavoritePrayById called');
		}
	});

	module.controller('SettingsPageController', function ($scope) {
		$scope.religion = context.systemproperties.getValue(
			context.systemproperties.keys.religion, 'greek-catholic'
		);

		$scope.language = context.systemproperties.getValue(context.systemproperties.keys.language, 'UA');
		$scope.scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);

		$scope.saveLanguage = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.language, value);
		};

		$scope.saveReligion = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.religion, value);
		};

		$scope.saveScaling = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.scaling, value);
			$scope.$root.textSizes = calculateTextSizes();
		};

		$scope.saveSettings = function () {
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

	/*Directives*/

	module.directive('praysList', function () {
		return {
			restrict: 'E',
			scope: {
				prayItemsList: '=prItems',
				prOnItemClickFn: '=',
				prAddOrRemoveFavoriteFn: '='
			},
			templateUrl: 'directive-praysList.html'
		};
	});
})();

