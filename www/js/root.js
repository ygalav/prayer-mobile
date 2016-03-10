var context = {
	systemproperties: {
		keys: {
			firstLaunch: 'firstLaunch',
			religion: 'religion',
			language: 'language',
			scaling: 'scaling'
		},

		setValue: function (key, value) {
			localStorage.setItem(key, value);
		},

		getValue: function (key, defaultValue) {
			return localStorage.getItem(key) || defaultValue;
		}
	},

	storage_keys: {
		storage_root: 'root_storage',
		favorite_prays: 'favorite-prays-storage'
	}
};

var calculateTextSizes = function () {
	var scaling_middle = 50;
	var scaling = context.systemproperties.getValue(context.systemproperties.keys.scaling, 50);
	var delta = (scaling - scaling_middle) / 50;
	/*delta value*/

	var getValueMinusDeltaPercentage = function (value, delta, scalingRate) {
		//scalingRate = scalingRate | 0.2; //TODO: Default value
		var scalingMaximumValue = value * scalingRate;

		if (delta < 0) {
			return Math.round(value - (scalingMaximumValue * delta * -1));
		}
		else if (delta == 0) {
			return value;
		} else {
			return Math.round(value + (scalingMaximumValue * delta));
		}
	};

	return {
		'pray_title_font_size': getValueMinusDeltaPercentage(18, delta, 0.3) + 'px',
		'pray_content_font_size': getValueMinusDeltaPercentage(16, delta, 0.4) + 'px',
		'menu_item_font_size': getValueMinusDeltaPercentage(18, delta, 0.3),
		'navigation_bar_font_size': getValueMinusDeltaPercentage(18, delta, 0.3)
	}
};

(function () {
	'use strict';
	var module = angular.module('prayer', ['onsen', 'ngSanitize']);
})();
