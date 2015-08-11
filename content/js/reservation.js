var req_ident = { number: '', inn: '' };

var CheckStatusInterval = null,
	CheckStatusCounter = 0,
	CheckStatusStop = false,
	wait = null;

var notify = function (notification_number, transport) {
	var xhr = $.post('/reservation/notify', {
		number: req_ident.number,
		inn: req_ident.inn,
		notification_number: notification_number,
		transport: transport
	}).done(function () {
		message('Онлайн бронирование счета', 'Уведомление отправлено!');
	});

	return false;
};

var how_check_status = function () {
	$('#how_check_status').toggle();
	return false;
};

var how_docements = function () {
	$('#how_docements').toggle();
	return false;
};

var get_requisits = function () {
	$('.step-success[data-for="exist-reserve"]').hide();
	$('.step-success[data-for="accept"]').show();
	return false;
}

var print = function (link, file) {
	$(link).attr('href', '/reservation/print/' + req_ident.number + '/' + req_ident.inn + '/' + file);
	return true;
}

function message(title, text) {
	$.magnificPopup.open(
		{
			items: {
				src: '<div class="white-popup message"><h4>' + title + '</h4><p>' + text + '</p></div>',
				type: 'inline'
			}
		}
	);
}

$(function () {

	// Установим ссылки на все необходимые объекты

	var token = $('meta[name="csrf"]').attr('content'),
		number = $('#number'),
		inn = $('#inn'),
		captchaTop = $('#captcha-top'),
		captchaTopImg = $('#captcha-top-img'),
		captchaTopReload = $('#captcha-top-reload'),
		captchaBottom = $('#captcha-bottom'),
		captchaBottomImg = $('#captcha-bottom-img'),
		captchaBottomReload = $('#captcha-bottom-reload'),
		orgType = $('#org-type'),
		numberNew = $('#number-new'),
		rezidentName = $('#rezident-name'),
		rezidentKindOfActivity = $('#rezident-kind-of-activity'),
		rezidentINN = $('#rezident-inn'),
		rezidentOGRN = $('#rezident-ogrn'),
		rezidentRegDate = $('#rezident-reg-date'),
		rezidentPhone = $('#rezident-phone'),
		rezidentEmail = $('#rezident-email'),
		rezidentCity = $('#rezident-city'),
		nerezidentName = $('#nerezident-name'),
		nerezidentCountry = $('#nerezident-country'),
		nerezidentRegDate = $('#nerezident-reg-date'),
		nerezidentINN = $('#nerezident-inn'),
		nerezidentPhone = $('#nerezident-phone'),
		nerezidentEmail = $('#nerezident-email'),
		nerezidentCity = $('#nerezident-city'),
		ipName = $('#ip-name'),
		ipINN = $('#ip-inn'),
		ipOGRIP = $('#ip-ogrip'),
		ipRegDate = $('#ip-reg-date'),
		ipPhone = $('#ip-phone'),
		ipEmail = $('#ip-email'),
		ipCity = $('#ip-city'),
		buttonSave = $('#get-account');

	req_ident.number = numberNew.val();

	// Установим маски на поля с датами и телефонами

	rezidentRegDate.mask('99.99.9999');
	rezidentPhone.mask('+7 999 999 99 99');
	nerezidentRegDate.mask('99.99.9999');
	nerezidentPhone.mask('+7 999 999 99 99');
	ipRegDate.mask('99.99.9999');
	ipPhone.mask('+7 999 999 99 99');

	var datepickoptions = {
		dateFormat: 'dd.mm.yyyy', alignment: 'bottomRight', showAnim: 'slideDown',
		changeMonth: true, firstDay: 1, useMouseWheel: false, showOtherMonths: true,
		selectOtherMonths: true,
		monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
	};
	rezidentRegDate.datepick(datepickoptions);
	nerezidentRegDate.datepick(datepickoptions);
	ipRegDate.datepick(datepickoptions);

	// Вспомогательные функции

	// Показывает сообщение t около элемента e
	var ErrorMessage = function (e, t) {
		var m = $('#error-message');
		m.css({
			top: e.offset().top + e.height() + 12,
			left: e.offset().left
		});
		m.html(t);
		m.show();
	};

	// Прячет сообщение об ошибке
	var HideErrorMessage = function () {
		$('#error-message').hide();
	};

	// Триммит значение поля и устанавливает/снимает значение об ошибке по значению
	var TrimValue = function (e) {
		e.val($.trim(e.val()));
		if (e.val() === '') {
			if (!e.hasClass('with-error'))
				e.addClass('with-error').focus();
			return false;
		}
		e.removeClass('with-error');
		return true;
	};

	// Триммит значение поля и устанавливает/снимает значение об ошибке по массиву длин значений
	var TrimLen = function (e, l, removeClass) {
		var val = $.trim(e.val()),
			check = false;
		e.val(val);

		if ($.isArray(l)) {
			for (var i in l) {
				if (val.length === l[i]) check = true;
			}
		} else {
			if (val.length === l) check = true;
		}

		if (!check) {
			if (!e.hasClass('with-error'))
				e.addClass('with-error').focus();
			return false;
		}

		if (removeClass) e.removeClass('with-error');
		return true;
	};

	// Валидация каптчи
	var ValidateCaptcha = function (c) {
		c.val($.trim(c.val()));
		var l = c.val().length;
		if (l === 0) {
			c.addClass('with-error');
			c.focus();
			ErrorMessage(c, 'Укажите защитный код');
			return false;
		}
		if (l !== 6) {
			c.addClass('with-error');
			c.focus();
			ErrorMessage(c, 'Введен неверный код');
			return false;
		}
		c.removeClass('with-error');
		HideErrorMessage();
		return true;
	};

	var Update = function () {
		var data = {
			orgtype: orgType.val(),
			number: req_ident.number,
			kindofactivity: rezidentKindOfActivity.val(),
			country: nerezidentCountry.val(),
			ogrip: ipOGRIP.val(),
			ogrn: rezidentOGRN.val(),
			name: '',
			inn: '',
			regdate: '',
			phone: '',
			email: '',
			city: ''
		};
		switch (data.orgtype) {
			case '1':
				{
					data.name = rezidentName.val();
					data.inn = rezidentINN.val();
					data.regdate = rezidentRegDate.val();
					data.phone = rezidentPhone.val();
					data.email = rezidentEmail.val();
					data.city = rezidentCity.val();
					break;
				}
			case '2':
				{
					data.name = nerezidentName.val();
					data.inn = nerezidentINN.val();
					data.regdate = nerezidentRegDate.val();
					data.phone = nerezidentPhone.val();
					data.email = nerezidentEmail.val();
					data.city = nerezidentCity.val();
					break;
				}
			case '3':
				{
					data.name = ipName.val();
					data.inn = ipINN.val();
					data.regdate = ipRegDate.val();
					data.phone = ipPhone.val();
					data.email = ipEmail.val();
					data.city = ipCity.val();
					break;
				}
		}

		jQuery.ajax({
			type: 'POST',
			url: '/reservation/update',
			dataType: 'json',
			data: data,
			success: function (json) {
				//if (json.status > 0) alert(json.status);
			}
		});
	};

	var updateRequestUI = function (json) {

		switch (json.status) {
			case 0:
				if (typeof json.request_status === 'undefined' || !json.request_status) break;
				$('.step-loading').hide();
				CheckStatusStop = true;
				clearInterval(CheckStatusInterval);
				clearInterval(wait);
				var result = json.request_status.toLowerCase();
				if (result === 'ACCEPT'.toLowerCase()) {
					$('[data-for="name"]').html(json.name);
					$('[data-for="number"]').html(req_ident.number);
					$('[data-for="bank-number"]').html(json.account);
					$('[data-for="bank-bic"]').html(json.bank_bic);
					$('[data-for="bank-name"]').html(json.bank_name);
					$('[data-for="bank-correspondent-account"]').html(json.bank_account);
					$('#form2, .step-load, .steps-wrapper > h3').hide();
					$('.step-success[data-for="accept"]').show();
					$(window).scrollTo($('.step-success[data-for="accept"]'));
				}
				if (result === 'REJECT'.toLowerCase()) {
					if (typeof json.account_status === 'undefined' || !json.account_status) break;
					var accountState = json.account_status.toLowerCase();
					if (accountState === 'EXIST_RESERVE'.toLowerCase()) {
						$('[data-for="name"]').html(json.name);
						$('[data-for="manager"]').html(json.manager);
						$('[data-for="bank-number"]').html(json.account);
						$('[data-for="bank-bic"]').html(json.bank_bic);
						$('[data-for="bank-name"]').html(json.bank_name);
						$('[data-for="bank-filial"]').html(json.bank_filial);
						$('[data-for="bank-correspondent-account"]').html(json.bank_account);
						$('#form2, .step-load, .steps-wrapper > h3').hide();
						$('.step-success[data-for="exist-reserve"]').show();
						$(window).scrollTo($('.step-success[data-for="exist-reserve"]'));
					} else if (accountState === 'EXIST_OPEN'.toLowerCase()) {
						$('.step-success[data-for="exist-open"]').show();
					} else if (accountState === 'SUSPECT'.toLowerCase() || accountState === 'REJECT'.toLowerCase()) {
						$('.step-success[data-for="suspect"]').show();
					} else if (accountState === '') {
						$('.step-success[data-for="error"]').show();
					} else {
						$('.step-success[data-for="error"]').show();
					}
				}
				break;
			case 5:
				//alert('Заявка не найдена!');
				$('#form2, .step-load, .steps-wrapper > h3').show();
				$('.step-loading').hide();
				break;
			default:
				break;
		}

	};

	var StartCheckStatus = function (Counter) {

		CheckStatusCounter = 0;
		CheckStatusInterval = setInterval(function () {
			CheckStatusCounter++;
			if (CheckStatusCounter >= Counter) {
				clearInterval(CheckStatusInterval);
				$('.step-success[data-for="timeout"] [data-for="number"]').text(req_ident.number);
				return;
			}
			if (CheckStatusStop) {
				clearInterval(CheckStatusInterval);
				return;
			}
			CheckStatus();
		}, 10000);

	};

	var CheckStatus = function () {
		var xhr = $.post("/reservation/check", {
			number: req_ident.number,
			inn: req_ident.inn
		})
		.done(function (json) {
			updateRequestUI(json);
		});
	}

	// Отправка синхронного запроса на сохранение данных
	var Save = function (data) {
		buttonSave.attr('disabled', true);
		req_ident.number = data.number;
		req_ident.inn = data.inn;
		jQuery.ajax({
			type: 'POST',
			url: '/reservation/set',
			dataType: 'json',
			data: data,
			success: function (json) {
				switch (json.status) {
					case 0:
						$('#form2, .step-load, .steps-wrapper > h3').hide();
						$('.step-loading').slideDown();
						var wait_seconds = 60;
						wait = setInterval(
							function () {
								wait_seconds--;
								$('.wait .seconds').text(wait_seconds);
								if (CheckStatusStop) {
									clearInterval(wait);
									return;
								}
								if (wait_seconds === 0) {
									clearInterval(wait);
									$('.step-loading').hide();
									$('.step-success[data-for="timeout"]').show();
								}
							},
							1000
						);
						//выполняем проверку 6 раз каждые 10 секунд = 60 секунд
						StartCheckStatus(6);
						break;
					case 1:
						// Истек или неверно указан csrf-токен
						alert('У вас нет прав на выполнение данного запроса... Повторите попытку позже.');
						// Обязательно перезагружаем страницу, чтобы обновить csrf-токен
						location.reload();
						break;
					case 2:
						alert('Вы неверно указали символы с картинки... Повторите попытку позже.');
						buttonSave.attr('disabled', false);
						$('#form2, .step-load, .steps-wrapper > h3').show();
						$('.step-loading').hide();
						captchaBottom.focus();
						break;
					default:
						$('.step-loading').hide();
						$('.step-success[data-for="error"]').show();
						break;
				}
			},
			error: function () {
				$('#form2, .step-load, .steps-wrapper > h3').hide();
				$('.step-loading').hide();
				$('.step-success[data-for="error"]').show();
			}
		});

	};

	// Установим обработчики на элементы для ограничений ввода и контроля фокус

	var checkDigits = function (e) {
		return ((e.which > 47) && (e.which < 58));
	};

	number
		.keypress(checkDigits)
		.blur(
			function () {
				var t = $(this),
					l = t.val().length;
				if (l === 0 || l === 8) {
					t.removeClass('with-error');
					HideErrorMessage();
					return;
				}
				t.addClass('with-error');
				ErrorMessage(number, 'Номер заявки указан не верно');
			}
		);

	inn
		.keypress(checkDigits)
		.blur(
			function () {
				var t = $(this),
					v = t.val(),
					l = v.length;
				if (l === 0 || l === 5 || l === 10 || l === 12) {
					t.removeClass('with-error');
					HideErrorMessage();
					return;
				}
				t.addClass('with-error');
				ErrorMessage(inn, 'ИНН / КИО должен содержать 5, 10 или 12 цифр');
			}
		);

	captchaTop.blur(function () { ValidateCaptcha($(this)); });

	captchaBottom.blur(function () { ValidateCaptcha($(this)); });

	// #region валидаторы полей

	///валидация по значению, с передачей текста об ошибке
	var validate_value = function (field, message) {
		var success = TrimValue(field);
		if (success) {
			HideErrorMessage();
			Update();
		}
		else
			ErrorMessage(field, message);

		return success;
	};

	var getSameDigitRegex = function (length) {
		var pattern = '(0{l}|1{l}|2{l}|3{l}|4{l}|5{l}|6{l}|7{l}|8{l}|9{l})'.replace(/l/g, length);
		var re = new RegExp(pattern, 'g');
		return re;
	};

	///валидация названия организации
	var validate_name = function (field) {
		return validate_value(field, 'Укажите наименование организации');
	};

	var validate_KindOfActivity = function (field) {
		return validate_value(field, 'Выберите вид деятельности');
	};

	var validate_INN = function (field, len, checkSameDigit, update_request) {
		var success = TrimLen(field, len, false),
			val = field.val(),
			is_array = $.isArray(len);
		if (!success) {
			if (!is_array)
				ErrorMessage(field, val.length == 0 ? 'Укажите ИНН' : 'ИНН должен содержать ' + len + ' цифр');
			else {
				ErrorMessage(field, val.length == 0 ? 'Укажите ИНН' : 'ИНН должен содержать ' + len.join(', или ') + ' цифр');
			}
			return false;
		}
		if (checkSameDigit) {
			if (!is_array) {
				var re = getSameDigitRegex(len);
				if (re.test(val)) {
					ErrorMessage(field, 'ИНН не должен быть ' + val);
					if (!field.hasClass('with-error')) field.addClass('with-error').focus();
					return false;
				}
			} else {
				for (var i in len) {
					var re = getSameDigitRegex(len[i]);
					if (re.test(val)) {
						ErrorMessage(field, 'ИНН не должен быть ' + val);
						if (!field.hasClass('with-error')) field.addClass('with-error').focus();
						return false;
					}
				}
			}
		}

		field.removeClass('with-error');
		HideErrorMessage();
		if (update_request) Update();

		return true;
	};

	var validate_ogrn = function (field, len) {
		var success = TrimLen(field, len, false),
			val = field.val();
		if (!success) {
			ErrorMessage(field, val.length == 0 ? 'Укажите ОГРН' : 'ОГРН должен содержать ' + len + ' цифр');
			return false;
		}
		var re = getSameDigitRegex(len);
		if (re.test(val)) {
			ErrorMessage(field, 'ОГРН не должен быть ' + val);
			if (!field.hasClass('with-error')) field.addClass('with-error').focus();
			return false;
		}

		field.removeClass('with-error');
		HideErrorMessage();
		Update();

		return true;
	};

	var validate_RegDate = function (field) {
		var success = TrimLen(field, 10, false),
			val = field.val();
		if (!success) {
			//ErrorMessage(field, val.length == 0 ? 'Укажите дату регистрации' : 'Введите корректную дату регистрации');
			return false;
		}

		success = false;
		var re = /^\d{2}\.\d{2}\.\d{4}$/;
		if (re.test(val)) {
			var adata = val.split('.');
			var gg = parseInt(adata[0], 10);
			var mm = parseInt(adata[1], 10);
			var aaaa = parseInt(adata[2], 10);
			var xdata = new Date(aaaa, mm - 1, gg);
			if ((xdata.getFullYear() === aaaa) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === gg)) {
				success = xdata >= new Date(1900, 0, 1);
			} else {
				success = false;
			}
		} else {
			success = false;
		}

		if (success) {
			field.removeClass('with-error');
			HideErrorMessage();
			Update();
		} else {
			field.addClass('with-error').focus();
			ErrorMessage(field, 'Введите корректную дату гос.регистрации');
		}

		return success;
	};

	var validate_phone = function (field) {
		var success = TrimLen(field, 16, false),
			val = field.val();
		if (!success) {
			ErrorMessage(field, 'Введите номер телефона');
			return false;
		}
		field.removeClass('with-error');
		HideErrorMessage();
		Update();

		return true;
	};

	var validate_email = function (field) {
		var val = $.trim(field.val());
		field.val(val);
		if (val !== '') {
			if (!is_email(val)) {
				ErrorMessage(field, 'Не верный формат e-mail адреса');
				if (!field.hasClass('with-error')) field.addClass('with-error').focus();
				return false;
			} else {
				field.removeClass('with-error');
				HideErrorMessage();
			}
		}
		if (!field.hasClass('with-error')) Update();
		return true;
	};

	var validate_city = function (field) {
		return validate_value(field, 'Выберите город обслуживания');
	};

	var validate_country = function (field) {
		return validate_value(field, 'Выберите страну регистрации');
	};

	// #endregion валидаторы полей

	// #region валидация резидента

	rezidentName.blur(function () { validate_name($(this)); });

	rezidentKindOfActivity.change(function () { validate_KindOfActivity($(this)) });

	rezidentINN
		.keypress(checkDigits)
		.blur(function () { validate_INN($(this), 10, true, true); req_ident.inn = $(this).val(); });

	rezidentOGRN
		.keypress(checkDigits)
		.blur(function () { validate_ogrn($(this), 13); });

	rezidentRegDate
		.keypress(checkDigits)
		.blur(function () { validate_RegDate($(this)); });

	rezidentPhone
		.keypress(checkDigits)
		.blur(function () { validate_phone($(this)); });

	rezidentEmail.blur(function () { validate_email($(this)); });

	rezidentCity.change(function () { validate_city($(this)); });

	// #endregion валидация резидента

	// #region валидация нерезидента

	nerezidentName.blur(function () { validate_name($(this)); });

	nerezidentCountry.change(function () { validate_country($(this)); });

	nerezidentINN
		.keypress(checkDigits)
		.blur(function () { validate_INN($(this), [5, 10], false, true); req_ident.inn = $(this).val(); });

	nerezidentRegDate
		.keypress(checkDigits)
		.blur(function () { validate_RegDate($(this)); });

	nerezidentPhone
		.keypress(checkDigits)
		.blur(function () { validate_phone($(this)); });

	nerezidentEmail.blur(function () { validate_email($(this)); });

	nerezidentCity.change(function () { validate_city($(this)); });

	// #endregion валидация нерезидента

	// #region валидация ИП

	ipName.blur(function () { validate_name($(this)); });

	ipINN
		.keypress(checkDigits)
		.blur(function () { validate_INN($(this), 12, true, true); req_ident.inn = $(this).val(); });

	ipOGRIP
		.keypress(checkDigits)
		.blur(function () { validate_ogrn($(this), 15); });

	ipRegDate
		.keypress(checkDigits)
		.blur(function () { validate_RegDate($(this)); });

	ipPhone
		.keypress(checkDigits)
		.blur(function () { validate_phone($(this)); });

	ipEmail.blur(function () { validate_email($(this)); });

	ipCity.change(function () { validate_city($(this)); });

	// #endregion валидация ИП

	// Событийная модель

	// Обновление верхней каптчи
	captchaTopReload.click(
		function () {
			captchaTopImg.attr('src', '/captcha?postfix=top&' + Math.random());
			return false;
		}
	);

	// Обновление нижней каптчи
	captchaBottomReload.click(
		function () {
			captchaBottomImg.attr('src', '/captcha?postfix=bottom&' + Math.random());
			return false;
		}
	);

	// Изменение типа организации
	orgType.change(
		function () {
			$('[data-org-type]').hide();
			var v = parseInt($(this).val(), 10),
				h = $('.step-data > h2');
			switch (v) {
				case 1:
					h.html('Заявка юридического лица резидента РФ');
					break;
				case 2:
					h.html('Заявка юридического лица нерезидента РФ');
					break;
				case 3:
					h.html('Заявка индивидуального предпринимателя');
					break;
			}
			$('[data-org-type="' + v + '"]').show();
		}
	);

	// Загрузка данных по сохраненной заявке
	$('.step-load form').submit(
		function () {
			// Номер заявки
			number.val($.trim(number.val()));
			var l = number.val().length;
			if (l === 0) {
				number.addClass('with-error');
				number.focus();
				ErrorMessage(number, 'Укажите номер заявки');
				return false;
			}
			if (l !== 8) {
				number.addClass('with-error');
				number.focus();
				ErrorMessage(number, 'Номер заявки указан не верно');
				return false;
			}
			number.removeClass('with-error');
			HideErrorMessage();
			// ИНН / КИО
			if (!validate_INN(inn, [5, 10, 12], false)) return false;
			HideErrorMessage();
			// Каптча
			if (!ValidateCaptcha(captchaTop)) return false;

			req_ident.number = number.val();
			req_ident.inn = inn.val();

			jQuery.ajax({
				type: 'POST',
				async: false,
				url: '/reservation/get',
				dataType: 'json',
				data: {
					number: req_ident.number,
					inn: req_ident.inn,
					captcha: captchaTop.val(),
					token: token
				},
				success: function (json) {
					switch (json.status) {
						case 1:
							// Истек или неверно указан csrf-токен
							alert('У вас нет прав на выполнение данного запроса... Повторите попытку позже.');
							// Обязательно перезагружаем страницу, чтобы обновить csrf-токен
							location.reload();
							break;
						case 0:
							// Загружаем данные из сохраненной заявки
							number.val('');
							inn.val('');
							captchaTop.val('');
							numberNew.val(json.number);
							orgType.val(json.orgtype).change();
							switch (json.orgtype) {
								case 1:
									rezidentName.val(json.name);
									rezidentKindOfActivity.val(json.kindofactivity).change();
									rezidentINN.val(json.innkio);
									rezidentOGRN.val(json.ogrnogrip);
									rezidentRegDate.val(json.registrationdate);
									rezidentPhone.val(json.phone);
									rezidentEmail.val(json.email);
									rezidentCity.val(json.city).change();
									break;
								case 2:
									nerezidentName.val(json.name);
									nerezidentCountry.val(json.registrationcountry).change();
									nerezidentRegDate.val(json.registrationdate);
									nerezidentINN.val(json.innkio);
									nerezidentPhone.val(json.phone);
									nerezidentEmail.val(json.email);
									nerezidentCity.val(json.city).change();
									break;
								case 3:
									ipName.val(json.name);
									ipINN.val(json.innkio);
									ipOGRIP.val(json.ogrnogrip);
									ipRegDate.val(json.registrationdate);
									ipPhone.val(json.phone);
									ipEmail.val(json.email);
									ipCity.val(json.city).change();
									break;
							}
							// Обновляем каптчу
							captchaTopReload.click();
							updateRequestUI(json);
							break;
						case 2:
							alert('Вы неверно указали символы с картинки... Повторите попытку позже.');
							captchaTopReload.click();
							captchaTop.val('');
							captchaTop.focus();
							break;
						case 3:
							alert('Заявка с указанными номером и ИНН / КИО не найдена...');
							inn.focus();
							break;
						default:
							alert('Ошибка при обработке запроса... Повторите попытку позже.');
							captchaTop.val('');
							captchaTopReload.click();
							break;
					}
				},
				error: function () {
					alert('Ошибка при обработке запроса... Повторите попытку позже.');
					captchaTop.val('');
					captchaTopReload.click();
				}
			});
			return false;
		}
	);

	// Сохранение данных по заявке и отправка в ИБСО
	buttonSave.click(
		function () {
			switch (parseInt(orgType.val(), 10)) {
				case 1:
					HideErrorMessage();
					if (!validate_name(rezidentName)) return false;
					if (!validate_KindOfActivity(rezidentKindOfActivity)) return false;
					if (!validate_INN(rezidentINN, 10, true)) return false;
					if (!validate_ogrn(rezidentOGRN, 13)) return false;
					if (!validate_RegDate(rezidentRegDate)) return false;
					if (!validate_phone(rezidentPhone)) return false;
					if (!validate_email(rezidentEmail)) return false;
					if (!validate_city(rezidentCity)) return false;

					if (!ValidateCaptcha(captchaBottom)) return false;
					// Отправляем синхронный запрос
					Save({
						orgtype: orgType.val(),
						number: req_ident.number,
						name: rezidentName.val(),
						kindofactivity: rezidentKindOfActivity.val(),
						inn: req_ident.inn,
						ogrn: rezidentOGRN.val(),
						regdate: rezidentRegDate.val(),
						phone: rezidentPhone.val(),
						email: rezidentEmail.val(),
						city: rezidentCity.val(),
						captcha: captchaBottom.val(),
						token: token
					});
					break;
				case 2:
					HideErrorMessage();
					if (!validate_name(nerezidentName)) return false;
					if (!validate_country(nerezidentCountry)) return false;
					if (!validate_INN(nerezidentINN, [5, 10], false)) return false;
					if (!validate_RegDate(nerezidentRegDate)) return false;
					if (!validate_phone(nerezidentPhone)) return false;
					if (!validate_email(nerezidentEmail)) return false;
					if (!validate_city(nerezidentCity)) return false;

					if (!ValidateCaptcha(captchaBottom)) return false;
					// Отправляем синхронный запрос
					Save({
						orgtype: orgType.val(),
						number: req_ident.number,
						name: nerezidentName.val(),
						country: nerezidentCountry.val(),
						regdate: nerezidentRegDate.val(),
						inn: req_ident.inn,
						phone: nerezidentPhone.val(),
						email: nerezidentEmail.val(),
						city: nerezidentCity.val(),
						captcha: captchaBottom.val(),
						token: token
					});
					break;
				case 3:
					HideErrorMessage();
					if (!validate_name(ipName)) return false;
					if (!validate_INN(ipINN, 12, true)) return false;
					if (!validate_ogrn(ipOGRIP, 15)) return false;
					if (!validate_RegDate(ipRegDate)) return false;
					if (!validate_phone(ipPhone)) return false;
					if (!validate_email(ipEmail)) return false;
					if (!validate_city(ipCity)) return false;

					if (!ValidateCaptcha(captchaBottom)) return false;
					// Отправляем синхронный запрос
					Save({
						orgtype: orgType.val(),
						number: req_ident.number,
						name: ipName.val(),
						inn: req_ident.inn,
						ogrip: ipOGRIP.val(),
						regdate: ipRegDate.val(),
						phone: ipPhone.val(),
						email: ipEmail.val(),
						city: ipCity.val(),
						captcha: captchaBottom.val(),
						token: token
					});
					break;
			}
			return false;
		}
	);

});
