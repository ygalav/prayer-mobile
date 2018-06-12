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
        PrayerFavoritePraysServices,
		context,
		prTextScaling,
		prLanguageService,
		prBookService,
		prAdService,
		prDSLauncherService
	) {
		//localStorage.clear();
		var appController = this;
		if (!context.systemproperties.getValue(context.systemproperties.keys.religion)) {
			context.systemproperties.setValue(context.systemproperties.keys.religion, 'greek-catholic');
		}

		if (!context.systemproperties.getValue(context.systemproperties.keys.showAds)) {
			context.systemproperties.setValue(context.systemproperties.keys.showAds, true);
		}

		appController.context = context;

		$scope.$root.textSizes = prTextScaling.calculateTextSizes();
		appController.setMenuParam = PrayerMenuService.setMenuParam;

		appController.showBannerAd = function(show) {
			prAdService.showBannerAd(show);
		};

		var reloadBooksList = function() {
			PrayerHttpService.listBooks(function(data){
				appController.books = data;
			});
		};

		$rootScope.$on('onLanguageChanged', function(event, args) {
			reloadBooksList();
			appController.localization = prLanguageService.getLocalizationBundleForLanguage(args.language);
			appController.showDSLink = args.language === LANGUAGE_CODES.Ukrainian ;
		});

		$rootScope.defineLanguage = function () {
			var dialog;
			ons.createDialog('dialog_language_chooser.html').then(
				function(aDialog) {
					dialog = aDialog;
					dialog.show();
				}
			);

			$rootScope.$on('onLanguageChosen', function (event, args) {
				if (dialog && dialog.visible) {
					dialog.hide();
				}
			});
		};

		if (prLanguageService.hasLanguageDefined()) {
			$rootScope.$emit('onLanguageChanged', {language : prLanguageService.getCurrentLanguage()});

			if (! PrayerMenuService.getMenuParam(PrayerMenuService._selectedBook)) {
				PrayerMenuService.setMenuParam(PrayerMenuService._selectedBook, prBookService.getDefaultBookIDForCurrentLanguage());
			}
		}
		else {
			$rootScope.defineLanguage();
		}

        appController.openMenu = function () {
            menu.open();
        };

        appController.closeMenu = function () {
            menu.close();
        };

        appController.launcher = {
        	goToFBGroup: function () {
                prDSLauncherService.launchApp({
                    url : CONFIGURATION.FB_PAGE_URL_SCHEME_ID
                });
            },

            openDSApp: function () {
                prDSLauncherService.launchApp({
                    url : CONFIGURATION.DSCAL_APP_URL_SCHEME_HOME_LINK,
                    appId : CONFIGURATION.DSCAL_APP_STORE_ID
                });
            }
		};
	});

	module.controller('CategoriesListController', function (
		PrayerHttpService,
		PrayerFavoritePraysServices,
		PrayerMenuService,
		prBookService,
		$log,
		$rootScope,
		$scope,
		prLanguageService,
		prAdService
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
			prAdService.showBannerAd(true);
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
			navi.pushPage('prayitems-list-page.html', { data: { category: selectedCategory } });
		};

		categoriesListController.showFavoritePray = function(prayItemId) {
			navi.pushPage('pray-item-view.html', { data: { prayItemId: prayItemId, showSaved : true} });
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

	module.controller('PraysListController', function (
		$scope,
		$rootScope,
		$log,
		PrayerHttpService,
		PrayerFavoritePraysServices,
		prAdService
	) {
			$scope.category = $scope.navi.topPage.data.category;
			PrayerHttpService.getPraysForCategory($scope.category.id, function (data) {
				_.each(data, function (prayItem) {
					prayItem.isFavorite = PrayerFavoritePraysServices.isFavorite(prayItem);
				});
				$scope.prays = data;
				$scope.isReady = true;
			});

			prAdService.showBannerAd(true);
			$scope.showPrayItem = function (prayItemId) {
				navi.pushPage('pray-item-view.html', { data : { prayItemId: prayItemId } });
			};

			$scope.addItemToFavorites = function (id) {
				PrayerFavoritePraysServices.toggleFavoritePray(id, function () {
					$log.debug("Emitting favoritePraysListChanged event");
					$rootScope.$emit('favoritePraysListChanged', {});
				});
			}
	});

	module.controller('FavoritePraysListController', function($scope, $log, PrayerFavoritePraysServices) {
		var favoritePraysList = this;
		favoritePraysList.favoritePrays = PrayerFavoritePraysServices.listFavoritePrays1();
		favoritePraysList.showFavoritePray = function(prayItemId) {
			navi.pushPage('pray-item-view.html', { data : {prayItemId: prayItemId, showSaved : true } } );
		};

		favoritePraysList.getBack = function () {
			navi.popPage();
        }
	});

	module.controller('PraysItemViewController',
			function (
				$scope,
				$log,
				PrayerHttpService,
				PrayerFavoritePraysServices,
				prTextScaling,
				context,
				prAdService
			) {
				var prayItemId = $scope.navi.topPage.data.prayItemId;
				var showSaved = $scope.navi.topPage.data.showSaved;
				if (showSaved) {
					$scope.prayItem = PrayerFavoritePraysServices.getFavoritePray(prayItemId);
				} else {
					PrayerHttpService.getPrayItemById(prayItemId, function (data) {
						$scope.prayItem = data;
					});
				}

				$scope.showTitle = function (pray, prayItem) {
					if (pray === undefined) {
						return false;
					}

					if (prayItem !== undefined) {
						if (pray.name === prayItem.name) {
							return false;
						}
					}

					return !(
						pray.style === 'COLORED_NO_TITLE' ||
						pray.style === 'NO_TITLE' ||
						pray.style === 'HTML_NO_TITLE' ||
						pray.style === 'ITALIC_NO_TITLE'
					);
				};

				$scope.getPrayStyle = function (pray) {
					if (pray === undefined) {
						return '';
					}
					if (pray.style === 'COLORED' || pray.style === 'COLORED_NO_TITLE') {
						return 'color : red;'
					}
					else if (pray.style === 'ITALIC' || pray.style === 'ITALIC_NO_TITLE') {
						return 'font-style: italic;'
					}
					return '';
				};

				$scope.scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);

				$scope.praySettings = {
                    showPraySettingsDialog : function (prayItem) {
                    	menu.load('table-of-contents.html');
						menu.toggle();
                    },


                    saveScaling : function (value) {
                        prTextScaling.saveScaling(value);
                        $scope.$root.textSizes = prTextScaling.calculateTextSizes();
                    },

                    scrollToItem : function (id) {
                        if (id !== undefined) {
                            var targetId = 'item-' + id;
                            var elem = document.getElementById(targetId).scrollIntoView();
                            if (elem !== undefined) {
                                elem.scrollIntoView();
                            }
                            else {
                                $log.error('No element found for ID ' + targetId);
                            }
                        }
                        else {
                            $log.error('No id when scrolling from table of contents to pray');
                        }
                        menu.toggle();
                    }

				};

				prAdService.showBannerAd(false);

                $scope.popPage = function () {
                    navi.popPage();
                    menu.load('menu.html');
                    appController.showBannerAd(true)
                };
			});

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

		$scope.showAds = context.systemproperties.getValue(context.systemproperties.keys.showAds, true) === 'true';

		$scope.$watch('showAds', function (newValue, oldValue, scope) {
			context.systemproperties.setValue(context.systemproperties.keys.showAds, newValue);
		});

		prLanguageService.defineLanguage(function (language) {
			$scope.language = language;
		});

		$scope.saveLanguage = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.language, value);
			$rootScope.$emit('onLanguageChanged', {language : value});
		};

		$scope.saveReligion = function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.religion, value);
		};

		$scope.showClearDataDialog = function () {
			var localization = prLanguageService.getLocalizationBundleForLanguage(prLanguageService.getCurrentLanguage());
			ons.notification.confirm({
				message: localization.tip_delete_all_data + "?",
				title: localization.button_delete_all_data,
				callback : function (value) {
				if (value == 1) {
					$scope.showAds = true; //TODO: showAds, religion and language defaults should be extracted somewhere
					//TODO: After we reset everything, we need to reset all defaults, probably make sense to
					// TODO: make this as part of $rootScope or have some event handler on appController to be sure it executes every time we need it
					localStorage.clear();
					$rootScope.defineLanguage();
				}
			}});
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

