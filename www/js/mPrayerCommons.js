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
				'menu_item_settings_font_size': getValueMinusDeltaPercentage(16, delta, 0.4),
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
		choosen_prays : 'Chosen prays',
        chosen_prays_empty : 'No chosen prays saved',
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
		settings_button_ads_switch : 'Show Ads',
		button_delete_all_saved_prays : 'Delete All Saved prays',
		button_delete_all_data : 'Delete stored data',
		tip_delete_all_data : 'Erase all settings. Delete all saved prays and settings',
		settings_tip_why_show_ads : 'By showing ads you support prayer in all its financial needs for application support. Thank You!',
		no_internet_label : 'No internet connection',
		msg_no_internet_and_saved_prays : "You do not have saved prays and internet connection does not exist, please connect to the internet to continue using Prayer",
		msg_no_internet_and_saved_prays_title : "Can't load data",

        pray_item_view_item_settings_btn_close : "Close",
        pray_item_view_item_settings_header_table_of_contents : "Table of Contents",
        pray_item_view_item_settings_header_change_font_size : "Change Font Size"
	},
	ua : {
		categories_list_page_title : "Молитовник",
		categories : 'Категорії',
		books : 'Книги',
		choosen_prays : 'Обрані Молитви',
        chosen_prays_empty : 'Немає збережених молитв',
		settings : "Налаштування",
		menu_item_ds_cal : "ДивенСвіт Календар УГКЦ",
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
		settings_button_ads_switch : 'Показувати рекламу',
		button_delete_all_saved_prays : 'Видалити всі обрані Молитви',
		button_delete_all_data : 'Видалити збережені дані',
		tip_delete_all_data : 'Видалити всі збережені налаштування молитовника. Будуть видалені збережені молитви та налаштування',
		settings_tip_why_show_ads : 'Дозволивши показ реклами в Молитовнику ви допомагаєте розробникам покривати всі супутні витрати на обслуговування додатку, а також сприяєте його розвитку. Дякуємо Вам!',
		no_internet_label : 'Немає звязку з сервером',
		msg_no_internet_and_saved_prays : "Інтернет з'єднання відсутнє, підключіться до інтернет для продовження користування молитовником",
		msg_no_internet_and_saved_prays_title : "Неможливо завантажити дані",

		pray_item_view_item_settings_btn_close : "Закрити",
		pray_item_view_item_settings_header_table_of_contents : "Зміст Молитви",
		pray_item_view_item_settings_header_change_font_size : "Змінити розмір тексту",
        ds_modal_install_app_title : "Встановити ДС календар",
        ds_modal_install_app_message : "Схоже ви ще не встановити Дивен Світ Календар, чи бажаєте встановити?",
		ds_modal_install_app_yes : "Так",
		ds_modal_install_app_no : "Ні, не бажаю"

	},
	pl : {
		categories_list_page_title : "Modlitewnik",
		categories : 'Kategorie',
		books : 'Książki',
		choosen_prays : 'Moje Modlitwy',
        chosen_prays_empty : 'Pusta lista',
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
		settings_button_ads_switch : 'Wyświetlać reklamy',
		button_delete_all_saved_prays : 'Usuń wszystkie zapisane Modlitwy',
		button_delete_all_data : 'Usuń dane i ustawieńia',
		tip_delete_all_data : 'Usuń wszystkie dane i ustawienia z modlitewnika. Spowoduje usunięcie wszystkich zapisanych modlitew i ustawień',
		settings_tip_why_show_ads : 'By showing ads you support prayer in all its financial needs for application support. Thank You!',
		no_internet_label : 'Brak połączenia z internetem',
		msg_no_internet_and_saved_prays : "You do not have saved prays and internet connection does not exist, please connect to the internet to continue using Prayer",
		msg_no_internet_and_saved_prays_title : "Can't load data",

        pray_item_view_item_settings_btn_close : "Zamknij",
        pray_item_view_item_settings_header_table_of_contents : "Treść",
        pray_item_view_item_settings_header_change_font_size : "Zmień rozmiar tekstu"
	},

	ru : {
		categories_list_page_title : "Молитвенник",
		categories : 'Категории',
		books : 'Книги',
		choosen_prays : 'Избранные Молитвы',
        chosen_prays_empty : 'Нет избранных молитв',
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
		settings_button_ads_switch : 'Показывать рекламу',
		button_delete_all_saved_prays : 'Удалить все избранные молитвы',
		button_delete_all_data : 'Удалить сохраненные данные',
		tip_delete_all_data : 'Удалить все данные и настройки из молитвенника. Будут удалены все сохраненные молитвы и настройки',
		settings_tip_why_show_ads: 'Позволив показ рекламы в Молитвеннике вы помогаете разработчикам покрывать все сопутствующие расходы на обслуживание приложения, а также способствуете его развитию. Спасибо Вам!',
		no_internet_label : 'Нет связи с сервером',
		msg_no_internet_and_saved_prays : "Интернет соединение отсутствует, подключитесь к интернет для продолжения пользования молитвенником",
		msg_no_internet_and_saved_prays_title : "Невозможно загрузить данные",

        pray_item_view_item_settings_btn_close : "Закрыть",
        pray_item_view_item_settings_header_table_of_contents : "Содержание",
        pray_item_view_item_settings_header_change_font_size : "Изменить Размер Шрифта"
	}
};

debug = {
	services : true,
	controllers : true
};

CONFIGURATION = {
	DSCAL_APP_STORE_LINK : "https://itunes.apple.com/us/app/id920044446",
	DSCAL_APP_STORE_ID : "id920044446",
	DSCAL_APP_URL_SCHEME_HOME_LINK : "dscal://"
};

LANGUAGE_CODES = {
	Ukrainian : "UA",
	Russian : "RU",
	English : "EN",
	Polish : "PL"
};