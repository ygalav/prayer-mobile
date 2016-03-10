(function () {
	'use strict';
	var module = angular.module('prayer');
	module.run(function ($rootScope) {
		console.log("Running Prayer");
		$rootScope.store = Lawnchair({adapter: 'dom', name: context.storage_keys.storage_root}, function (e) {
			console.log('Storage open');
		});
	});

	module.factory('Storage', ['$rootScope', function ($rootScope) {

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
					favoritePrays.push(pray);
					$rootScope.store.save({
						key: context.storage_keys.favorite_prays,
						value: favoritePrays
					});
				});
			},

			listFavoritePrays: function () {
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
	}]);
})();
