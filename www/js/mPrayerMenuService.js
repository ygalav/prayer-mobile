(function () {
	'use strict';
	var module = angular.module('PrayerServices');

	module.factory('PrayerMenuService', function() {
		var menuParams = {};

		return {
			setMenuParam : function(key, value) {
				menuParams[key] = value;
			},
			getMenuParam : function(key) {
				return menuParams[key];
			},
			_selectedBook : 'selectedBook'
		}
	})
})();