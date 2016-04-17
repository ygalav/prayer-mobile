(function () {
	'use strict';
	var module = angular.module('PrayerServices', ['PrayerCommons']);

	module.config(function($logProvider){
		$logProvider.debugEnabled(debug.services);
	});

	module.factory('PrayerHttpService', function ($http, $timeout, $log,context, prLanguageService) {
		var siteUrl = 'http://rest.prayer.com.ua/rest';
		var doGET = function (url, onSuccess, onError) {
			var responsePromise = $http.get(url);
			onError = onError || function () {
					$log.debug("Problem loading data");
				};
			onSuccess = onSuccess || function () {
				};
			$timeout(function () {
				responsePromise.success(onSuccess);
			}, '700');
			responsePromise.error(onError);
		};
		return {
			getAllCategories: function (bookId, onSuccess, onError) {
				var url = siteUrl + "/books/" + bookId + "/categories";
				doGET(url, onSuccess, onError);
			},

			getPraysForCategory: function (categoryId, onSuccess, onError) {
				var url = siteUrl + '/pray/list?category=' + categoryId;
				doGET(url, onSuccess, onError);
			},

			getPrayItemById: function (prayItemId, onSuccess, onError) {
				var url = siteUrl + '/pray/' + prayItemId;
				doGET(url, onSuccess, onError);
			},

			listBooks : function(onSuccess, onError) {
				prLanguageService.defineLanguage(function (language) {
					var url = siteUrl + '/books?language=' + language;
					doGET(url, onSuccess, onError);
				});
			}
		};
	});

	module.factory('PrayerFavoritePraysServices', ['Storage', 'PrayerHttpService', function (Storage, PrayerHttpService) {

		var favoritePrays = [];

		return {
			listFavoritePrays: function (bookId) {
				favoritePrays = Storage.listFavoritePrays(bookId);
				return favoritePrays;
			},

			addFavoritePray: function (id) {
				PrayerHttpService.getPrayItemById(id, function (data) {
					Storage.addFavoritePray(data);
					favoritePrays.push(data)
				});
			},

			getFavoritePray: function (id) {
				return Storage.getFavoritePrayById(id);
			},

			isFavorite: function (pray) {
				return Storage.isFavorite(pray);
			}
		};
	}]);

	module.run(function ($log, $rootScope, context) {
		$rootScope.store = Lawnchair({adapter: 'dom', name: context.storage_keys.storage_root}, function (e) {
			$log.debug('Storage open: ' + context.storage_keys.storage_root);
		});
	});

	module.factory('Storage', function ($rootScope, context, prLanguageService, PrayerMenuService) {

		var getFavoritesPraysArrayFromObject = function (favoritePraysObject) {
			if (favoritePraysObject === undefined || favoritePraysObject == null
				|| favoritePraysObject.value === undefined) {
				return [];
			} else {
				return favoritePraysObject.value
			}
		};

		return {
			addFavoritePray: function (pray) {
				$rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
					var favoritePrays = getFavoritesPraysArrayFromObject(favoritePraysObject);
					console.log(pray);
					favoritePrays.push(pray);
					$rootScope.store.save({
						key: context.storage_keys.favorite_prays,
						value: favoritePrays
					});
				});
			},

			listFavoritePrays: function (bookId) {
				var prays = [];
				$rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
					var favoritePrays = getFavoritesPraysArrayFromObject(favoritePraysObject);
					prLanguageService.defineLanguage(function (language) {
						prays = _.filter(favoritePrays, function (favoritePray) {
							var isProperBook = true;
							if (bookId) {
								isProperBook = bookId === favoritePray.category.book.id;
							}
							return favoritePray.language.shortcut === language && isProperBook;
						});
					});

				});
				return prays;
			},

			getFavoritePrayById : function(id) {
				var pray = undefined;
				$rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
					var favoritePrays = getFavoritesPraysArrayFromObject(favoritePraysObject);
					var prayArrayWithMatchedPrays = _.filter(favoritePrays, function (favoritePray) {
						return favoritePray.id == id
					});
					pray = prayArrayWithMatchedPrays[0];
				});
				return pray;
			},

			isFavorite: function (pray) {
				var isFavorite = false;
				$rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
					var favoritePrays = getFavoritesPraysArrayFromObject(favoritePraysObject);
					var prayArrayWithMatchedPrays = _.filter(favoritePrays, function (favoritePray) {
						return favoritePray.id == pray.id
					});
					isFavorite = prayArrayWithMatchedPrays.length > 0;
				});
				return isFavorite;
			}
		}
	});
})();

