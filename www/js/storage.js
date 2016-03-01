(function () {
	'use strict';
	var module = angular.module('app');
	module.run(function($rootScope) {
		console.log("Running Prayer");
		$rootScope.store = Lawnchair({name: context.storage_name }, function(e){
			console.log('Storage open');
		});
	});
})();
