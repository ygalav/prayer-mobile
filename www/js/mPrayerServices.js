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

		return {

			/**
			 * Checks do we have favorite prays saved for book, if bookId is null then checks among all books
			 * @param bookId - bookId, if is not set, then ignored
			 * @returns {boolean} true if there are favorite books
			 */
			hasFavoritePrays: function (bookId) {
				return Storage.listFavoritePrays(bookId).length > 0;
			},

			listFavoritePrays: function (bookId) {
				$log.debug("Retrieving favorite prays for book: [" + bookId + "]");
				if (favoritePrays.length > 0) {
					return favoritePrays;
				}
				favoritePrays = Storage.listFavoritePrays(bookId);
				return favoritePrays;
			},

			addFavoritePray: function (prayItemId) {
				$log.info('Trying to add prayItem: [' + prayItemId + '] to favorites');
				if (!Storage.isFavorite(prayItemId)) {
					PrayerHttpService.getPrayItemById(prayItemId, function (data) {
						Storage.addFavoritePray(data);
						favoritePrays.push(data);
						$log.info('[' + prayItemId + ' - ' + data.name + '] is added to favorites');
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

