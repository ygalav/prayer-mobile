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
					scaling: 'scaling',
					showAds: 'showAds'
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
				'pray_title_font_size': getValueMinusDeltaPercentage(18, delta, 0.6) + 'px',
				'pray_content_font_size': getValueMinusDeltaPercentage(16, delta, 0.6) + 'px',
				'menu_item_font_size': getValueMinusDeltaPercentage(18, delta, 0.4),
				'navigation_bar_font_size': getValueMinusDeltaPercentage(18, delta, 0.4)
			}
		},

		saveScaling : function (value) {
			context.systemproperties.setValue(context.systemproperties.keys.scaling, value);
		}
	}
	});
})();

PrayerLocalizations = {
	en : {
		categories_list_page_title : "Catholic Prayer",
		categories : 'Categories',
		books : 'Books',
		choosen_prays : 'Choosen prays',
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
		button_delete_all_saved_prays : 'Delete All Saved prays',
		button_delete_all_data : 'Delete stored data',
		tip_delete_all_data : 'Erase all settings. Delete all saved prays and settings',
		no_internet_label : 'No internet connection',
		msg_no_internet_and_saved_prays : "You do not have saved prays and internet connection does not exist, please connect to the internet to continue using Prayer",
		msg_no_internet_and_saved_prays_title : "Can't load data"
	},
	ua : {
		categories_list_page_title : "Молитовник",
		categories : 'Категорії',
		books : 'Книги',
		choosen_prays : 'Обрані Молитви',
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
		button_delete_all_saved_prays : 'Видалити всі обрані Молитви',
		button_delete_all_data : 'Видалити збережені дані',
		tip_delete_all_data : 'Видалити всі збережені налаштування молитовника. Будуть видалені збережені молитви та налаштування',
		no_internet_label : 'Немає звязку з сервером',
		msg_no_internet_and_saved_prays : "Інтернет з'єднання відсутнє, підключіться до інтернет для продовження користування молитовником",
		msg_no_internet_and_saved_prays_title : "Неможливо завантажити дані"
	},
	pl : {
		categories_list_page_title : "Modlitewnik",
		categories : 'Kategorie',
		books : 'Książki',
		choosen_prays : 'Moje Modlitwy',
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
		button_delete_all_saved_prays : 'Usuń wszystkie zapisane Modlitwy',
		button_delete_all_data : 'Usuń dane i ustawieńia',
		tip_delete_all_data : 'Usuń wszystkie dane i ustawienia z modlitewnika. Spowoduje usunięcie wszystkich zapisanych modlitew i ustawień',
		no_internet_label : 'Brak połączenia z internetem',
		msg_no_internet_and_saved_prays : "You do not have saved prays and internet connection does not exist, please connect to the internet to continue using Prayer",
		msg_no_internet_and_saved_prays_title : "Can't load data"
	},

	ru : {
		categories_list_page_title : "Молитвенник",
		categories : 'Категории',
		books : 'Книги',
		choosen_prays : 'Избранные Молитвы',
		settings : "Настройки",
		settings_setting_who_am_i : "Кто Я: ",
		settings_setting_who_am_i_catholic : "Католик",
		settings_setting_who_am_i_greek_catholic : "Греко-Католик",
		settings_setting_language : "Язык молитв:",
		settings_setting_text_size : "Размер шрифта:",
		settings_setting_text_size_header_title : "Заголовок молитвы:",
		settings_setting_text_size_header_example : "Молитва: Отче Наш",
		settings_setting_text_size_content_title : "Текст молитвы:",
		settings_setting_text_size_content_example : "Отче наш, Иже еси́ на небесе́х!...",
		settings_save : "Сохранить",
		prays_list_title : 'Молитвы',
		prays_list_prays_quantity : 'Молитов:',
		button_back : 'Назад',
		button_delete_all_saved_prays : 'Удалить все избранные молитвы',
		button_delete_all_data : 'Удалить сохраненные данные',
		tip_delete_all_data : 'Удалить все данные и настройки из молитвенника. Будут удалены все сохраненные молитвы и настройки',
		no_internet_label : 'Нет связи с сервером',
		msg_no_internet_and_saved_prays : "Интернет соединение отсутствует, подключитесь к интернет для продолжения пользования молитвенником",
		msg_no_internet_and_saved_prays_title : "Невозможно загрузить данные"
	}
};

debug = {
	services : true,
	controllers : true
};
