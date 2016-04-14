(function () {
	'use strict';
	var module = angular.module('PrayerCommons', []);

	module.factory('context', function() { //TODO: Context rename to sth like prContext
		return {
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
		}
	});

	module.factory('prTextScaling', function(context) {
		return {
			calculateTextSizes : function () {
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
		}
	}
	});
})();

PrayerLocalizations = {
	en : {
		categories_list_page_title : "Catholic Prayer",
		categories : 'Categories',
		settings : "Settings",
		settings_setting_who_am_i : "I am: ",
		settings_setting_who_am_i_catholic : "Catholic",
		settings_setting_who_am_i_greek_catholic : "Greek-Catholic",
		settings_setting_language : "Language:",
		settings_setting_text_size : "Text size:",
		settings_setting_text_size_header_title : "Pray title:",
		settings_setting_text_size_header_example : "Pray: Our Father",
		settings_setting_text_size_content_title : "Pray text:",
		settings_setting_text_size_content_example : "Our Father, Who is in heaven!...",
		settings_save : 'Save',
		prays_list_title : 'Prays',
		prays_list_prays_quantity : 'Prays:',
		button_back : 'Back',
		no_internet_label : 'No internet connection'
	},
	ua : {
		categories_list_page_title : "Молитовник",
		categories : 'Категорії',
		settings : "Налаштування",
		settings_setting_who_am_i : "Хто Я: ",
		settings_setting_who_am_i_catholic : "Католик",
		settings_setting_who_am_i_greek_catholic : "Греко-Католик",
		settings_setting_language : "Мова молитов:",
		settings_setting_text_size : "Розмір тексту:",
		settings_setting_text_size_header_title : "Заголовок молитви:",
		settings_setting_text_size_header_example : "Молитва: Отче Наш",
		settings_setting_text_size_content_title : "Текст молитви:",
		settings_setting_text_size_content_example : "Отче наш, що є на небесах!...",
		settings_save : "Зберегти",
		prays_list_title : 'Молитви',
		prays_list_prays_quantity : 'Молитов:',
		button_back : 'Назад',
		no_internet_label : 'Немає звязку з сервером'
	},
	pl : {
		categories_list_page_title : "Modlitewnik",
		categories : 'Kategorie',
		settings : "Ustawienia",
		settings_setting_who_am_i : "Jestem: ",
		settings_setting_who_am_i_catholic : "Katolik",
		settings_setting_who_am_i_greek_catholic : "Greko-Katolik",
		settings_setting_language : "Modlitwy:",
		settings_setting_text_size : "Rozmiar czcionki:",
		settings_setting_text_size_header_title : "Tytuł modlitwy:",
		settings_setting_text_size_header_example : "Modlitwa: Ojcze Nasz",
		settings_setting_text_size_content_title : "Tekst Modlitwy:",
		settings_setting_text_size_content_example : "Ojcze nasz, któryś jest w niebie!...",
		settings_save : "Zapisz",
		prays_list_title : 'Prays',
		prays_list_prays_quantity : 'Modlitwy:',
		button_back : 'Zwrocz',
		no_internet_label : 'Brak połączenia z internetem'
	}
}

debug = {
	services : true,
	controllers : true
};
