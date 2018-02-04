var module = angular.module('PrayerServices');

module.run(function ($log, $rootScope, context) {
	$rootScope.store = Lawnchair({adapter: 'dom', name: context.storage_keys.storage_root}, function (e) {
		$log.debug('Storage open: ' + context.storage_keys.storage_root);
	});
});

/**
 * http://rest.prayer.com.ua/rest/pray/4 - example of pray json object
 */
module.factory('Storage', function ($rootScope, $log,  context, prLanguageService) {

	var getFavoritesPraysArrayFromObject = function (favoritePraysObject) {
		if (favoritePraysObject === undefined || favoritePraysObject === null
			|| favoritePraysObject.value === undefined) {
			return [];
		} else {
			return favoritePraysObject.value
		}
	};

	/**
	 * @param array an {Array} object
	 */
	var save = function (array) {
		$rootScope.store.save({
			key: context.storage_keys.favorite_prays,
			value: array
		})
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

		removeFromFavorite: function (id, callback) {
			$log.debug('Removing pray [' + id + '] from favorites');
            $rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
                var favoritePrays = getFavoritesPraysArrayFromObject(favoritePraysObject);
                $log.debug('Total prays stored as favorite:', favoritePrays.length);
                var filteredPrays = _.filter(favoritePrays, function (favoritePray) {
                    return favoritePray.id !== id
                });
                save(filteredPrays);
                $log.debug('Prays left after removing:', filteredPrays.length);
                if (callback && _.isFunction(callback)) {
                    $log.debug('Performing onremove callback');
                    callback();
                }
            });
        },

		listFavoritePrays1: function () {
			var prays = [];
			$rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
				prays = getFavoritesPraysArrayFromObject(favoritePraysObject);
			});
			return prays;
		},

        listFavoritePraysWithCallback: function (callback) {
            var prays = [];
            $rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
                prays = getFavoritesPraysArrayFromObject(favoritePraysObject);
                callback(prays)
            });
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

		isFavorite: function (prayId) {
			var isFavorite = false;
			$rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
				var favoritePrays = getFavoritesPraysArrayFromObject(favoritePraysObject);
				var prayArrayWithMatchedPrays = _.filter(favoritePrays, function (favoritePray) {
					return favoritePray.id == prayId;
				});
				isFavorite = prayArrayWithMatchedPrays.length > 0;
			});
			return isFavorite;
		},

		deleteAll: function (language) {
			if (!language) {
				save([])
			}
			else {
				$rootScope.store.get(context.storage_keys.favorite_prays, function (favoritePraysObject) {
					var favoritePrays = getFavoritesPraysArrayFromObject(favoritePraysObject);
					var praysExceptLanguage = _.filter(favoritePrays, function (favoritePray) {
						return favoritePray.language.shortcut != language;
					});
					save(praysExceptLanguage)
				});
			}
		}
	}
});