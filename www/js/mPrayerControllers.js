(function () {
	'use strict';

	var module = angular.module('PrayerControllers',
		[
			'onsen',
			'ngSanitize',
			'PrayerServices'
		]);

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

	module.controller('MasterController', ['$scope', 'PrayerHttpService', function ($scope, PrayerHttpService) {
		$scope.items = {};

		PrayerHttpService.getAllCategories(function (data) {
			$scope.items = data;
		});

		$scope.showDetail = function (selectedCategory) {
			navi.pushPage('prayitems-list-page.html', {category: selectedCategory});
		};
	}]);

	module.controller('PraysListController', ['$scope', 'PrayerHttpService' , 'PrayerFavoritePraysServices',
		function ($scope, PrayerHttpService, PrayerFavoritePraysServices) {
			$scope.category = $scope.navi.getCurrentPage().options.category;
			PrayerHttpService.getPraysForCategory($scope.category.id, function (data) {
				_.each(data, function (prayItem) {
					prayItem.isFavorite = PrayerFavoritePraysServices.isFavorite(prayItem);
				});
				$scope.prays = data;
				$scope.isReady = true;
			});

			$scope.showPrayItem = function (prayItemId) {
				navi.pushPage('pray-item-view.html', {prayItemId: prayItemId});
			};

			$scope.addItemToFavorites = function (id) {
				PrayerFavoritePraysServices.addFavoritePray(id);
				console.log(id + " is added to favorites");
			}
	}]);

	module.controller('PraysItemViewController',
		[
			'$scope',
			'PrayerHttpService' ,
			'PrayerFavoritePraysServices',
			function ($scope, PrayerHttpService, PrayerFavoritePraysServices) {
				var prayItemId = $scope.navi.getCurrentPage().options.prayItemId;
				var showSaved = $scope.navi.getCurrentPage().options.showSaved;
				if (showSaved) {
					$scope.prayItem = PrayerFavoritePraysServices.getFavoritePray(prayItemId);
				} else {
					PrayerHttpService.getPrayItemById(prayItemId, function (data) {
						$scope.prayItem = data;
					});
				}
			}
		]);

	module.controller('FavoritePraysListController', function(PrayerFavoritePraysServices) {
		var favoritePraysList = this;
		favoritePraysList.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays();
		favoritePraysList.showFavoritePray = function(prayItemId) {
			navi.pushPage('pray-item-view.html', {prayItemId: prayItemId, showSaved : true});
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

	module.directive('noContent', function () {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'directive-noContent.html'
		};
	});

})();

