var smsChecked = false;
var aco_step = 1;
var validator = null, callback_validator = null;
var max_steps = 3;
var form_options = { };

// #region sms interval

var seconds, seconds_interval = 120, seconds_intervalId;

function repeat_sms_start() {
	seconds = seconds_interval;
	seconds_intervalId = window.setInterval(function () {
		seconds--;
		set_seconds(seconds);
		if (seconds == 0) {
			window.clearInterval(seconds_intervalId);
			$('#acoForm_checksms_popup_send_message').hide();
			$('#acoForm_checksms_popup_send').show();
		}
	}, 1000);
}

function set_seconds(sec) {
	var m = sec / 60 >> 0, s = sec - m * 60;
	$('#acoForm_checksms_popup_send_message span').text((m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s));
};

// #endregion sms interval

function get_validator() {
	if (!validator) validator = $('#acoForm').validate();
	return validator;
}

function get_callback_validator() {
	if (!callback_validator) callback_validator = $('#callbackForm').validate();
	return callback_validator;
}

function step_set(step) {
	if (step < 1 || step > max_steps) return;
	aco_step = step;
	hideAllTips();
	$('.aco_step').hide();
	$('#acoForm_step' + step).show();
	if (step <= 1) $('#btn_prev').hide(); else $('#btn_prev').show();
	if (step >= max_steps) $('#btn_next').hide(); else $('#btn_next').show();
	$('#aco .contact-form__steps .step').removeClass('active');
	$('#aco .contact-form__steps .step[data-step="' + step + '"]').addClass('active');
	if (options.HideFinishButton) {
		if (step == max_steps) $('#btn_finish').show();
		else $('#btn_finish').hide();
	}
}

function step_next() {
	if (aco_step < 4) {
		if (!validate_step(aco_step)) return;
		step_set(aco_step + 1);
	}
}
function step_prev() {
	if (aco_step > 1) step_set(aco_step - 1);
}

function set_city_offices(city_uid) {
	$('#acoForm_office').html('');
	if (!city_uid || !offices) return;

	var
		min = 20000,
		cityBig = city_uid == '194ddffd-cea5-4714-b020-94ddcfe10016' || city_uid == 'c640a34d-b552-46d2-b403-06773849f295',
		max = cityBig ? 1000000 : 500000;

	if (pageName == 'credit_online') {
		var
			min = 50000,
			cityBig = city_uid == '194ddffd-cea5-4714-b020-94ddcfe10016' || city_uid == 'c640a34d-b552-46d2-b403-06773849f295',
			max = cityBig ? 1000000 : 500000;

		$('#acoForm_period').rules("remove", "range");
		$('#acoForm_period').rules("add", { range: [13, 60], messages: { range: 'Срок кредита должен быть от 13 до 60 месяцев'} });
	}

	if (pageName == 'card_online' || pageName == 'card_bonusplatinum') {
		var
			min = 20000,
			max = 500000;
	}

	if (pageName == 'card_bonusgold') {
		var
			min = 20000,
			max = 300000;
	}

	var rules = $('#acoForm_amount').rules();
	$('#acoForm_amount').rules("remove", "range");
	$('#acoForm_amount').rules("add", { range: [min, max] });
}

function hideAllTips() {
	$('#acoForm .tooltipstered').each(function () {
		var element = $(this);
		element.data('lastError', '');
		try {
			element.tooltipster('hide');
		} catch (_) { }
	});
}

function set_field_required(field_id, message) {
	var field = $(field_id);
	field.rules('remove', 'required');
	field.rules('add', { required: true, messages: { required: message} });
}

function init_step1() {

	$('#callbackForm .tooltipstered-right').tooltipster({
		trigger: 'custom',
		onlyOne: false,
		position: 'right',
		minWidth: '220',
		maxWidth: '220',
		theme: 'tooltipster-light'
	});

	var cbvld = get_callback_validator();
	if (cbvld) {
		cbvld.settings.errorPlacement = function (error, element) {
			var el = $(element);
			if (!(el.hasClass('tooltipstered-right') || el.hasClass('tooltipstered-custom'))) return;
			var lastError = el.data('lastError'), newError = $(error).text();
			el.data('lastError', newError);
			if (newError !== '' && newError !== lastError) {
				try
				{
					el.tooltipster('content', newError);
					el.tooltipster('show');
				} catch (_) { }
			}
		};
		cbvld.settings.success = function (label, element) {
			var el = $(element);
			if (!(el.hasClass('tooltipstered-right') || el.hasClass('tooltipstered-custom'))) return;
			try {
				el.tooltipster('hide');
			} catch (_) { }
		}
	}

	$('#callbackForm_city').rules('add', { notequal: '00000000-0000-0000-0000-000000000000', messages: { notequal: 'Кредит предоставляется только в городах присутствия БКС Банка'} });

	$('#callbackForm_city').on('change', function () {
		var element = $(this), city_id = element.val(), city_prev = element.data('prev'), moscow = '194ddffd-cea5-4714-b020-94ddcfe10016', spb = 'c640a34d-b552-46d2-b403-06773849f295';
		element.data('prev', city_id);
		if (!city_prev || (city_id != city_prev && ((city_id == moscow && city_prev != moscow) || (city_id != moscow && city_prev == moscow)))) {
			try {
				$('#callbackForm_amount').tooltipster('hide');
			} catch (_) { }
		}

		var
			limit = city_id == moscow ? 1500000 : 500000,
			limit_s = city_id == moscow ? '1&nbsp;500&nbsp;000' : '500&nbsp;000';

		if (pageName == 'credit_calc') {
			var
				limit = city_id == moscow || city_id == spb ? 1000000 : 500000,
				limit_s = city_id == moscow || city_id == spb ? '1&nbsp;000&nbsp;000' : '500&nbsp;000',
				minL = 50000,
				minT = "50 000";
		}

		if (pageName == 'credit_refinance') {
			var
				limit = city_id == moscow || city_id == spb ? 1000000 : 500000,
				limit_s = city_id == moscow || city_id == spb ? '1&nbsp;000&nbsp;000' : '500&nbsp;000',
				minL = 100000,
				minT = "100 000";
		}

		if (pageName == 'card_credit' || pageName == 'card_overdraft') {
			var 
				limit = 1000000,
				limit_s = '1&nbsp;000&nbsp;000',
				minL = 20000,
				minT = "20 000";
		}

		$('#callbackForm_amount').rules('remove', 'range');
		$('#callbackForm_amount').rules('add', { range: [minL, limit], messages: { range: 'Сумма кредита должна быть в пределах от ' + minT + ' до ' + limit_s} });

	});
	$('#callbackForm_city').trigger('change');

	if (product_id != 3) {
		$('#callbackForm_period').rules('remove', 'range');
		$('#callbackForm_period').rules('add', { range: [6, 36], messages: { range: 'Срок кредита должен быть от 6 до 36 месяцев'} });
	}
}

