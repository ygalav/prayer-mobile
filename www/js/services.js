(function () {
	'use strict';
	var module = angular.module('prayer');
	module.factory('Services', function ($http, $timeout, Storage) {
		var siteUrl = 'http://rest.prayer.com.ua/rest';
		var doGET = function (url, onSuccess, onError) {
			var responsePromise = $http.get(url);
			onError = onError || function () {
					alert("Problem loading data");
				};
			onSuccess = onSuccess || function () {
				};
			$timeout(function () {
				responsePromise.success(onSuccess);
			}, '700');
			responsePromise.error(onError);
		};
		return {
			getAllCategories: function (onSuccess, onError) {
				var language = context.systemproperties.getValue(context.systemproperties.keys.language, 'UA');
				doGET(siteUrl + '/category?language=' + language, onSuccess, onError);
			},

			getPraysForCategory: function (categoryId, onSuccess, onError) {
				var url = siteUrl + '/pray/list?category=' + categoryId;
				doGET(url, onSuccess, onError);
			},

			getPrayItemById: function (prayItemId, onSuccess, onError) {
				var url = siteUrl + '/pray/' + prayItemId;
				doGET(url, onSuccess, onError);
			},

			listFavoritePrays : function() {
				return Storage.listFavoritePrays();
			}
		};
	});
})();
