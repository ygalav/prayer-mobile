(function () {
	'use strict';

	var module = angular.module('PrayerControllers',
		[
			'onsen',
			'ngSanitize',
			'PrayerCommons',
			'PrayerServices'
		]);

	module.config(function($logProvider){
		$logProvider.debugEnabled(debug.controllers);
	});

	module.controller('AppController', function (
		$scope,
		$rootScope,
		PrayerHttpService,
		PrayerMenuService,
		context,
		prTextScaling,
		prLanguageService,
		prBookService
	) {
		var appController = this;
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

		$rootScope.$on('onLanguageChanged', function(event, args) {
			reloadBooksList();
			appController.localization = prLanguageService.getLocalizationBundleForLanguage(args.language);
		});

		if (prLanguageService.hasLanguageDefined()) {
			$rootScope.$emit('onLanguageChanged', {language : prLanguageService.getCurrentLanguage()});

			if (! PrayerMenuService.getMenuParam(PrayerMenuService._selectedBook)) {
				PrayerMenuService.setMenuParam(PrayerMenuService._selectedBook, prBookService.getDefaultBookIDForCurrentLanguage());
			}
		}
		else {
			var dialog;
			ons.createDialog('dialog_language_chooser.html').then(
				function(aDialog) {
					dialog = aDialog;
					dialog.show();
				}
			);

			$rootScope.$on('onLanguageChosen', function (event, args) {
				if (dialog && dialog.isShown()) {
					dialog.hide();
				}
			});
		}

		appController.openMenu = function () {
			menu.open();
		};

		appController.closeMenu = function () {
			menu.close();
		}
	});

	module.controller('CategoriesListController', function (
		PrayerHttpService,
		PrayerFavoritePraysServices,
		PrayerMenuService,
		prBookService,
		$log,
		$rootScope,
		prLanguageService,
		$scope
	) {
		var categoriesListController = this;
		categoriesListController.items = {};

		var displayCategories = function(bookId) {
			categoriesListController.isReady = false;

			PrayerHttpService.getAllCategories(bookId,
				function (data) {
					categoriesListController.items = data;
					categoriesListController.isReady = true;
				},
				function() {
					categoriesListController.noInternet = true;
					$log.debug("Server connection problem");
					if (PrayerFavoritePraysServices.hasFavoritePrays()) {
						categoriesListController.isReady = true;
					}
					else {
						var localization = prLanguageService.getLocalizationBundleForLanguage(prLanguageService.getCurrentLanguage());
						ons.notification.alert({
							message: localization.msg_no_internet_and_saved_prays,
							title: localization.msg_no_internet_and_saved_prays_title,
							modifier: 'material'
						});
					}
				}
			);
		};

		if (prLanguageService.hasLanguageDefined()) {
			var selectedBookId = PrayerMenuService.getMenuParam(PrayerMenuService._selectedBook);
			displayCategories(selectedBookId);
			categoriesListController.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays1(
				{
					bookId : selectedBookId
				}
			);
		}

		$rootScope.$on('onLanguageChanged', function(event, args) {
			var bookId = prBookService.getDefaultBookIDForCurrentLanguage();
			PrayerMenuService.setMenuParam(PrayerMenuService._selectedBook, bookId);
			displayCategories(PrayerMenuService.getMenuParam(PrayerMenuService._selectedBook));
			categoriesListController.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays1({bookId : bookId});
		});

		$rootScope.$on('favoritePraysListChanged', function () {
			$log.debug('Event [favoritePraysListChanged]: Updating list of favorite prays');
			categoriesListController.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays1(
				{
					bookId : PrayerMenuService.getMenuParam(PrayerMenuService._selectedBook)
				}
			);
		});

		/*
		 * if given group is the selected group, deselect it
		 * else, select the given group
		 */
		categoriesListController.categoriesShown = true;
		categoriesListController.toggleGroup = function() {
			categoriesListController.categoriesShown = !categoriesListController.categoriesShown;
		};

		categoriesListController.isGroupShown = function() {
			return categoriesListController.categoriesShown;
		};

		categoriesListController.showDetail = function (selectedCategory) {
			navi.pushPage('prayitems-list-page.html', {data: {category: selectedCategory}});
		};

		categoriesListController.showFavoritePray = function(prayItemId) {
			navi.pushPage('pray-item-view.html', {
				data: {
					prayItemId: prayItemId,
					showSaved : true
				}
			});
		};

		categoriesListController.deleteSavedPrays = function () {
			ons.notification.confirm({
				message: 'Are you sure you want to continue?',
				callback: function(idx) {
					switch (idx) {
						case 0:
							break;
						case 1:
							PrayerFavoritePraysServices.deleteAll();
							categoriesListController.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays1(
								{
									bookId: selectedBookId
								}
							);
							$scope.$apply();
							break;
					}
				}
			});
		}
	});

	module.controller('languageChooserController', function (
		$rootScope,
		prLanguageService
	) {
		var lcc = this;
		lcc.chooseLanguage = function (languageCode) {
			prLanguageService.setCurrentLanguage(languageCode);
			$rootScope.$emit('onLanguageChanged', {language : languageCode});
			$rootScope.$emit('onLanguageChosen', {});
		}

	});

	module.controller('PraysListController', ['$scope', 'PrayerHttpService' , 'PrayerFavoritePraysServices',
		function ($scope, PrayerHttpService, PrayerFavoritePraysServices) {
			var praysListController = this;
			praysListController.prays={};
			praysListController.category = navi.topPage.data.category;
			PrayerHttpService.getPraysForCategory(praysListController.category.id, function (data) {
				_.each(data, function (prayItem) {
					prayItem.isFavorite = PrayerFavoritePraysServices.isFavorite(prayItem);
				});
				praysListController.prays = data;
				praysListController.isReady = true;
			});

			praysListController.showPrayItem = function (prayItemId) {
				navi.pushPage('pray-item-view.html', {
					data: {
						prayItemId: prayItemId
					}
				});
			};


			praysListController.addItemToFavorites = function (id) {
				PrayerFavoritePraysServices.addFavoritePray(id, function () {
					$scope.$emit('favoritePraysListChanged', {});
				});
			}
	}]);

	module.controller('FavoritePraysListController', function(PrayerFavoritePraysServices) {
		var favoritePraysList = this;
		favoritePraysList.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays1();
		favoritePraysList.showFavoritePray = function(prayItemId) {
			navi.pushPage('pray-item-view.html', {prayItemId: prayItemId, showSaved : true});
		}
	});

	//
	module.controller('PraysItemViewController',
		[
			'$scope',
			'PrayerHttpService' ,
			'PrayerFavoritePraysServices',
			function ($scope, PrayerHttpService, PrayerFavoritePraysServices) {
				var prayItemId = navi.topPage.data.prayItemId;
				var showSaved = navi.topPage.data.showSaved;
				if (showSaved) {
					$scope.prayItem = PrayerFavoritePraysServices.getFavoritePray(prayItemId);
				} else {
					PrayerHttpService.getPrayItemById(prayItemId, function (data) {
						$scope.prayItem = data;
					});
				}
			}
		]);

	module.controller('SettingsPageController', function (
		$scope,
		$rootScope,
		context,
		prTextScaling,
		prLanguageService
	) {
		$scope.religion = context.systemproperties.getValue(
			context.systemproperties.keys.religion, 'greek-catholic'
		);

		prLanguageService.defineLanguage(function (language) {
			$scope.language = language;
		});

		$scope.scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);

		$scope.saveLanguage = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.language, value);
			$rootScope.$emit('onLanguageChanged', {language : value});
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
		//TODO: This directive is deprecated, consider to delete it
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'directive-noContent.html'
		};
	});

})();

