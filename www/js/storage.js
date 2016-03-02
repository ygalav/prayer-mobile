(function () {
	'use strict';
	var module = angular.module('prayer');
	module.run(function($rootScope) {
		console.log("Running Prayer");
		$rootScope.store = Lawnchair({name: context.storage_name }, function(e){
			console.log('Storage open');
		});
	});
})();