function init_aco() {

	$('#acoForm .tooltipstered-right').tooltipster({
		trigger: 'custom',
		onlyOne: false,
		position: 'right',
		minWidth: '220',
		maxWidth: '220',
		theme: 'tooltipster-light'
	});

	$('#acoForm .tooltipstered-custom').each(function () {
		var element = $(this),
			position = element.data('tooltipster-position'),
			offsetX = element.data('tooltipster-offset-x'),
			offsetY = element.data('tooltipster-offset-y'),
			minWidth = element.data('tooltipster-minwidth'),
			maxWidth = element.data('tooltipster-maxwidth');

		element.tooltipster({
			trigger: 'custom',
			onlyOne: false,
			position: position || 'right',
			minWidth: minWidth || 0,
			maxWidth: maxWidth || null,
			offsetX: offsetX || 0,
			offsetY: offsetY || 0,
			theme: 'tooltipster-light'
		});
	});


	//сбросим значения полей формы
	//$('#acoForm_amount, #acoForm_period, #acoForm_birthdate, #acoForm_passport_date, #acoForm_registration_date, #acoForm_dependents_number, #acoForm_company_year, #acoForm_work_experience_current, #acoForm_work_experience_total, #acoForm_average_monthly_income, #acoForm_rent, #acoForm_payments_and_debt, #acoForm_insurance_payments, #acoForm_payments_on_loans_and_credit_cards, #acoForm_car_year, #acoForm_total_liabilities_for_all_active_loans, #acoForm_total_monthly_payments_on_all_loans').val('');
	if (!$('#acoForm_period').val()) $('#acoForm_period').val('');
	$('#acoForm_amount, #acoForm_birthdate, #acoForm_passport_date, #acoForm_registration_date, #acoForm_dependents_number, #acoForm_work_experience_current, #acoForm_work_experience_total, #acoForm_average_monthly_income, #acoForm_index_first, #acoForm_index_second, #acoForm_company_index, #acoForm_outgoingLoanServicing').val('');

	// #region Установка масок

	$('#acoForm_amount').mask('99999?99', { placeholder: '' });
	$('#acoForm_period').mask('9?9', { placeholder: '' });
	$('#acoForm_birthdate').mask('99.99.9999');
	$('#acoForm_phone').mask('+7 (999) 999-9999');
	$('#acoForm_passport_series').mask('99\ 99');
	$('#acoForm_passport_number').mask('999999');
	//$('#acoForm_passport_number_old').mask('999999');
	//$('#acoForm_passport_series_old').mask('99\ 99');
	$('#acoForm_passport_date').mask('99.99.9999');
	$('#acoForm_passport_subdivision_code').mask('999-999');
	$('#acoForm_registration_date').mask('99.99.9999');
	$('#acoForm_phone_number').mask('8 (999) 999-9999');
	//$('#acoForm_phone_code').mask('999?99');
	//$('#acoForm_phone_number').mask('99999?99');
	$('#acoForm_dependents_number').mask('9?9', { placeholder: '' });
	//$('#acoForm_work_experience_total').mask('9?99', { placeholder: ' ' });
	$('#acoForm_work_experience_current').mask('9?99', { placeholder: '' });
	//$('#acoForm_mobile_second').mask('+7 (999) 999-9999');
	//$('#acoForm_company_phone_code').mask('999?99');
	//$('#acoForm_company_phone_number').mask('99999?99');
	$('#acoForm_company_phone_number').mask('8 (999) 999-9999');
	$('#acoForm_company_inn').mask('9999999999', { placeholder: '' });
	//$('#acoForm_company_year').mask('9999');
	//$('#acoForm_car_year').mask('9999');
	$('#acoForm_index_first').mask('999999', { placeholder: '' });
	$('#acoForm_index_second').mask('999999', { placeholder: '' });
	$('#acoForm_company_index').mask('999999', { placeholder: '' });

	// #endregion

	$('#acoForm_birthdate').rules('add', { daterange2360: true, messages: { daterange2360: 'Возраст должен быть от 23 до 60 лет'} });

	$('#acoForm_city').val('194ddffd-cea5-4714-b020-94ddcfe10016');
	set_city_offices('194ddffd-cea5-4714-b020-94ddcfe10016');

	$('#acoForm_city').on('change', function () {
		var element = $(this), city_id = element.val(), city_prev = element.data('prev'), moscow = '194ddffd-cea5-4714-b020-94ddcfe10016', spb = 'c640a34d-b552-46d2-b403-06773849f295';
		element.data('prev', city_id);
		if (!city_prev || (city_id != city_prev && ((city_id == moscow && city_prev != moscow) || (city_id != moscow && city_prev == moscow)))) {
			try {
				$('#acoForm_amount').tooltipster('hide');
			} catch (_) { }
		}

		var
			limit = city_id == moscow ? 1000000 : 500000,
			limit_s = city_id == moscow ? '1&nbsp;000&nbsp;000' : '500&nbsp;000',
			minL = 20000,
			minT = "20 000";

		if (pageName == 'credit_online') {
			var
				limit = city_id == moscow || city_id == spb ? 1000000 : 500000,
				limit_s = city_id == moscow || city_id == spb ? '1&nbsp;000&nbsp;000' : '500&nbsp;000',
				minL = 50000,
				minT = "50 000";
		}

		if (pageName == 'card_online' || pageName == 'card_bonusplatinum') {
			var
				limit = 500000,
				limit_s = '500&nbsp;000',
				minL = 20000,
				minT = "20 000";
		}

		if (pageName == 'card_bonusgold') {
			var 
				limit = 300000,
				limit_s = '300&nbsp;000',
				minL = 20000,
				minT = "20 000";
		}

		$('#acoForm_amount').rules('remove', 'range');
		$('#acoForm_amount').rules('add', { range: [minL, limit], messages: { range: 'Сумма кредита должна быть в пределах от ' + minT + ' до ' + limit_s} });

	});
	$('#acoForm_city').trigger('change');

	/*var phone_number_required_message = 'Если у&nbsp;Вас нет домашнего телефона, укажите в&nbsp;поле "Мобильный телефон 2" свой альтернативный номер, или номер друзей (родственников)',
		mobile_second_required_message = 'Если у&nbsp;Вас нет другого мобильного телефона, укажите стационарный телефон';
	set_field_required('#acoForm_phone_number', phone_number_required_message);
	set_field_required('#acoForm_mobile_second', mobile_second_required_message);*/

	// #region Стоимость

	$('#acoForm_average_monthly_income, #acoForm_rent, #acoForm_payments_and_debt, #acoForm_insurance_payments, #acoForm_payments_on_loans_and_credit_cards, #acoForm_total_liabilities_for_all_active_loans, #acoForm_total_monthly_payments_on_all_loans').keypress(
		function (e) {
			e = e.keyCode || e.which;
			return ((e >= 48 && e <= 57) || e == 46 || e == 8 || e == 37 || e == 39 || e == 9 || e == 110 || e == 190);
		}
	);

	// #endregion

	$('#acoForm_loan_product').on('change',
		function () {
			var v = $(this).val();
			$('[data-for]').each(
				function () {
					var o = $(this);
					if (o.data('for') == v) {
						o.removeClass('hidden');
						o.show();
					} else {
						o.hide();
					}
				}
			);

			var period_max = v == '3' ? 60 : 36;
			$('#acoForm_period').rules("remove", "range");
			$('#acoForm_period').rules("add", { range: [6, period_max], messages: { range: 'Срок кредита должен быть от 6 до ' + period_max + ' месяцев'} });
		}
	);

	$('#acoForm_passport_date').rules("add", { daterange: { min: new Date(1900, 0, 1), max: new Date() }, messages: { daterange: 'Дата должна быть действительной и не больше текущей даты'} });
	//$('#acoForm_birthdate').rules("add", { daterange: { min: new Date(1900, 0, 1), max: new Date()} });
	$('#acoForm_registration_date').rules("add", { daterange: { min: new Date(1900, 0, 1), max: new Date() }, messages: { daterange: 'Дата должна быть действительной и не больше текущей даты'} });

	$('#acoForm_city').on('change', function () {
		var city_uid = $(this).val();
		set_city_offices(city_uid);
	});

	$('#acoForm_address_second').on('change', function () {
		hideAllTips();
		var is_checked = $(this).prop('checked'),
		vm = is_checked ? 'remove' : 'add';

		if (is_checked) $('.address_second').hide();
		else $('.address_second').show();

		if (vm == 'add') {
			$('#acoForm_index_second').rules(vm, { required: true, messages: { required: 'Пожалуйста, укажите индекс'} });
			$('#acoForm_region_second').rules(vm, { required: true, messages: { required: 'Пожалуйста, укажите регион проживания'} });
			$('#acoForm_city_second').rules(vm, { required: true, messages: { required: 'Пожалуйста, укажите город'} });
			$('#acoForm_street_second').rules(vm, { required: true, messages: { required: 'Пожалуйста, укажите улицу'} });
			$('#acoForm_house_second').rules(vm, { required: true, messages: { required: 'Пожалуйста, укажите номер дома и квартиры, в которой Вы проживаете'} });
			$('#acoForm_flat_second').rules(vm, { required: true, messages: { required: 'Пожалуйста, укажите номер дома и квартиры, в которой Вы проживаете'} });
		} else {
			var req = 'required';
			$('#acoForm_index_second').rules(vm, req);
			$('#acoForm_region_second').rules(vm, req);
			$('#acoForm_city_second').rules(vm, req);
			$('#acoForm_street_second').rules(vm, req);
			$('#acoForm_house_second').rules(vm, req);
			$('#acoForm_flat_second').rules(vm, req);
		}
	});

	$('#acoForm_previous_surname').on('keyup', function () {
		if ($(this).val().length > 0) {
			$('.previous_surname_info').show();
			$('#acoForm_previous_surname_info').rules('add', { required: true, messages: { required: 'Пожалуйста, укажите причину смены фамилии'} });
		} else {
			$('.previous_surname_info').hide();
			$('#acoForm_previous_surname_info').rules('remove', 'required');
		}
		hideAllTips();
	});

	/*$('#acoForm_phone_number').on('change', function () {
		var val = $(this).val();
		if (!val || val == '') {
			set_field_required('#acoForm_mobile_second', mobile_second_required_message);
		} else {
			$('#acoForm_mobile_second').rules('remove', 'required');
			$('#acoForm_mobile_second').valid();
		}
	});

	$('#acoForm_mobile_second').on('change', function () {
		var val = $(this).val();
		if (!val || val == '') {
			set_field_required('#acoForm_phone_number', mobile_second_required_message);
		} else {
			$('#acoForm_phone_number').rules('remove', 'required');
			$('#acoForm_phone_number').valid();
		}
	});*/

	$('#acoForm_sphere_of_activity').on('change', function () {
		var val = $(this).val();
		if (val && val == 'other') {
			$('.sphere_of_activity_other').show();
			$('#acoForm_sphere_of_activity_other').rules('add', { required: true, messages: { required: 'Пожалуйста, укажите сферу деятельности компании'} });
		} else {
			$('.sphere_of_activity_other').hide();
			$('#acoForm_sphere_of_activity_other').rules('remove', 'required');
		}
		hideAllTips();
	});

	$('#acoForm_post').on('change', function () {
		var val = $(this).val();
		if (val && val == 'other') {
			$('.post_other').show();
			$('#acoForm_post_other').rules('add', { required: true, messages: { required: 'Пожалуйста, укажите Вашу должность'} });
		} else {
			$('.post_other').hide();
			$('#acoForm_post_other').rules('remove', 'required');
		}
		hideAllTips();
	});

	$('[name="acoForm.flat"]').on('change', function () {
		hideAllTips();
		var value = $(this).val();
		if (value) {
			if (value == 'false') $('.flat-data').hide();
			else $('.flat-data').show();
		}
	});

	$('[name="acoForm.countryhouse"]').on('change', function () {
		hideAllTips();
		var value = $(this).val();
		if (value) {
			if (value == 'false') $('.countryhouse-data').hide();
			else $('.countryhouse-data').show();
		}
	});

	$('[name="acoForm.parcel"]').on('change', function () {
		hideAllTips();
		var value = $(this).val();
		if (value) {
			if (value == 'false') $('.parcel-data').hide();
			else $('.parcel-data').show();
		}
	});

	$('[name="acoForm.garage"]').on('change', function () {
		hideAllTips();
		var value = $(this).val();
		if (value) {
			if (value == 'false') $('.garage-data').hide();
			else $('.garage-data').show();
		}
	});

	$('.depend').on('change', function () {
		var $this = $(this),
		value = $this.val();
		if (value) {
			var sub_element = $('[name="' + $this.data('depend') + '"]');
			if (value == 'true') {
				sub_element.rules('add', { required: true, messages: { required: 'Пожалуйста, укажите долю собственности'} });
			} else {
				sub_element.rules('remove', "required");
				sub_element.removeAttr('required');
				sub_element.parents('.form-group').removeClass('has-error');
			}
		}
	});


	$('#btn_next').on('click', function () {
		step_next();
	});

	$('#btn_prev').on('click', function () {
		step_prev();
	});

	$('#aco .contact-form__steps .step').on('click', function () {
		var step = parseInt($(this).data('step'), 10);
		//step_set(step);
		return false;
	})

	$('#acoForm_checksms_popup_check').on('click', function () {
		var t = $(this);
		var code = $('#acoForm_checksms_popup_code');
		code.val($.trim(code.val()));
		if (code.val().length != 6) {
			code.focus();
			return false;
		}
		t.attr('disabled', true);

		var jqxhr = $.post(rootPath + 'widgets/form_aco_sms',
		{
			action: 'check',
			sms: code.val()
		})
		.done(function (json) {
			if (json.status === 1) {
				smsChecked = true;
				$.magnificPopup.close();
				$('#btn_finish').trigger('click');
			} else {
				code.focus();
				alert('Неверный код подтверждения...');
			}
			t.attr('disabled', false);
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			alert('Ошибка при проверке SMS...');
			t.attr('disabled', false);
		});
	});

	$('#btn_finish').on('click', function () {
		var _validator = get_validator();
		if (!_validator) return false;
		if (!_validator.element('#acoForm_phone')) { step_set(1); return false; }

		if (!smsChecked) {
			mfq_popup('#acoForm_checksms_popup');
			send_sms();
			repeat_sms_start();
			return false;
		}

		if (!confirm('Завершить заполнение анкеты?')) return false;

		var validate_all = _validator.form(),
		custom_validate_step2_is_valid = validate_step2(),
		custom_validate_step3_is_valid = validate_step3();

		if (!validate_all
			|| !custom_validate_step2_is_valid
			|| !custom_validate_step3_is_valid
		) {
			$('.form-group-err').show();
			return false;
		} else { $('.form-group-err').hide(); }

		var form = $('#acoForm'),
		url = form.attr('action'),
		data = form.serialize();

		var jqxhr = $.post(url, data)
		.done(function (json) {
			if (json.success) {
				$('#aco-feedback-ok').show();
				$('#aco .container:first-child').slideUp();

				try {
					var is_credit_online = form_options && form_options.page && form_options.page == 'credit_online',
						label = is_credit_online ? 'credit_online' : null;
					GTM.push("Длинная анкета", "Кредит", label);
					GTM.conversion(
						$.trim($('#acoForm_lastname').val() + ' ' + $('#acoForm_name').val() + ' ' + $('#acoForm_partname').val()),
						$('#acoForm_phone').val(),
						$('#acoForm_email').val(),
						"Длинная анкета - кредит",
						form_options.page,
						json.request_id,
						form_options.refid,
						form_options.goal
					);
				} catch (_) { }

				if (options && options.source_id && json.request_id) {
					if (options.source_id == 594)
						$('#conversion_594').html('<img src="https://bankiru.go2cloud.org/SLIk?adv_sub=' + json.request_id + '" width="1" height="1" />');
					if (options.source_id == 646)
						$('#conversion_646').html('<img src="https://bankiru.go2cloud.org/SLJX?adv_sub=' + json.request_id + '" width="1" height="1" />');
					if (options.source_id == 679)
						$('#conversion_679').html('<img src="https://bankiru.go2cloud.org/SLJX?adv_sub=' + json.request_id + '" width="1" height="1" />');
					if (options.source_id == 680)
						$('#conversion_680').html('<img src="https://bankiru.go2cloud.org/SLJX?adv_sub=' + json.request_id + '" width="1" height="1" />');
				}

			} else {
				alert(json.message);
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			alert('Ошибка при отправке формы');
		});

	});

	$('#acoForm_checksms_popup_send_btn').on('click', function () {
		smsChecked = false;
		send_sms();
		set_seconds(seconds_interval);
		$('#acoForm_checksms_popup_send_message').show();
		$('#acoForm_checksms_popup_send').hide();
		repeat_sms_start();
	});

	set_seconds(seconds_interval);

	//$('#acoForm_advertizer').trigger('change');
	$('#acoForm_address_second').trigger('change');

	var vld = get_validator();
	vld.settings.errorPlacement = function (error, element) {
		var el = $(element);
		if (!(el.hasClass('tooltipstered-right') || el.hasClass('tooltipstered-custom'))) return;
		var lastError = el.data('lastError'), newError = $(error).text();
		el.data('lastError', newError);
		if (newError !== '' && newError !== lastError) {
			try {
				el.tooltipster('content', newError);
				el.tooltipster('show');
			} catch (_) { }
		}
	};
	vld.settings.success = function (label, element) {
		var el = $(element);
		if (!(el.hasClass('tooltipstered-right') || el.hasClass('tooltipstered-custom'))) return;
		try {
			el.tooltipster('hide');
		} catch (_) { }
	}
}

$(function () {

	if (options.HideFinishButton) $('#btn_finish').hide();

	//хак для валидации инпутов
	$('input[type="text"]').each(function () {
		$(this).on('blur', function () {
			var el = $(this);
			setTimeout(function () {
				var elv = get_validator().element(el);
				var t = elv;
			}, 0);
		});
	});

	//перепроверка радиокнопок и чекбоксов при выборе значения
	$('.jq-radio-styled, .jq-checkbox-styled').on('click', function () {
		var el = $('input:first-child', $(this));
		el.valid();
	});

	if (form_options.page != 'credit_online' && form_options.page != 'credit_calc2') init_step1();


});

// #region валидация шагов

var validate_step1 = function () {
	return true;
};

var validate_step2 = function () {

	/*if (!$('#acoForm_phone_number').val() && !$('#acoForm_mobile_second').val()) {
		$('#acoForm_phone_number').addClass('input-validation-error').parents('.form-group').addClass('has-error');
		$('#acoForm_mobile_second').addClass('input-validation-error').parents('.form-group').addClass('has-error');
		return false;
	}*/

	return true;
};

var validate_step3 = function () {

	return true;
};

var validate_step = function (step_n) {
	var _validator = get_validator();
	var textboxes = $('#acoForm_step' + step_n + ' input[type=text]'),
		tb_valid = true,
		custom_valid = true;

	$.each(textboxes, function (i, item) {
		var item_valid = _validator.element(item);
		if (!item_valid) tb_valid = false;
	});

	var vs = false, vsc = false;
	switch (step_n) {
		case 1: { vs = validate_step1(); vsc = validate_step1_custom(); break; }
		case 2: { vs = validate_step2(); vsc = validate_step2_custom(); break; }
		case 3: { vs = validate_step3(); vsc = validate_step3_custom(); break; }
	}
	custom_valid = vs && vsc;
	return tb_valid && custom_valid;
};

var validate_step1_custom = function () {
	var _validator = get_validator();
	var v1 = _validator.element('#acoForm_loan_product'),
		v2 = true,//_validator.element('[name="acoForm.life_insurance"]'),
		v3 = true,//_validator.element('[name="acoForm.insurance_payment"]'),
		v4 = _validator.element('#acoForm_city'),
		v5 = true,//_validator.element('#acoForm_office'),
		v6 = _validator.element('#acoForm_agree');

	var res = v1 && v2 && v3 && v4 && v5 && v6;
	return res;
};

var validate_step2_custom = function () {
	var _validator = get_validator();
	var v01 = _validator.element('[name="acoForm.sex"]'),
		v02 = _validator.element('#acoForm_living_foundation'),
		v03 = _validator.element('#acoForm_marital_status'),
		v04 = _validator.element('[name="acoForm.registration_type"]'),
		v05 = _validator.element('[name="acoForm.flat"]'),
		v06 = _validator.element('[name="acoForm.flat_share_ownership"]'),
		v07 = _validator.element('[name="acoForm.countryhouse"]'),
		v08 = _validator.element('[name="acoForm.countryhouse_share_ownership"]'),
		v09 = _validator.element('[name="acoForm.parcel"]'),
		v10 = _validator.element('[name="acoForm.parcel_share_ownership"]'),
		v11 = _validator.element('[name="acoForm.garage"]'),
		v12 = _validator.element('[name="acoForm.garage_share_ownership"]'),
		v13 = _validator.element('[name="acoForm.car"]');

	var res = v01 && v02 && v03 && v04 && v05 && v06 && v07 && v08 && v09 && v10 && v11 && v12 && v13;
	return res;
};

var validate_step3_custom = function () {
	var _validator = get_validator();
	var v1 = _validator.element('#acoForm_education'),
		v2 = _validator.element('#acoForm_employment'),
		v3 = _validator.element('#acoForm_company_type'),
		v4 = _validator.element('#acoForm_company_employee_count'),
		v5 = _validator.element('#acoForm_sphere_of_activity'),
		v6 = _validator.element('#acoForm_post');

	var res = v1 && v2 && v3 && v4 && v5 && v6;
	return res;
};


// #endregion


// #region Авто-заполнение формы

$(function () {

	if (location.hash == '#auto') {

		/* #region Step 1 */

		$('#acoForm_amount').val('350000');
		$('#acoForm_period').val('14');
		$('#acoForm_lastname').val('Пупкин');
		$('#acoForm_name').val('Иван');
		$('#acoForm_partname').val('Иванович');
		$('#acoForm_birthdate').val('09.03.1970');
		$('#acoForm_email').val('pupkin@mail.ru');
		$('#acoForm_phone').val('+7 (983) 304-3763');
		$('[name="acoForm.life_insurance"]:first').trigger('click');
		$('[name="acoForm.insurance_payment"]:first').trigger('click');

		/* #endregion */

		/* #region Step 2 */

		$('#acoForm_place_of_birth').val('Новосибирск');
		$('#acoForm_passport_series').val('12 34');
		$('#acoForm_passport_number').val('123456');
		$('#acoForm_passport_series_old').val('56 78');
		$('#acoForm_passport_number_old').val('654321');
		$('#acoForm_passport_date').val('12.03.2004');
		$('#acoForm_passport_issuing_authority').val('УВД Центрального района г. Новосибирска');
		$('#acoForm_passport_subdivision_code').val('123-456');
		$('#acoForm_previous_surname').val('Васильев');
		$('#acoForm_previous_surname_info').val('Брак');
		$('.form-group.previous_surname_info').show();
		$('[name="acoForm.sex"]:first').trigger('click');
		$('#acoForm_inn').val('123456789012');
		$('#acoForm_document_second_number').val('123456789012');
		$('#acoForm_region_first').val('Новосибирская область');
		$('#acoForm_city_first').val('Новосибирск');
		$('#acoForm_street_first').val('Красный проспект');
		$('#acoForm_house_first').val('12');
		$('#acoForm_building_first').val('A');
		$('#acoForm_flat_first').val('34');
		$('#acoForm_registration_date').val('13.06.2007');
		$('[name="acoForm.address_second"]').trigger('click');
		$('#acoForm_region_second').val('Новосибирская область');
		$('#acoForm_city_second').val('Новосибирск');
		$('#acoForm_street_second').val('Красный проспект');
		$('#acoForm_house_second').val('13');
		$('#acoForm_building_second').val('B');
		$('#acoForm_flat_second').val('67');

		/* #endregion */

		/* #region Step 3 */

		$('#acoForm_phone_code').val('383');
		$('#acoForm_phone_number').val('1234567');
		//$('#acoForm_mobile_second').val('+7 (913) 765-4321');
		$('#acoForm_dependents_number').val('3');
		$('[name="acoForm.employment"]').attr('checked', 'checked').trigger('refresh');
		$('#acoForm_company_name').val('ЗАО БКС');
		$('#acoForm_company_region').val('Новосибирская область');
		$('#acoForm_company_city').val('Новосибирск');
		$('#acoForm_company_street').val('Советская');
		$('#acoForm_company_house').val('37');
		$('#acoForm_company_building').val('C');
		$('#acoForm_company_office').val('508');
		$('#acoForm_company_phone_code').val('805');
		$('#acoForm_company_phone_number').val('7855336');
		$('#acoForm_company_year').val('1998');
		$('#acoForm_sphere_of_activity_other').val('Forex');
		$('#acoForm_post').val('Веб-программист');
		$('#acoForm_work_experience_total').val('120');
		$('#acoForm_work_experience_current').val('48');

		/* #endregion */

		/* #region Step 4 */

		$('#acoForm_average_monthly_income').val('99500,50');
		$('#acoForm_rent').val('20000,50');
		$('#acoForm_payments_and_debt').val('10000,50');
		$('#acoForm_insurance_payments').val('9000,50');
		$('#acoForm_payments_on_loans_and_credit_cards').val('8000,50');
		$('[name="acoForm.car"]:first').trigger('click');
		$('[name="acoForm.car_manufacturer"]:first').trigger('click');
		$('#acoForm_car_registration_mark').val('A213BC54RUS');
		$('#acoForm_car_brand').val('Honda');
		$('#acoForm_car_model').val('Civic');
		$('#acoForm_car_year').val('2008');
		$('[name="acoForm.flat"]:first').trigger('click');
		$('[name="acoForm.countryhouse"]:first').trigger('click');
		$('[name="acoForm.parcel"]:first').trigger('click');
		$('[name="acoForm.garage"]:first').trigger('click');
		$('[value="partial"]').trigger('click');
		$('#acoForm_other_property').val('Мотоцикл');
		$('[name="acoForm.existing_credit_agreements"]:first').trigger('click');
		$('#acoForm_banks').val('ТКС, Сбербанк');
		$('#acoForm_total_liabilities_for_all_active_loans').val('90000,50');
		$('#acoForm_total_monthly_payments_on_all_loans').val('5000,50');
		$('[name="acoForm.additional_questions"]:first').trigger('click');
		$('[name="acoForm.judicial_decision"]').attr('checked', 'checked').trigger('refresh');
		$('[name="acoForm.trial"]').attr('checked', 'checked').trigger('refresh');
		$('[name="acoForm.court_decision"]').attr('checked', 'checked').trigger('refresh');
		$('[name="acoForm.other_banks_loans"]').attr('checked', 'checked').trigger('refresh');
		$('#acoForm_info').val('Подробная информация...');
		$('#acoForm_advertizer_other').val('http://bcs-bank.com');

		/* #endregion */

	}

});

// #endregion

function aco_start(aco_options) {
	$('#form').slideUp();
	$('#aco').slideDown();
	init_aco();
	if (!!aco_options) {
		form_options = aco_options;
		if (aco_options.product) $('#acoForm_loan_product').val(aco_options.product).trigger('change');
		if (aco_options.skip_step1) step_set(2);
	}

	var amount = $('#callbackForm_amount').val() || $('[name="sum"]').val(),
		period = $('#callbackForm_period').val() || $('[name="srok"]').val(),
		lastname = $('#callbackForm_lastname').val(),
		name = $('#callbackForm_name').val(),
		partname = $('#callbackForm_partname').val(),
		email = $('#callbackForm_email').val(),
		phone = $('#callbackForm_phone').val(),
		city = $('#callbackForm_city').val();

	$('#acoForm_amount').val(amount);
	$('#acoForm_period').val(period);
	$('#acoForm_lastname').val(lastname);
	$('#acoForm_name').val(name);
	$('#acoForm_partname').val(partname);
	$('#acoForm_email').val(email);
	$('#acoForm_phone').val(phone);
	if (city != '00000000-0000-0000-0000-000000000000') $('#acoForm_city').val(city).trigger('change');
};

function send_sms() {
	var jqxhr = $.post(rootPath + 'widgets/form_aco_sms',
		{
			action: 'set',
			phone: $('#acoForm_phone').val()
		})
		.done(function (json) {
			if (json.code) $('#acoForm_checksms_popup_code').val(json.code);
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			alert('Ошибка при отправке SMS...');
		});
};


// #region KLADR

var regions = [];
var region_first_data, region_second_data, company_region_data;
var city_first_data, city_second_data, company_city_data;
var street_first_data, street_second_data, company_street_data;
var street_data = [];
var city_data = [];

var getRegionData = function (region) {
	if (typeof (region) == 'undefined' || !region) return;
	var data = null;
	$.each(regions, function (i, reg) {
		if (reg.NAME.toUpperCase() == region.toUpperCase()) { data = reg; }
	});
	return data;
};

var getCityData = function (city) {
	var data = null, cnt = 0, cd = null;
	if (typeof (city_data) != 'undefined' && city_data != null) cd = city_data[city];
	if (typeof (cd) != 'undefined' && cd != null) {
		$.each(cd, function (i, c) {
			if (c.NAME.toUpperCase() == city.toUpperCase()) { data = c; cnt++; }
		});
	}
	return cnt == 1 ? data : null;
};

var getStreetData = function (street) {
	var data = null, cnt = 0, sd = null;
	if (typeof (street_data) != 'undefined' && street_data != null) sd = street_data[street];
	if (typeof (sd) != 'undefined' && sd != null) {
		$.each(sd, function (i, s) {
			if (s.NAME.toUpperCase() == street.toUpperCase()) { data = s; cnt++; }
		});
	}
	return cnt == 1 ? data : null;
};

var regionMatcher = function (strs) {
	return function findMatches(q, cb) {
		var matches = [], substringRegex;
		substrRegex = new RegExp(q, 'i');
		$.each(strs, function (i, str) {
			if (substrRegex.test(str.NAME)) {
				matches.push(str.NAME);
			}
		});

		cb(matches);
	};
};

var houseMatcher = function (strs) {
	return function findMatches(q, cb) {
		var matches = [], substringRegex;
		substrRegex = new RegExp(q, 'i');
		$.each(strs, function (i, str) {
			if (substrRegex.test(str.Building) || substrRegex.test(str.Corpus) || substrRegex.test(str.Construction)) {
				matches.push(str);
			}
		});

		cb(matches);
	};
};

var InitHousesByStreet = function (street_code, element) {
	$.getJSON('http://api.bcs.ru/kladr/v1/housesbystreet/' + street_code).done(function (data) {
		if (!data) return;
		initHouseTypeAhead(element, data);
	});
};

var setCityFirst = function (RegionSuggestion) {
	if (typeof (RegionSuggestion) != 'undefined') {
		region_first_data = getRegionData(RegionSuggestion);
		$('#acoForm_region_first_code').val(region_first_data.CODE);
		$('#acoForm_region_first_type').val(region_first_data.SOCR);
		initTypeAhead('#acoForm_city_first', 6, region_first_data.CODE);
	} else {
		region_first_data = null;
		$('#acoForm_region_first_code').val('');
		$('#acoForm_region_first_type').val('');
	}
};
var setStreetFirst = function (CitySuggestion) {
	if (typeof (CitySuggestion) != 'undefined') {
		city_first_data = CitySuggestion;
		$('#acoForm_city_first_code').val(city_first_data.CODE);
		$('#acoForm_city_first_type').val(city_first_data.SOCR);
		$('#acoForm_district_first').val(city_first_data.DISTRICT_NAME);
		$('#acoForm_district_first_code').val(city_first_data.DISTRICT_CODE);
		$('#acoForm_district_first_type').val(city_first_data.DISTRICT_SOCR);
		initTypeAhead('#acoForm_street_first', 5, city_first_data.CODE);
	} else {
		city_first_data = null;
		$('#acoForm_city_first_code').val('');
		$('#acoForm_city_first_type').val('');
		$('#acoForm_district_first').val('');
		$('#acoForm_district_first_code').val('');
		$('#acoForm_district_first_type').val('');
	}
};
var selectStreetFirst = function (StreetSuggestion) {
	if (typeof (StreetSuggestion) != 'undefined') {
		street_first_data = StreetSuggestion;
		$('#acoForm_street_first_code').val(street_first_data.CODE);
		$('#acoForm_street_first_type').val(street_first_data.SOCR);
		InitHousesByStreet(street_first_data.CODE, '#acoForm_house_first, #acoForm_building_first');
	} else {
		street_first_data = null;
		$('#acoForm_street_first_code').val();
		$('#acoForm_street_first_type').val();
	}
};
var selectHouseFirst = function (HouseSuggestion) {
	if (typeof (HouseSuggestion) != 'undefined') {
		$('#acoForm_house_first').val(HouseSuggestion.Building);
		var corpus = !HouseSuggestion.Corpus ? '' : HouseSuggestion.Corpus,
					construction = !HouseSuggestion.Construction ? '' : 'стр. ' + HouseSuggestion.Construction,
					building = [];
		if (!!corpus) building.push(corpus);
		if (!!construction) building.push(construction);
		building = building.join(', ');
		$('#acoForm_building_first').val(building);
		try { $('#acoForm_building_first').typeahead('val', building); } catch (_) { };
	} else {
		$('#acoForm_house_first').val('');
		$('#acoForm_building_first').val('');
	}
};

var setCitySecond = function (RegionSuggestion) {
	if (typeof (RegionSuggestion) != 'undefined') {
		region_second_data = getRegionData(RegionSuggestion);
		$('#acoForm_region_second_code').val(region_second_data.CODE);
		$('#acoForm_region_second_type').val(region_second_data.SOCR);
		initTypeAhead('#acoForm_city_second', 6, region_second_data.CODE);
	} else {
		region_second_data = null;
		$('#acoForm_region_second_code').val('');
		$('#acoForm_region_second_type').val('');
	}
};
var setStreetSecond = function (CitySuggestion) {
	if (typeof (CitySuggestion) != 'undefined') {
		city_second_data = CitySuggestion;
		$('#acoForm_city_second_code').val(city_second_data.CODE);
		$('#acoForm_city_second_type').val(city_second_data.SOCR);
		$('#acoForm_district_second').val(city_second_data.DISTRICT_NAME);
		$('#acoForm_district_second_code').val(city_second_data.DISTRICT_CODE);
		$('#acoForm_district_second_type').val(city_second_data.DISTRICT_SOCR);
		initTypeAhead('#acoForm_street_second', 5, city_second_data.CODE);
	} else {
		city_second_data = null;
		$('#acoForm_city_second_code').val('');
		$('#acoForm_city_second_type').val('');
		$('#acoForm_district_second_code').val('');
		$('#acoForm_district_second_type').val('');
	}
};
var selectStreetSecond = function (StreetSuggestion) {
	if (typeof (StreetSuggestion) != 'undefined') {
		street_second_data = StreetSuggestion;
		$('#acoForm_street_second_code').val(street_second_data.CODE);
		$('#acoForm_street_second_type').val(street_second_data.SOCR);
		InitHousesByStreet(street_second_data.CODE, '#acoForm_house_second, #acoForm_building_second');
	} else {
		street_second_data = null;
		$('#acoForm_street_second_code').val('');
		$('#acoForm_street_second_type').val('');
	}
};
var selectHouseSecond = function (HouseSuggestion) {
	if (typeof (HouseSuggestion) != 'undefined') {
		$('#acoForm_house_second').val(HouseSuggestion.Building);
		var corpus = !HouseSuggestion.Corpus ? '' : HouseSuggestion.Corpus,
					construction = !HouseSuggestion.Construction ? '' : 'стр. ' + HouseSuggestion.Construction,
					building = [];
		if (!!corpus) building.push(corpus);
		if (!!construction) building.push(construction);
		building = building.join(', ');
		$('#acoForm_building_second').val(building);
		try { $('#acoForm_building_second').typeahead('val', building); } catch (_) { };
	} else {
		$('#acoForm_house_second').val('');
		$('#acoForm_building_second').val('');
	}
};

var setCityCompany = function (RegionSuggestion) {
	if (typeof (RegionSuggestion) != 'undefined') {
		company_region_data = getRegionData(RegionSuggestion);
		$('#acoForm_company_region_code').val(company_region_data.CODE);
		$('#acoForm_company_region_type').val(company_region_data.SOCR);
		initTypeAhead('#acoForm_company_city', 6, company_region_data.CODE);
	} else {
		company_region_data = null;
		$('#acoForm_company_region_code').val('');
		$('#acoForm_company_region_type').val('');
	}
};
var setStreetCompany = function (CitySuggestion) {
	if (typeof (CitySuggestion) != 'undefined') {
		company_city_data = CitySuggestion;
		$('#acoForm_company_city_code').val(company_city_data.CODE);
		$('#acoForm_company_city_type').val(company_city_data.SOCR);
		$('#acoForm_company_district').val(company_city_data.DISTRICT_NAME);
		$('#acoForm_company_district_code').val(company_city_data.DISTRICT_CODE);
		$('#acoForm_company_district_type').val(company_city_data.DISTRICT_SOCR);
		initTypeAhead('#acoForm_company_street', 5, company_city_data.CODE);
	} else {
		city_second_data = null;
		$('#acoForm_company_city_code').val('');
		$('#acoForm_company_city_type').val('');
		$('#acoForm_company_district_code').val('');
		$('#acoForm_company_district_type').val('');
	}
};
var selectStreetCompany = function (StreetSuggestion) {
	if (typeof (StreetSuggestion) != 'undefined') {
		company_street_data = StreetSuggestion;
		$('#acoForm_company_street_code').val(company_street_data.CODE);
		$('#acoForm_company_street_type').val(company_street_data.SOCR);
		InitHousesByStreet(company_street_data.CODE, '#acoForm_company_house, #acoForm_company_building');
	} else {
		company_street_data = null;
		$('#acoForm_company_street_code').val('');
		$('#acoForm_company_street_type').val('');
	}
};
var selectHouseCompany = function (HouseSuggestion) {
	if (typeof (HouseSuggestion) != 'undefined') {
		$('#acoForm_company_house').val(HouseSuggestion.Building);
		var corpus = !HouseSuggestion.Corpus ? '' : HouseSuggestion.Corpus,
					construction = !HouseSuggestion.Construction ? '' : 'стр. ' + HouseSuggestion.Construction,
					building = [];
		if (!!corpus) building.push(corpus);
		if (!!construction) building.push(construction);
		building = building.join(', ');
		$('#acoForm_company_building').val(building);
		try { $('#acoForm_company_building').typeahead('val', building); } catch (_) { };
	} else {
		$('#acoForm_company_house').val('');
		$('#acoForm_company_building').val('');
	}
};

var initHouseTypeAhead = function (id, houses) {
	$(id).typeahead('destroy');
	$(id).typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
		name: 'search',
		limit: 20,
		display: 'Building',
		source: houseMatcher(houses),
		templates: {
			notFound: '<div class="notfound">Ничего не найдено</div>',
			suggestion: function (data) {
				var Corpus = !data.Corpus ? '' : ', корп. ' + data.Corpus;
				var Construction = !data.Construction ? '' : ', стр. ' + data.Construction;
				return '<div>' + data.Building + Corpus + Construction + '</div>';
			}
		}
	});
};

