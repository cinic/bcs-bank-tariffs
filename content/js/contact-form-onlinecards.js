var smsChecked = false,
	validator = null,
	currentStep = 1;

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
			$('#onlinecardsForm_checksms_popup_send_message').hide();
			$('#onlinecardsForm_checksms_popup_send').show();
		}
	}, 1000);
}

function set_seconds(sec) {
	var m = sec / 60 >> 0, s = sec - m * 60;
	$('#onlinecardsForm_checksms_popup_send_message span').text((m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s));
};

// #endregion sms interval

// #region common

function get_validator() {
	if (!validator) validator = $('#onlinecardsForm').validate();
	return validator;
}

function isDate(value) {
	if (value.length == 10) {
		var day = parseInt(value.substr(0, 2), 10);
		var month = parseInt(value.substr(3, 2), 10) - 1;
		var year = parseInt(value.substr(6, 4), 10);
		var valDate = new Date(year, month, day);
		if ((day == valDate.getDate()) && (month == valDate.getMonth()) && (year == valDate.getFullYear())) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
}

function compareDates(date1, date2) {
	if (isDate(date1) && isDate(date2)) {
		var day1 = parseInt(date1.substr(0, 2), 10);
		var month1 = parseInt(date1.substr(3, 2), 10) - 1;
		var year1 = parseInt(date1.substr(6, 4), 10);
		var day2 = parseInt(date2.substr(0, 2), 10);
		var month2 = parseInt(date2.substr(3, 2), 10) - 1;
		var year2 = parseInt(date2.substr(6, 4), 10);
		var valDate1 = new Date(year1, month1, day1);
		var valDate2 = new Date(year2, month2, day2);
		if (valDate1 > valDate2) {
			return 1;
		}
		else {
			if (valDate1 < valDate2) {
				return -1;
			}
			else {
				return 0;
			}
		}
	}
	else {
		return -2;
	}
}

function getCurrentDateString() {
	var currentDate = new Date();
	var currentDateString = "";
	if (currentDate.getDate() < 10) {
		currentDateString = "0";
	}
	currentDateString = currentDateString + currentDate.getDate() + ".";
	if (currentDate.getMonth() < 9) {
		currentDateString = currentDateString + "0";
	}
	currentDateString = currentDateString + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear();
	return currentDateString;
}

function getCurrentYear() {
	var currentDate = new Date();
	return currentDate.getFullYear();
}

function set_city_offices(city_uid) {
	$('#onlinecardsForm_office_delivery').html('');
	if (!city_uid || !offices) return;

	var city_offices = offices[city_uid];
	if (!city_offices || city_offices.length <= 0) return;

	$.each(city_offices, function (i, item) {
		$('#onlinecardsForm_office_delivery').append($('<option>', {
			value: item.id,
			text: item.name
		}));
	});
}

function validate_step1(){
	if(!validator) return false;

	var v_01 = validator.element('#onlinecardsForm_product'),
		v_02 = validator.element('#onlinecardsForm_city_delivery'),
		v_03 = validator.element('#onlinecardsForm_office_delivery'),
		v_04 = validator.element('#onlinecardsForm_name_last'),
		v_05 = validator.element('#onlinecardsForm_name_first'),
		v_06 = validator.element('#onlinecardsForm_name_middle'),
		v_07 = validator.element('#onlinecardsForm_name_translit'),
		v_08 = validator.element('[name="onlinecardsForm.gender"]'),
		v_09 = validator.element('#onlinecardsForm_date_birth'),
		v_10 = validator.element('#onlinecardsForm_place_birth'),
		v_11 = validator.element('#onlinecardsForm_mobile_phone'),
		v_12 = validator.element('#onlinecardsForm_email'),
		v_13 = validator.element('#onlinecardsForm_secure_word'),
		v_14 = validator.element('#onlinecardsForm_text_ident_serial'),
		v_15 = validator.element('#onlinecardsForm_text_ident_num'),
		v_16 = validator.element('#onlinecardsForm_date_issue'),
		v_17 = validator.element('#onlinecardsForm_code_issue'),
		v_18 = validator.element('#onlinecardsForm_who_issue'),
		v_19 = validator.element('#onlinecardsForm_region_reg'),
		v_20 = validator.element('#onlinecardsForm_city_reg'),
		v_21 = validator.element('#onlinecardsForm_street_reg'),
		v_22 = validator.element('#onlinecardsForm_build_reg_1'),
		v_23 = validator.element('#onlinecardsForm_build_reg_2'),
		v_24 = validator.element('#onlinecardsForm_build_reg_3'),
		v_25 = validator.element('#onlinecardsForm_build_reg_4'),
		v_26 = validator.element('#onlinecardsForm_date_reg'),
		v_27 = validator.element('[name="onlinecardsForm.is_addresses_equal"]'),
		v_28 = validator.element('#onlinecardsForm_region_fact'),
		v_29 = validator.element('#onlinecardsForm_city_fact'),
		v_30 = validator.element('#onlinecardsForm_street_fact'),
		v_31 = validator.element('#onlinecardsForm_build_fact_1'),
		v_32 = validator.element('#onlinecardsForm_build_fact_2'),
		v_33 = validator.element('#onlinecardsForm_build_fact_3'),
		v_34 = validator.element('#onlinecardsForm_build_fact_4'),
		v_35 = validator.element('#onlinecardsForm_confirm_personal_data_rules');

	var res =      v_01 && v_02 && v_03 && v_04 && v_05 && v_06 && v_07 && v_08 && v_09
		&& v_10 && v_11 && v_12 && v_13 && v_14 && v_15 && v_16 && v_17 && v_18 && v_19
		&& v_20 && v_21 && v_22 && v_23 && v_24 && v_25 && v_26 && v_27 && v_28 && v_29
		&& v_30 && v_31 && v_32 && v_33 && v_34 && v_35;
		
	return res;	
}
// #endregion

$(function () {

	// #region validators

	$.validator.addMethod(
		'bcsdate',
		function (a, b, c) {
			if ((compareDates(a, c[0]) >= 0) && (compareDates(c[1], a) >= 0)) {
				return true;
			} else {
				return false;
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsfactaddrrequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.is_addresses_equal"]:checked').val() == 'Нет') {
				if (a == '') {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsconfirmpersdatarules',
		function (a, b) {
			if ($('input[type=submit][clicked=true]').val() == 'Заказать дебетовую карту') {
				return $('#onlinecardsForm_confirm_personal_data_rules').prop('checked');
			} else {
				return true;
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsnamelastchangereason',
		function (a, b) {
			if ($('#onlinecardsForm_prev_name_last').val() != '') {
				if (a == '') {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsinn',
		function (a, b) {
			if (a.length != 12) {
				$('#onlinecardsForm_inn').attr('hint', '');
				return false;
			} else {
				if (a == '000000000000') {
					$('#onlinecardsForm_inn').attr('hint', 'Проверьте правильность ввода ИНН');
					return false;
				} else {
					tmpDigit1 = parseInt(a.substr(0, 1), 10) * 7 + parseInt(a.substr(1, 1), 10) * 2 + parseInt(a.substr(2, 1), 10) * 4 + parseInt(a.substr(3, 1), 10) * 10 + parseInt(a.substr(4, 1), 10) * 3 + parseInt(a.substr(5, 1), 10) * 5 + parseInt(a.substr(6, 1), 10) * 9 + parseInt(a.substr(7, 1), 10) * 4 + parseInt(a.substr(8, 1), 10) * 6 + parseInt(a.substr(9, 1), 10) * 8;
					tmpDigit12 = tmpDigit1 - ((tmpDigit1 / 11 | 0) * 11);
					if (tmpDigit12 == 10) {
						tmpDigit12 = 0;
					}
					tmpDigit2 = parseInt(a.substr(0, 1), 10) * 3 + parseInt(a.substr(1, 1), 10) * 7 + parseInt(a.substr(2, 1), 10) * 2 + parseInt(a.substr(3, 1), 10) * 4 + parseInt(a.substr(4, 1), 10) * 10 + parseInt(a.substr(5, 1), 10) * 3 + parseInt(a.substr(6, 1), 10) * 5 + parseInt(a.substr(7, 1), 10) * 9 + parseInt(a.substr(8, 1), 10) * 4 + parseInt(a.substr(9, 1), 10) * 6 + parseInt(a.substr(10, 1), 10) * 8;
					tmpDigit22 = tmpDigit2 - ((tmpDigit2 / 11 | 0) * 11);
					if (tmpDigit22 == 10) {
						tmpDigit22 = 0;
					}
					if ((tmpDigit12 == parseInt(a.substr(10, 1), 10)) && (tmpDigit22 == parseInt(a.substr(11, 1), 10))) {
						$('#onlinecardsForm_inn').attr('hint', '');
						return true;
					} else {
						$('#onlinecardsForm_inn').attr('hint', 'Проверьте правильность ввода ИНН');
						return false;
					}
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsemploymentrequired',
		function (a, b) {
			if (($('#onlinecardsForm_employment').val() != 'Работаю по найму') && ($('#onlinecardsForm_employment').val() != 'Собственный бизнес')) {
				return true;
			} else {
				if (a == '') {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcstypeemployerrequired',
		function (a, b) {
			if (($('#onlinecardsForm_employment').val() != 'Работаю по найму') && ($('#onlinecardsForm_employment').val() != 'Собственный бизнес')) {
				return true;
			} else {
				if (($('#onlinecardsForm_type_employer').val() == undefined) || ($('#onlinecardsForm_type_employer').val() == '')) {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsspecialityrequired',
		function (a, b) {
			if (($('#onlinecardsForm_employment').val() != 'Работаю по найму') && ($('#onlinecardsForm_employment').val() != 'Собственный бизнес')) {
				return true;
			} else {
				if (($('#onlinecardsForm_speciality').val() == undefined) || ($('#onlinecardsForm_speciality').val() == '')) {
					return false;
				} else {
					return true
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsapartmentownershiprequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.apartment"]:checked').val() == 'Нет') {
				return true;
			} else {
				if (($('input[name="onlinecardsForm.apartment_ownership"]:checked').val() == undefined) || ($('input[name="onlinecardsForm.apartment_ownership"]:checked').val() == '')) {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcshouseownershiprequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.house"]:checked').val() == 'Нет') {
				return true;
			} else {
				if (($('input[name="onlinecardsForm.house_ownership"]:checked').val() == undefined) || ($('input[name="onlinecardsForm.house_ownership"]:checked').val() == '')) {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcslandownershiprequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.land"]:checked').val() == 'Нет') {
				return true;
			} else {
				if (($('input[name="onlinecardsForm.land_ownership"]:checked').val() == undefined) || ($('input[name="onlinecardsForm.land_ownership"]:checked').val() == '')) {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsgarageownershiprequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.garage"]:checked').val() == 'Нет') {
				return true;
			} else {
				if (($('input[name="onlinecardsForm.garage_ownership"]:checked').val() == undefined) || ($('input[name="onlinecardsForm.garage_ownership"]:checked').val() == '')) {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsautotyperequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.auto"]:checked').val() == 'Нет') {
				return true;
			} else {
				if (($('input[name="onlinecardsForm.auto_type"]:checked').val() == undefined) || ($('input[name="onlinecardsForm.auto_type"]:checked').val() == '')) {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsautorequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.auto"]:checked').val() == 'Нет') {
				return true;
			} else {
				if (a == '') {
					return false;
				} else {
					return true;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsautoyear',
		function (a, b) {
			if ($('input[name="onlinecardsForm.auto"]:checked').val() == 'Нет') {
				return true;
			} else {
				if ((parseInt(a, 10) >= 1900) && (parseInt(a, 10) <= getCurrentYear())) {
					return true;
				} else {
					return false;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsothercreditrequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.other_credit"]:checked').val() == 'Нет') {
				return true;
			} else {
				if ((($('#onlinecardsForm_bank_1').val() != '') && ($('#onlinecardsForm_type_credit_1').val() != '') && ($('#onlinecardsForm_annuity_credit_1').val() != '')) || (($('#onlinecardsForm_bank_2').val() != '') && ($('#onlinecardsForm_type_credit_2').val() != '') && ($('#onlinecardsForm_annuity_credit_2').val() != '')) || (($('#onlinecardsForm_bank_3').val() != '') && ($('#onlinecardsForm_type_credit_3').val() != '') && ($('#onlinecardsForm_annuity_credit_3').val() != '')) || (($('#onlinecardsForm_bank_4').val() != '') && ($('#onlinecardsForm_type_credit_4'.val() != '') && ($('#onlinecardsForm_annuity_credit_4').val() != '')))) {
					return true;
				} else {
					return false;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsothercreditcardrequired',
		function (a, b) {
			if ($('input[name="onlinecardsForm.other_credit_card"]:checked').val() == 'Нет') {
				return true;
			} else {
				if ((($('#onlinecardsForm_bank_11').val() != '') && ($('#onlinecardsForm_amt_credit_1').val() != '') && ($('#onlinecardsForm_annuity_credit_11').val() != '')) || (($('#onlinecardsForm_bank_12').val() != '') && ($('#onlinecardsForm_amt_credit_2').val() != '') && ($('#onlinecardsForm_annuity_credit_12').val() != '')) || (($('#onlinecardsForm_bank_13').val() != '') && ($('#onlinecardsForm_amt_credit_3').val() != '') && ($('#onlinecardsForm_annuity_credit_13').val() != '')) || (($('#onlinecardsForm_bank_14').val() != '') && ($('#onlinecardsForm_amt_credit_4').val() != '') && ($('#onlinecardsForm_annuity_credit_14').val() != ''))) {
					return true;
				} else {
					return false;
				}
			}
		},
		''
	);
	$.validator.addMethod(
		'bcsadditionalinforequired',
		function (a, b) {
			if (($('input[name="onlinecardsForm.court_decision"]:checked').val() == 'Нет') && ($('input[name="onlinecardsForm.court_process"]:checked').val() == 'Нет') && ($('input[name="onlinecardsForm.court_decision_1"]:checked').val() == 'Нет') && ($('input[name="onlinecardsForm.try_other_credit"]:checked').val() == 'Нет')) {
				return true;
			} else {
				if (a != '') {
					return true;
				} else {
					return false;
				}
			}
		},
		''
	);

	// #endregion
	set_city_offices($('#onlinecardsForm_city_delivery').val());

	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: 'Пред',
		nextText: 'След',
		currentText: 'Сегодня',
		monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
		dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
		dayNamesShort: ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Сбт'],
		dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		weekHeader: 'Не',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};
	$.datepicker.setDefaults($.datepicker.regional['ru']);
	var calendar_img = (rootPath + '/content/img/calendar.png').replace('//', '/');
	$('#onlinecardsForm_date_birth').datepicker({
		showOn: 'button',
		buttonImage: calendar_img,
		buttonImageOnly: true
	});
	$('#onlinecardsForm_date_issue').datepicker({
		showOn: 'button',
		buttonImage: calendar_img,
		buttonImageOnly: true
	});
	$('#onlinecardsForm_date_reg').datepicker({
		showOn: 'button',
		buttonImage: calendar_img,
		buttonImageOnly: true
	});
	
	$('#onlinecardsForm_city_delivery').on('change', function(){
		set_city_offices($(this).val());
	});
	
	$('[name="onlinecardsForm.is_addresses_equal"]').on('change', function(){
		if ($(this).val() == "Нет") {
			$(".address_fact_row").show();
			$("#onlinecardsForm_region_fact").focus();
		}
		else {
			$("#onlinecardsForm_region_fact").val("");
			$("#onlinecardsForm_city_fact").val("");
			$("#onlinecardsForm_street_fact").val("");
			$("#onlinecardsForm_build_fact_1").val("");
			$("#onlinecardsForm_build_fact_2").val("");
			$("#onlinecardsForm_build_fact_3").val("");
			$("#onlinecardsForm_build_fact_4").val("");
			$(".address_fact_row").hide();
		}
	});
	
	$('#onlinecardsForm_employment').on('change', function(){
		var val = $(this).val();
		if ((val != "Работаю по найму") && (val != "Собственный бизнес")) {
			$(".employment_type_data").hide();
		}
		else {
			$(".employment_type_data").show();
		}
	});
	
	$('[data-depend][data-depend!=""]').on('change', function () {
		var $this = $(this);
		if(!$this.is('input')) return;
		var value = $this.val(),
			name = $this.attr('name').replace('onlinecardsForm.',''),
			true_val = $this.data('depend-true');
		if (value) {
			var rule_action = value == true_val ? 'add' : 'remove';
			var sub_element = $('[name="' + $this.data('depend') + '"]');
			sub_element.rules(rule_action, "required");
			if (rule_action == 'remove') {
				sub_element.removeAttr('required');
				sub_element.parents('.form-group').removeClass('has-error');
				$('.' + name + '-data').hide();
			} else {
				$('.' + name + '-data').show();
			}
		}
	});
	
	$('[name="onlinecardsForm.auto"]').on('change', function () {
		var value = $(this).val();
		if (value) {
			var rule_action = value == 'Есть' ? 'add' : 'remove';
			if (rule_action == 'remove') {
				$('.auto-data.has-error').removeClass('has-error');
				$('.auto-data input').val('');
				$('.auto-data').hide();
			} else {
				$('.auto-data').show();
			}
		}
	});
	
	$('[name="onlinecardsForm.other_credit"]').on('change', function () {
		var value = $(this).val();
		if (value) {
			var rule_action = value == 'Да' ? 'add' : 'remove';
			if (rule_action == 'remove') {
				$('.other_credit-data.has-error').removeClass('has-error');
				$('.other_credit-data').hide();
				$('.other_credit-data input, .other_credit-data select').val('');
			} else {
				$('.other_credit-data').show();
			}
		}
	});
	
	$('[name="onlinecardsForm.other_credit_card"]').on('change', function () {
		var value = $(this).val();
		if (value) {
			var rule_action = value == 'Да' ? 'add' : 'remove';
			if (rule_action == 'remove') {
				$('.other_credit_card-data.has-error').removeClass('has-error');
				$('.other_credit_card-data').hide();
				$('.other_credit_card-data input, .other_credit_card-data select').val('');
			} else {
				$('.other_credit_card-data').show();
			}
		}
	});
	
	$('.additional_questions-data input').on('change', function(){
		if (($('input[name="onlinecardsForm.court_decision"]:checked').val() == "Да")
		 || ($('input[name="onlinecardsForm.court_process"]:checked').val() == "Да")
		 || ($('input[name="onlinecardsForm.court_decision_1"]:checked').val() == "Да")
		 || ($('input[name="onlinecardsForm.try_other_credit"]:checked').val() == "Да")) {
			$(".additional_questions-data.info").show();
		}
		else {
			$(".additional_questions-data.info").hide();
		}
	});
	
	$('.other_credit-data input').on('keyup', function(){
		$('[name="onlinecardsForm.other_credit"]').valid();
	});
	$('.other_credit-data select').on('change', function(){
		$('[name="onlinecardsForm.other_credit"]').valid();
	});
	
	$('.other_credit_card-data input').on('keyup', function(){
		$('[name="onlinecardsForm.other_credit_card"]').valid();
	});
	
	$.mask.definitions['h'] = '[A-Za-z- ]';
	$('#onlinecardsForm_name_translit').mask('h?hhhhhhhhhhhhhhhhhhh');
	$('#onlinecardsForm_date_birth').mask('99.99.9999');
	$('#onlinecardsForm_mobile_phone').mask('+7 (999) 999-9999');
	$('#onlinecardsForm_text_ident_serial').mask('99 99');
	$('#onlinecardsForm_text_ident_num').mask('999999');
	$('#onlinecardsForm_date_issue').mask('99.99.9999');
	$('#onlinecardsForm_code_issue').mask('999-999');
	$('#onlinecardsForm_date_reg').mask('99.99.9999');
	$('#onlinecardsForm_inn').mask('999999999999');
	$('#onlinecardsForm_mobile_phone_2').mask('+7 (999) 999-9999');
	$('#onlinecardsForm_home_phone').mask('8 (999) 999-99-99');
	$('#onlinecardsForm_auto_year').mask('9999');
	
	$('#onlinecardsForm').removeData('validator');
	$('#onlinecardsForm').unbind('validate');

	$('#onlinecardsForm').validate({
		errorContainer: '#error_message',
		errorLabelContainer: '#error_text',
		errorClass: 'input-validation-error',
		onfocusout: function (a, b) {
			//$('#onlinecardsForm').valid();
		},
		onclick: function (a, b) {
			//$('#onlinecardsForm').valid();
		},
		rules: {
			'onlinecardsForm.product': {
				required: true
			},
			'onlinecardsForm.city_delivery': {
				required: true
			},
			'onlinecardsForm.office_delivery': {
				required: true
			},
			"onlinecardsForm.name_last": {
				required: true,
				pattern: '^[а-яА-я- ]+$'
			},
			'onlinecardsForm.name_first': {
				required: true,
				pattern: '^[а-яА-я- ]+$'
			},
			'onlinecardsForm.name_middle': {
				required: true,
				pattern: '^[а-яА-я- ]+$'
			},
			'onlinecardsForm.name_translit': {
				required: true,
				rangelength: [4, 20]
			},
			'onlinecardsForm.gender': {
				required: true
			},
			'onlinecardsForm.date_birth': {
				required: true,
				bcsdate: ['01.01.1900', getCurrentDateString()]
			},
			'onlinecardsForm.place_birth': {
				required: true,
				pattern: '^[^A-Za-z]+$'
			},
			'onlinecardsForm.mobile_phone': {
				required: true
			},
			'onlinecardsForm.email': {
				required: true,
				email: true
			},
			'onlinecardsForm.secure_word': {
				required: true
			},
			'onlinecardsForm.text_ident_serial': {
				required: true
			},
			'onlinecardsForm.text_ident_num': {
				required: true
			},
			'onlinecardsForm.date_issue': {
				required: true,
				bcsdate: ['01.01.1900', getCurrentDateString()]
			},
			'onlinecardsForm.code_issue': {
				required: true
			},
			'onlinecardsForm.who_issue': {
				required: true,
				pattern: '^[^A-Za-z]+$'
			},
			'onlinecardsForm.region_reg': {
				required: false,
				pattern: '^[а-яА-я- ]+$'
			},
			'onlinecardsForm.city_reg': {
				required: true,
				pattern: '^[а-яА-я0-9- ]+$'
			},
			'onlinecardsForm.street_reg': {
				required: true,
				pattern: '^[а-яА-я0-9- ]+$'
			},
			'onlinecardsForm.build_reg_1': {
				required: true
			},
			'onlinecardsForm.build_reg_2': {
				required: true
			},
			'onlinecardsForm.build_reg_3': {
				required: true
			},
			'onlinecardsForm.build_reg_4': {
				required: true
			},
			'onlinecardsForm.date_reg': {
				required: true,
				bcsdate: ['01.01.1900', getCurrentDateString()]
			},
			'onlinecardsForm.is_addresses_equal': {
				required: true
			},
			'onlinecardsForm.region_fact': {
				required: false,
				pattern: '^[а-яА-я- ]+$'
			},
			'onlinecardsForm.city_fact': {
				required: false,
				bcsfactaddrrequired: true,
				pattern: '^[а-яА-я0-9- ]+$'
			},
			'onlinecardsForm.street_fact': {
				required: false,
				bcsfactaddrrequired: true,
				pattern: '^[а-яА-я0-9- ]+$'
			},
			'onlinecardsForm.build_fact_1': {
				required: false,
				bcsfactaddrrequired: true
			},
			'onlinecardsForm.build_fact_2': {
				required: false,
				bcsfactaddrrequired: true
			},
			'onlinecardsForm.build_fact_3': {
				required: false,
				bcsfactaddrrequired: true
			},
			'onlinecardsForm.build_fact_4': {
				required: false,
				bcsfactaddrrequired: true
			},
			'onlinecardsForm.confirm_personal_data_rules': {
				required: false,
				bcsconfirmpersdatarules: true
			},
			'onlinecardsForm.credit_limit': {
				required: true,
				number: true
			},
			'onlinecardsForm.prev_name_last': {
				required: false,
				pattern: '^[а-яА-я- ]+$'
			},
			'onlinecardsForm.name_last_change_reason': {
				required: false,
				bcsnamelastchangereason: true,
				pattern: '^[^A-Za-z]+$'
			},
			'onlinecardsForm.inn': {
				required: false,
				bcsinn: true
			},
			'onlinecardsForm.mobile_phone_2': {
				required: false
			},
			'onlinecardsForm.home_phone': {
				required: false
			},
			'onlinecardsForm.family_status': {
				required: true
			},
			'onlinecardsForm.child_count': {
				required: false,
				number: true
			},
			'onlinecardsForm.education': {
				required: true
			},
			'onlinecardsForm.employment': {
				required: true
			},
			'onlinecardsForm.name_employer': {
				required: false,
				bcsemploymentrequired: true
			},
			'onlinecardsForm.type_employer': {
				required: false,
				bcstypeemployerrequired: true
			},
			'onlinecardsForm.region_employer': {
				required: false,
				pattern: '^[а-яА-я- ]+$'
			},
			'onlinecardsForm.city_employer': {
				required: false,
				bcsemploymentrequired: true,
				pattern: '^[а-яА-я0-9- ]+$'
			},
			'onlinecardsForm.street_employer': {
				required: false,
				bcsemploymentrequired: true,
				pattern: '^[а-яА-я0-9- ]+$'
			},
			'onlinecardsForm.build_employer_1': {
				required: false,
				bcsemploymentrequired: true
			},
			'onlinecardsForm.build_employer_2': {
				required: false,
				bcsemploymentrequired: true
			},
			'onlinecardsForm.build_employer_3': {
				required: false,
				bcsemploymentrequired: true
			},
			'onlinecardsForm.build_employer_4': {
				required: false,
				bcsemploymentrequired: true
			},
			'onlinecardsForm.speciality': {
				required: false,
				bcsspecialityrequired: true
			},
			'onlinecardsForm.total_experience': {
				required: false,
				bcsemploymentrequired: true,
				pattern: '^[^A-Za-z]+$'
			},
			'onlinecardsForm.current_experience': {
				required: false,
				bcsemploymentrequired: true,
				pattern: '^[^A-Za-z]+$'
			},
			'onlinecardsForm.name_occupation': {
				required: false,
				bcsemploymentrequired: true,
				pattern: '^[^A-Za-z]+$'
			},
			'onlinecardsForm.income': {
				required: true,
				number: true
			},
			'onlinecardsForm.rent': {
				required: false,
				number: true
			},
			'onlinecardsForm.insurance': {
				required: false,
				number: true
			},
			'onlinecardsForm.other_expenses': {
				required: false,
				number: true
			},
			'onlinecardsForm.apartment': {
				required: true
			},
			'onlinecardsForm.apartment_ownership': {
				required: false,
				bcsapartmentownershiprequired: true
			},
			'onlinecardsForm.house': {
				required: true
			},
			'onlinecardsForm.house_ownership': {
				required: false,
				bcshouseownershiprequired: true
			},
			'onlinecardsForm.land': {
				required: true
			},
			'onlinecardsForm.land_ownership': {
				required: false,
				bcslandownershiprequired: true
			},
			'onlinecardsForm.garage': {
				required: true
			},
			'onlinecardsForm.garage_ownership': {
				required: false,
				bcsgarageownershiprequired: true
			},
			'onlinecardsForm.auto': {
				required: true
			},
			'onlinecardsForm.auto_type': {
				required: false,
				bcsautotyperequired: true
			},
			'onlinecardsForm.auto_brand': {
				required: false,
				bcsautorequired: true
			},
			'onlinecardsForm.auto_model': {
				required: false,
				bcsautorequired: true
			},
			'onlinecardsForm.auto_year': {
				required: false,
				bcsautorequired: true,
				bcsautoyear: true
			},
			'onlinecardsForm.auto_reg_num': {
				required: false,
				bcsautorequired: true
			},
			'onlinecardsForm.other_property': {
				required: false
			},
			'onlinecardsForm.other_credit': {
				required: true,
				bcsothercreditrequired: true
			},
			'onlinecardsForm.bank_1': {
				required: false
			},
			'onlinecardsForm.bank_2': {
				required: false
			},
			'onlinecardsForm.bank_3': {
				required: false
			},
			'onlinecardsForm.bank_4': {
				required: false
			},
			'onlinecardsForm.type_credit_1': {
				required: false
			},
			'onlinecardsForm.type_credit_2': {
				required: false
			},
			'onlinecardsForm.type_credit_3': {
				required: false
			},
			'onlinecardsForm.type_credit_4': {
				required: false
			},
			'onlinecardsForm.annuity_credit_1': {
				required: false,
				number: true
			},
			'onlinecardsForm.annuity_credit_2': {
				required: false,
				number: true
			},
			'onlinecardsForm.annuity_credit_3': {
				required: false,
				number: true
			},
			'onlinecardsForm.annuity_credit_4': {
				required: false,
				number: true
			},
			'onlinecardsForm.other_credit_card': {
				required: true,
				bcsothercreditcardrequired: true
			},
			'onlinecardsForm.bank_11': {
				required: false
			},
			'onlinecardsForm.bank_12': {
				required: false
			},
			'onlinecardsForm.bank_13': {
				required: false
			},
			'onlinecardsForm.bank_14': {
				required: false
			},
			'onlinecardsForm.amt_credit_1': {
				required: false,
				number: true
			},
			'onlinecardsForm.amt_credit_2': {
				required: false,
				number: true
			},
			'onlinecardsForm.amt_credit_3': {
				required: false,
				number: true
			},
			'onlinecardsForm.amt_credit_4': {
				required: false,
				number: true
			},
			'onlinecardsForm.annuity_credit_11': {
				required: false,
				number: true
			},
			'onlinecardsForm.annuity_credit_12': {
				required: false,
				number: true
			},
			'onlinecardsForm.annuity_credit_13': {
				required: false,
				number: true
			},
			'onlinecardsForm.annuity_credit_14': {
				required: false,
				number: true
			},
			'onlinecardsForm.court_decision': {
				required: true
			},
			'onlinecardsForm.court_process': {
				required: true
			},
			'onlinecardsForm.court_decision_1': {
				required: true
			},
			'onlinecardsForm.try_other_credit': {
				required: true
			},
			'onlinecardsForm.additional_info': {
				required: false,
				bcsadditionalinforequired: true
			},
			'onlinecardsForm.confirm_personal_data_rules_step_2': {
				required: true
			}
		},
		messages: {
			'onlinecardsForm.product': {
				required: 'Продукт, '
			},
			'onlinecardsForm.city_delivery': {
				required: 'Город доставки, '
			},
			'onlinecardsForm.office_delivery': {
				required: 'Офис получения, '
			},
			'onlinecardsForm.name_last': {
				required: 'Фамилия, ',
				pattern: 'Фамилия, '
			},
			'onlinecardsForm.name_first': {
				required: 'Имя, ',
				pattern: 'Имя, '
			},
			'onlinecardsForm.name_middle': {
				required: 'Отчество, ',
				pattern: 'Отчество, '
			},
			'onlinecardsForm.name_translit': {
				required: 'Имя и фамилия латинскими буквами, ',
				rangelength: 'Имя и фамилия латинскими буквами, '
			},
			'onlinecardsForm.gender': {
				required: 'Пол, '
			},
			'onlinecardsForm.date_birth': {
				required: 'Дата рождения, ',
				bcsdate: 'Дата рождения, '
			},
			'onlinecardsForm.place_birth': {
				required: 'Место рождения, ',
				pattern: 'Место рождения, '
			},
			'onlinecardsForm.mobile_phone': {
				required: 'Мобильный телефон, '
			},
			'onlinecardsForm.email': {
				required: 'Email, ',
				email: 'Email, '
			},
			'onlinecardsForm.secure_word': {
				required: 'Кодовое слово, '
			},
			'onlinecardsForm.text_ident_serial': {
				required: 'Серия паспорта, '
			},
			'onlinecardsForm.text_ident_num': {
				required: 'Номер паспорта, '
			},
			'onlinecardsForm.date_issue': {
				required: 'Дата выдачи, ',
				bcsdate: 'Дата выдачи, '
			},
			'onlinecardsForm.code_issue': {
				required: 'Код подразделения, '
			},
			'onlinecardsForm.who_issue': {
				required: 'Кем выдан, ',
				pattern: 'Кем выдан, '
			},
			'onlinecardsForm.region_reg': {
				pattern: 'Регион рег, '
			},
			'onlinecardsForm.city_reg': {
				required: 'Город рег, ',
				pattern: 'Город рег, '
			},
			'onlinecardsForm.street_reg': {
				required: 'Улица рег, ',
				pattern: 'Улица рег, '
			},
			'onlinecardsForm.build_reg_1': {
				required: 'Дом рег, '
			},
			'onlinecardsForm.build_reg_2': {
				required: 'Стр. рег, '
			},
			'onlinecardsForm.build_reg_3': {
				required: 'Корпус рег, '
			},
			'onlinecardsForm.build_reg_4': {
				required: 'Квартира рег, '
			},
			'onlinecardsForm.date_reg': {
				required: 'Дата регистрации, ',
				bcsdate: 'Дата регистрации, '
			},
			'onlinecardsForm.is_addresses_equal': {
				required: 'Адрес факт, '
			},
			'onlinecardsForm.region_fact': {
				pattern: 'Регион факт, '
			},
			'onlinecardsForm.city_fact': {
				bcsfactaddrrequired: 'Город факт, ',
				pattern: 'Город факт, '
			},
			'onlinecardsForm.street_fact': {
				bcsfactaddrrequired: 'Улица факт, ',
				pattern: 'Улица факт, '
			},
			'onlinecardsForm.build_fact_1': {
				bcsfactaddrrequired: 'Дом факт, '
			},
			'onlinecardsForm.build_fact_2': {
				bcsfactaddrrequired: 'Стр. факт, '
			},
			'onlinecardsForm.build_fact_3': {
				bcsfactaddrrequired: 'Корпус факт, '
			},
			'onlinecardsForm.build_fact_4': {
				bcsfactaddrrequired: 'Квартира факт, '
			},
			'onlinecardsForm.confirm_personal_data_rules': {
				bcsconfirmpersdatarules: 'Согласие на обработку данных, '
			},
			'onlinecardsForm.credit_limit': {
				required: 'Кредитный лимит, ',
				number: 'Кредитный лимит, '
			},
			'onlinecardsForm.prev_name_last': {
				pattern: 'Прежняя фамилия, '
			},
			'onlinecardsForm.name_last_change_reason': {
				bcsnamelastchangereason: 'Причина смены фамилии, ',
				pattern: 'Причина смены фамилии, '
			},
			'onlinecardsForm.inn': {
				bcsinn: 'ИНН, '
			},
			'onlinecardsForm.family_status': {
				required: 'Семейное положение, '
			},
			'onlinecardsForm.child_count': {
				number: 'Количество иждивенцев, '
			},
			'onlinecardsForm.education': {
				required: 'Образование, '
			},
			'onlinecardsForm.employment': {
				required: 'Сведения о занятости, '
			},
			'onlinecardsForm.name_employer': {
				bcsemploymentrequired: 'Официальное наименование работодателя, '
			},
			'onlinecardsForm.type_employer': {
				bcstypeemployerrequired: 'Тип предприятия-работодателя, '
			},
			'onlinecardsForm.region_employer': {
				pattern: 'Регион работодателя, '
			},
			'onlinecardsForm.city_employer': {
				bcsemploymentrequired: 'Город работодателя, ',
				pattern: 'Город работодателя, '
			},
			'onlinecardsForm.street_employer': {
				bcsemploymentrequired: 'Улица работодателя, ',
				pattern: 'Улица работодателя, '
			},
			'onlinecardsForm.build_employer_1': {
				bcsemploymentrequired: 'Дом работодателя, '
			},
			'onlinecardsForm.build_employer_2': {
				bcsemploymentrequired: 'Стр. работодателя, '
			},
			'onlinecardsForm.build_employer_3': {
				bcsemploymentrequired: 'Корпус работодателя, '
			},
			'onlinecardsForm.build_employer_4': {
				bcsemploymentrequired: 'Офис работодателя, '
			},
			'onlinecardsForm.speciality': {
				bcsspecialityrequired: 'Сфера деятельности, '
			},
			'onlinecardsForm.total_experience': {
				bcsemploymentrequired: 'Общий трудовой стаж, ',
				pattern: 'Общий трудовой стаж, '
			},
			'onlinecardsForm.current_experience': {
				bcsemploymentrequired: 'Стаж работы на этом предприятии, ',
				pattern: 'Стаж работы на этом предприятии, '
			},
			'onlinecardsForm.name_occupation': {
				bcsemploymentrequired: 'Полное наименование должности, ',
				pattern: 'Полное наименование должности, '
			},
			'onlinecardsForm.income': {
				required: 'Средний ежемесячный доход, ',
				number: 'Средний ежемесячный доход, '
			},
			'onlinecardsForm.rent': {
				number: 'Аренда жилья, '
			},
			'onlinecardsForm.insurance': {
				number: 'Страховые платежи, '
			},
			'onlinecardsForm.other_expenses': {
				number: 'Прочие ежемесячные расходы, '
			},
			'onlinecardsForm.apartment': {
				required: 'Квартира, '
			},
			'onlinecardsForm.apartment_ownership': {
				bcsapartmentownershiprequired: 'Квартира (доля собственности), '
			},
			'onlinecardsForm.house': {
				required: 'Загородный дом, '
			},
			'onlinecardsForm.house_ownership': {
				bcshouseownershiprequired: 'Загородный дом (доля собственности), '
			},
			'onlinecardsForm.land': {
				required: 'Земельный участок, '
			},
			'onlinecardsForm.land_ownership': {
				bcslandownershiprequired: 'Земельный участок (доля собственности), '
			},
			'onlinecardsForm.garage': {
				required: 'Гараж, '
			},
			'onlinecardsForm.garage_ownership': {
				bcsgarageownershiprequired: 'Гараж (доля собственности), '
			},
			'onlinecardsForm.auto': {
				required: 'Автомобиль, '
			},
			'onlinecardsForm.auto_type': {
				bcsautotyperequired: 'Тип автомобиля, '
			},
			'onlinecardsForm.auto_brand': {
				bcsautorequired: 'Марка автомобиля, '
			},
			'onlinecardsForm.auto_model': {
				bcsautorequired: 'Модель автомобиля, '
			},
			'onlinecardsForm.auto_year': {
				bcsautorequired: 'Год выпуска автомобиля, ',
				bcsautoyear: 'Год выпуска автомобиля, '
			},
			'onlinecardsForm.auto_reg_num': {
				bcsautorequired: 'Регистрационный знак автомобиля, '
			},
			'onlinecardsForm.other_credit': {
				required: 'Действующие кредитные договоры, ',
				bcsothercreditrequired: 'Действующие кредитные договоры, '
			},
			'onlinecardsForm.annuity_credit_1': {
				number: 'Ежемесячный платеж 1, '
			},
			'onlinecardsForm.annuity_credit_2': {
				number: 'Ежемесячный платеж 2, '
			},
			'onlinecardsForm.annuity_credit_3': {
				number: 'Ежемесячный платеж 3, '
			},
			'onlinecardsForm.annuity_credit_4': {
				number: 'Ежемесячный платеж 4, '
			},
			'onlinecardsForm.other_credit_card': {
				required: 'Действующие кредитные карты, ',
				bcsothercreditcardrequired: 'Действующие кредитные карты, '
			},
			'onlinecardsForm.amt_credit_1': {
				number: 'Кредитный лимит 1, '
			},
			'onlinecardsForm.amt_credit_2': {
				number: 'Кредитный лимит 2, '
			},
			'onlinecardsForm.amt_credit_3': {
				number: 'Кредитный лимит 3, '
			},
			'onlinecardsForm.amt_credit_4': {
				number: 'Кредитный лимит 4, '
			},
			'onlinecardsForm.annuity_credit_11': {
				number: 'Ежемесячный платеж 1, '
			},
			'onlinecardsForm.annuity_credit_12': {
				number: 'Ежемесячный платеж 2, '
			},
			'onlinecardsForm.annuity_credit_13': {
				number: 'Ежемесячный платеж 3, '
			},
			'onlinecardsForm.annuity_credit_14': {
				number: 'Ежемесячный платеж 4, '
			},
			'onlinecardsForm.court_decision': {
				required: 'Дополнительный вопрос 1, '
			},
			'onlinecardsForm.court_process': {
				required: 'Дополнительный вопрос 2, '
			},
			'onlinecardsForm.court_decision_1': {
				required: 'Дополнительный вопрос 3, '
			},
			'onlinecardsForm.try_other_credit': {
				required: 'Дополнительный вопрос 4, '
			},
			'onlinecardsForm.additional_info': {
				bcsadditionalinforequired: 'Дополнительная информация, '
			},
			'onlinecardsForm.confirm_personal_data_rules_step_2': {
				required: 'Согласие на обработку данных, '
			}
		}
	});
	
	get_validator();
	
	/*
	$('select').on('focus', function (a) {
		//close_notification();
	});*/
	$('select').on('change', function (a) {
		$(this).valid();
	});
	$('input:radio').on('change', function (a) {
		$(this).valid();
	});
	$('input:checkbox').on('change', function (a) {
		$(this).valid();
	});
	$('input[type=submit]').prop('disabled', false);
	//var _validator = get_validator();
	//var validate_all = validator.form();
	//window.title = validate_all;
	//alert(validator.element( "#onlinecardsForm_auto_brand"));
	//alert(validate_all);
	
	$('#onlinecardsForm_checksms_popup_check').on('click', function () {
		var t = $(this);
		var code = $('#onlinecardsForm_checksms_popup_code');
		code.val($.trim(code.val()));
		if (code.val().length != 6) {
			code.focus();
			return false;
		}
		t.attr('disabled', true);

		var jqxhr = $.post(rootPath + 'widgets/form_onlinecards_sms',
			{
				action: 'check',
				sms: code.val()
			})
			.done(function (json) {
				if (json.status === 1) {
					smsChecked = true;
					$.magnificPopup.close();
					$('#btn_send').trigger('click');
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
	
	$('#onlinecardsForm input[type=submit]').on('click',
		function (e) {
			e.preventDefault();
			var $this = $(this);
			$('input[type=submit]', $this.parents('form')).removeAttr('clicked');
			$this.attr('clicked', 'true');
			if (!validator) return false;
			if (!validator.element('#onlinecardsForm_mobile_phone')) return false;
			
			if (!smsChecked) {
				mfq_popup('#onlinecardsForm_checksms_popup');
				send_sms();
				repeat_sms_start();
				return false;
			}
			
			if(smsChecked && currentStep == 1) {
				if(validate_step1()) {
					currentStep = 2;
					$('#onlinecardsForm_step1').hide();
					$('#onlinecardsForm_step2').show();
					$.scrollTo(
						'#onlinecards',
						{
							duration: 700,
							offset: -100
						}
					);
				}
				return false;
			}
			
			if(smsChecked && currentStep == 2) {
				if ($('#onlinecardsForm').valid() == true) {
					// Подтверждение SMS
					$('#send_message').show();
					$this.prop('disabled', true);
					var form = $('#onlinecardsForm'),
						url = form.attr('action'),
						data = form.serialize();

					var jqxhr = $.post(url, data)
						.done(function (json) {
							if (json.success) {
								$('#onlinecards-feedback-ok').show();
								$('#onlinecards-form').slideUp();

								try {
									GTM.push("Длинная анкета", "Кредитная карта");
									GTM.conversion(
										$.trim($('#onlinecardsForm_name_last').val() + ' ' + $('#onlinecardsForm_name_first').val() + ' ' + $('#onlinecardsForm_name_middle').val()),
										$('#onlinecardsForm_mobile_phone').val(),
										$('#onlinecardsForm_email').val(),
										"Длинная анкета - кредитная карта",
										form_options.page,
										json.request_id,
										form_options.refid,
										form_options.goal
									);
								} catch (_) { }
							}
						})
						.fail(function (jqXHR, textStatus, errorThrown) {
							alert('Ошибка при отправке формы');
						});
				}
				return false;
			}
			
			return false;
		}
	);

	$('#onlinecardsForm_checksms_popup_send_btn').on('click', function () {
		smsChecked = false;
		send_sms();
		set_seconds(seconds_interval);
		$('#onlinecardsForm_checksms_popup_send_message').show();
		$('#onlinecardsForm_checksms_popup_send').hide();
		repeat_sms_start();
	});

	set_seconds(seconds_interval);
});

function onlinecards_start(options) {
	$('#form').slideUp();
	$('#onlinecards').slideDown();
	/*if (!!options) {
		if (options.product) $('#onlinecardsForm_product').val(options.product).trigger('change');
	}*/

	var lastname = $('#callbackForm_lastname').val(),
		name = $('#callbackForm_name').val(),
		email = $('#callbackForm_email').val(),
		phone = $('#callbackForm_phone').val(),
		city = $('#callbackForm_city').val();

	$('#onlinecardsForm_name_last').val(lastname);
	$('#onlinecardsForm_name_first').val(name);
	$('#onlinecardsForm_email').val(email);
	$('#onlinecardsForm_mobile_phone').val(phone);
	if (city != '00000000-0000-0000-0000-000000000000') $('#onlinecardsForm_city_delivery').val(city).trigger('change');
};

function send_sms() {
	var jqxhr = $.post(rootPath + 'widgets/form_onlinecards_sms',
		{
			action: 'set',
			phone: $('#onlinecardsForm_mobile_phone').val()
		})
		.done(function (json) {
			if (json.code) $('#onlinecardsForm_checksms_popup_code').val(json.code);
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			alert('Ошибка при отправке SMS...');
		});
};
