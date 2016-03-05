(function () {
	'use strict';
	var module = angular.module('prayer');
	module.run(function($rootScope) {
		console.log("Running Prayer");
		$rootScope.store = Lawnchair({name: context.storage_name }, function(e){
			console.log('Storage open');
		});
	});

	module.factory('Storage', ['$rootScope', function ($rootScope) {
		return {
			addFavoritePray : function(pray) {
				$rootScope.store.get(context.storage_keys.favorite_prays, function(favoritePrays) {
					if (favoritePrays == undefined) {
						favoritePrays = [];
					}

					favoritePrays.value.push(pray);
						$rootScope.store.save({
							key: context.storage_keys.favorite_prays,
							value: favoritePrays.value
						});
				})
			}
		}
	}]);
})();
