(function () {
	'use strict';

	var module = angular.module('PrayerControllers',
		[
			'onsen',
			'ngSanitize',
			'PrayerCommons',
			'PrayerServices'
		]);

	module.controller('AppController', function (
		$scope,
		PrayerHttpService,
		PrayerMenuService,
		context,
		prTextScaling,
		prLanguageService
	) {
		prLanguageService.defineLanguage();
		var appController = this;
		prLanguageService.defineLanguage();
		appController.localization = prLanguageService.getLocalizationBundleForLanguage(prLanguageService.getCurrentLanguage());

		if (!context.systemproperties.getValue(context.systemproperties.keys.religion)) {
			context.systemproperties.setValue(context.systemproperties.keys.religion, 'greek-catholic');
		}
		appController.context = context;

		$scope.$root.textSizes = prTextScaling.calculateTextSizes();
		appController.setMenuParam = PrayerMenuService.setMenuParam;



		var reloadBooksList = function() {
			PrayerHttpService.listBooks(function(data){
				appController.books = data;
			});
		};

		reloadBooksList();
		$scope.$on('onLanguageChanged', function(event, args) {
			reloadBooksList();
			appController.localization = prLanguageService.getLocalizationBundleForLanguage(prLanguageService.getCurrentLanguage());
		});

		function setLanguage() {
			navigator.globalization.getPreferredLanguage(
				function (language) {
					appController.deviceLanguage = language.value;
				},
				function () {alert('Error getting language\n');}
			);
		}
		setLanguage();
	});

	module.controller('CategoriesListController', function (
		PrayerHttpService,
		PrayerFavoritePraysServices,
		PrayerMenuService,
		prBookService
	) {
		var categoriesListController = this;
		categoriesListController.items = {};
		categoriesListController.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays();

		var selectedBook = PrayerMenuService.getMenuParam(PrayerMenuService._selectedBook);


		selectedBook = selectedBook ? selectedBook : prBookService.getDefaultBookIDForCurrentLanguage();
		PrayerHttpService.getAllCategories(selectedBook,
			function (data) {
				categoriesListController.items = data;
			},
			function() {
				alert("Момитлка зєднання з сервером");
				navi.replacePage('favorite-prays-list.html');
			}
		);

		/*
		 * if given group is the selected group, deselect it
		 * else, select the given group
		 */
		categoriesListController.categoriesShown = true;
		categoriesListController.toggleGroup = function() {
			console.log('Toggle Group');
			categoriesListController.categoriesShown = !categoriesListController.categoriesShown;
		};

		categoriesListController.isGroupShown = function() {
			return categoriesListController.categoriesShown;
		};

		categoriesListController.showDetail = function (selectedCategory) {
			navi.pushPage('prayitems-list-page.html', {category: selectedCategory});
		};

		categoriesListController.showFavoritePray = function(prayItemId) {
			navi.pushPage('pray-item-view.html', {prayItemId: prayItemId, showSaved : true});
		}
	});

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

	module.controller('SettingsPageController', function ($scope, context, prTextScaling, prLanguageService) {
		$scope.religion = context.systemproperties.getValue(
			context.systemproperties.keys.religion, 'greek-catholic'
		);

		$scope.language = prLanguageService.getCurrentLanguage();
		$scope.scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);

		$scope.saveLanguage = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.language, value);
			$scope.$emit('onLanguageChanged', []);
		};

		$scope.saveReligion = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.religion, value);
		};

		$scope.saveScaling = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.scaling, value);
			$scope.$root.textSizes = prTextScaling.calculateTextSizes();
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