var initTypeAhead = function (id, level, parent) {
	$(id).typeahead('destroy');
	$(id).typeahead({
		hint: true,
		highlight: true,
		minLength: 2
	}, {
		name: 'search',
		limit: 20,
		display: 'NAME',
		source: function (query, syncResults) {
			var results = level == 5
				? street_data[query]
				: (level == 3 || level == 6 ? city_data[query] : null);
			//var results = level == 3 ? city_data[query] : null;
			if (typeof (results) == 'undefined' || results == null)
				$.ajax({
					url: 'http://api.bcs.ru/kladr/v1/findlocality/' + level + '/' + parent + '/' + query,
					async: false,
					type: 'GET',
					cache: false,
					success: function (data) {
						if (level == 3 || level == 6) city_data[query] = data;
						if (level == 5) street_data[query] = data;
						results = data;
					}
				});
			return syncResults(results);
		},
		templates: {
			notFound: '<div class="notfound">Ничего не найдено</div>',
			suggestion: function (data) {
				var district = data.DISTRICT_CODE ? ' ( ' + data.DISTRICT_NAME + ', ' + data.DISTRICT_SOCR + ' )' : '';
				return '<div>' + data.NAME + ', ' + data.SOCR + district + '</div>';
			}
		}
	});
};

$(function () {

	$.getJSON('http://api.bcs.ru/kladr/v1/findlocality/1/0').done(function (data) {
		regions = data;

		$('#acoForm_region_first, #acoForm_region_second, #acoForm_company_region').typeahead({
			hint: true,
			highlight: true,
			minLength: 3
		},
				{
					limit: 10,
					source: regionMatcher(regions)
				});
	});

	$('#acoForm_region_first').on('typeahead:select', function (ev, suggestion) {
		setCityFirst(suggestion);
	}).on('typeahead:change', function (ev, suggestion) {
		if (suggestion) setCityFirst(suggestion);
	});
	$('#acoForm_city_first').on('typeahead:select', function (ev, suggestion) {
		setStreetFirst(suggestion);
	}).on('change', function (ev) {
		var suggestion = getCityData($(this).val());
		if (suggestion) setStreetFirst(suggestion);
	});
	$('#acoForm_street_first').on('typeahead:select', function (ev, suggestion) {
		selectStreetFirst(suggestion);
	}).on('change', function (ev) {
		var suggestion = getStreetData($(this).val());
		if (suggestion) selectStreetFirst(suggestion);
	});
	$('#acoForm_house_first, #acoForm_building_first').on('typeahead:select', function (ev, suggestion) {
		var s = suggestion;
		selectHouseFirst(suggestion);
	});

	$('#acoForm_region_second').on('typeahead:select', function (ev, suggestion) {
		setCitySecond(suggestion);
	}).on('typeahead:change', function (ev, suggestion) {
		if (suggestion) setCitySecond(suggestion);
	});
	$('#acoForm_city_second').on('typeahead:select', function (ev, suggestion) {
		setStreetSecond(suggestion);
	}).on('change', function (ev) {
		var suggestion = getCityData($(this).val());
		if (suggestion) setStreetSecond(suggestion);
	});
	$('#acoForm_street_second').on('typeahead:select', function (ev, suggestion) {
		selectStreetSecond(suggestion);
	}).on('change', function (ev) {
		var suggestion = getStreetData($(this).val());
		if (suggestion) selectStreetSecond(suggestion);
	});
	$('#acoForm_house_second, #acoForm_building_second').on('typeahead:select', function (ev, suggestion) {
		var s = suggestion;
		selectHouseSecond(suggestion);
	});

	$('#acoForm_company_region').on('typeahead:select', function (ev, suggestion) {
		setCityCompany(suggestion);
	}).on('typeahead:change', function (ev, suggestion) {
		if (suggestion) setCityCompany(suggestion);
	});
	$('#acoForm_company_city').on('typeahead:select', function (ev, suggestion) {
		setStreetCompany(suggestion);
	}).on('change', function (ev) {
		var suggestion = getCityData($(this).val());
		if (suggestion) setStreetCompany(suggestion);
	});
	$('#acoForm_company_street').on('typeahead:select', function (ev, suggestion) {
		selectStreetCompany(suggestion);
	}).on('change', function (ev) {
		var suggestion = getStreetData($(this).val());
		if (suggestion) selectStreetCompany(suggestion);
	});
	$('#acoForm_company_house, #acoForm_company_building').on('typeahead:select', function (ev, suggestion) {
		var s = suggestion;
		selectHouseCompany(suggestion);
	});

	$('#acoForm_index_first').on('blur', function () {
		var index = $(this).val();
		if (!index || index.length != 6 || isNaN(index)) return;
		$.getJSON('http://api.bcs.ru/kladr/v1/addressbyindex/' + index).done(function (data) {
			if (!data) return;
			var _validator = get_validator();
			if (data.region_CODE) {
				region_first_data = { NAME: data.region, CODE: data.region_CODE, SOCR: data.region_SOCR };
				$('#acoForm_region_first').val(region_first_data.NAME);
				try { $('#acoForm_region_first').typeahead('val', region_first_data.NAME); } catch (_) { }
				_validator.element('#acoForm_region_first');
				$('#acoForm_region_first_code').val(region_first_data.CODE);
				$('#acoForm_region_first_type').val(region_first_data.SOCR);
				initTypeAhead('#acoForm_city_first', 6, region_first_data.CODE);
			}

			if (data.district_CODE) {
				if (!city_first_data) city_first_data = {};
				city_first_data.DISTRICT_NAME = data.district;
				city_first_data.DISTRICT_CODE = data.district_CODE;
				city_first_data.DISTRICT_SOCR = data.district_SOCR;
				$('#acoForm_district_first_code').val(city_first_data.DISTRICT_CODE);
				$('#acoForm_district_first_type').val(city_first_data.DISTRICT_SOCR);
			}

			if (data.city_CODE) {
				if (!city_first_data) city_first_data = {};
				city_first_data.NAME = data.city;
				city_first_data.CODE = data.city_CODE;
				city_first_data.SOCR = data.city_SOCR;
				$('#acoForm_city_first').val(city_first_data.NAME);
				try { $('#acoForm_city_first').typeahead('val', city_first_data.NAME); } catch (_) { }
				_validator.element('#acoForm_city_first');
				$('#acoForm_city_first_code').val(city_first_data.CODE);
				$('#acoForm_city_first_type').val(city_first_data.SOCR);
				initTypeAhead('#acoForm_street_first', 5, city_first_data.CODE);
				$('#acoForm_street_first').focus();
			}
		});
	});

	$('#acoForm_index_second').on('blur', function () {
		var index = $(this).val();
		if (!index || index.length != 6 || isNaN(index)) return;
		$.getJSON('http://api.bcs.ru/kladr/v1/addressbyindex/' + index).done(function (data) {
			if (!data) return;
			var _validator = get_validator();
			if (data.region_CODE) {
				region_second_data = { NAME: data.region, CODE: data.region_CODE, SOCR: data.region_SOCR };
				$('#acoForm_region_second').val(region_second_data.NAME);
				try { $('#acoForm_region_second').typeahead('val', region_second_data.NAME); } catch (_) { }
				_validator.element('#acoForm_region_second');
				$('#acoForm_region_second_code').val(region_second_data.CODE);
				$('#acoForm_region_second_type').val(region_second_data.SOCR);
				initTypeAhead('#acoForm_city_second', 6, region_second_data.CODE);
			}

			if (data.district_CODE) {
				if (!city_second_data) city_second_data = {};
				city_second_data.DISTRICT_NAME = data.district;
				city_second_data.DISTRICT_CODE = data.district_CODE;
				city_second_data.DISTRICT_SOCR = data.district_SOCR;
				$('#acoForm_district_second_code').val(city_second_data.DISTRICT_CODE);
				$('#acoForm_district_second_type').val(city_second_data.DISTRICT_SOCR);
			}

			if (data.city_CODE) {
				if (!city_second_data) city_second_data = {};
				city_second_data.NAME = data.city;
				city_second_data.CODE = data.city_CODE;
				city_second_data.SOCR = data.city_SOCR;
				$('#acoForm_city_second').val(city_second_data.NAME);
				try { $('#acoForm_city_second').typeahead('val', city_second_data.NAME); } catch (_) { }
				_validator.element('#acoForm_city_second');
				$('#acoForm_city_second_code').val(city_second_data.CODE);
				$('#acoForm_city_second_type').val(city_second_data.SOCR);
				initTypeAhead('#acoForm_street_second', 5, city_second_data.CODE);
				$('#acoForm_street_second').focus();
			}
		});
	});

	$('#acoForm_company_index').on('blur', function () {
		var index = $(this).val();
		if (!index || index.length != 6 || isNaN(index)) return;
		$.getJSON('http://api.bcs.ru/kladr/v1/addressbyindex/' + index).done(function (data) {
			if (!data) return;
			var _validator = get_validator();
			if (data.region_CODE) {
				company_region_data = { NAME: data.region, CODE: data.region_CODE, SOCR: data.region_SOCR };
				$('#acoForm_company_region').val(company_region_data.NAME);
				try { $('#acoForm_company_region').typeahead('val', company_region_data.NAME); } catch (_) { }
				_validator.element('#acoForm_company_region');
				$('#acoForm_company_region_code').val(company_region_data.CODE);
				$('#acoForm_company_region_type').val(company_region_data.SOCR);
				initTypeAhead('#acoForm_company_city', 6, company_region_data.CODE);
			}

			if (data.district_CODE) {
				if (!company_city_data) company_city_data = {};
				company_city_data.DISTRICT_NAME = data.district;
				company_city_data.DISTRICT_CODE = data.district_CODE;
				company_city_data.DISTRICT_SOCR = data.district_SOCR;
				$('#acoForm_company_district_code').val(company_city_data.DISTRICT_CODE);
				$('#acoForm_company_district_type').val(company_city_data.DISTRICT_SOCR);
			}

			if (data.city_CODE) {
				if (!company_city_data) company_city_data = {};
				company_city_data.NAME = data.city;
				company_city_data.CODE = data.city_CODE;
				company_city_data.SOCR = data.city_SOCR;
				$('#acoForm_company_city').val(company_city_data.NAME);
				try { $('#acoForm_company_city').typeahead('val', company_city_data.NAME); } catch (_) { }
				_validator.element('#acoForm_company_city');
				$('#acoForm_company_city_code').val(company_city_data.CODE);
				$('#acoForm_company_city_type').val(company_city_data.SOCR);
				initTypeAhead('#acoForm_company_street', 5, company_city_data.CODE);
				$('#acoForm_company_street').focus();
			}
		});
	});

});

// #endregion
