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

	module.factory('PrayerFavoritePraysServices', function ($log, Storage, PrayerHttpService) {

		var favoritePrays = [];

		var filterByBookAndLanguage = function (prays, bookId, language) {
			if (!prays) {
				return [];
			}

			return _.filter(prays, function (pray) {
				var isProperBook = true;
				if (bookId) {
					isProperBook = bookId === pray.category.book.id;
				}

				var isProperLanguage = true;
				if (language) {
					isProperLanguage = pray.language.shortcut === language;
				}

				return isProperLanguage && isProperBook;
			});
		};

		return {

			/**
			 * Checks do we have favorite prays saved for book, if bookId is null then checks among all books
			 * @param bookId - bookId, if is not set, then ignored
			 * @returns {boolean} true if there are favorite books
			 */
			hasFavoritePrays: function (bookId) {
				return Storage.listFavoritePrays1({bookId : bookId}).length > 0;
			},

			listFavoritePrays1: function (params) {
				var bookId = params ? params.bookId : undefined;
				var language = params ? params.language : undefined;
				$log.debug("Retrieving favorite prays for book: [" + bookId + "]");
				if (favoritePrays.length == 0) {
					favoritePrays = Storage.listFavoritePrays1();
				}
				return filterByBookAndLanguage(favoritePrays, bookId, language);
			},

			addFavoritePray: function (prayItemId, onSuccess) {
				$log.info('Trying to add prayItem: [' + prayItemId + '] to favorites');
				if (!Storage.isFavorite(prayItemId)) {
					PrayerHttpService.getPrayItemById(prayItemId, function (data) {
						Storage.addFavoritePray(data);
						favoritePrays.push(data);
						$log.info('[' + prayItemId + ' - ' + data.name + '] is added to favorites');
						if (onSuccess && _.isFunction(onSuccess)) {
							onSuccess();
						}
					});
				}
				else {
					$log.info('PrayItem: [' + prayItemId + '] already added to favorites');
				}
			},

			getFavoritePray: function (id) {
				//TODO: This also should use cached data
				return Storage.getFavoritePrayById(id);
			},

			isFavorite: function (pray) {
				return Storage.isFavorite(pray.id);
			},

			deleteAll : function (language) {
				Storage.deleteAll(language);
				favoritePrays = [];
			}
		};
	});
})();

