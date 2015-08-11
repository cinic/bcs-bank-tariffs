	/* калькулятор кредита */
	$('.credit .calculate').bind("click", function (e) {
		change_calc();
		return false;
	});

	function change_calc() {
		var data_calc = $('form#calculyator_credit').serializeArray();
		var reg_c = data_calc[0].value;
		var srok_c = data_calc[1].value;
		var sum_c = data_calc[2].value;
		var dohod_c = data_calc[3].value;
		var type_c = data_calc[4].value;
		var podtver_c = data_calc[5].value;
		var member_c = data_calc[6].value;
		var obyaz_c = data_calc[7].value;

		var error_c = 0;

		if ($.isNumeric(sum_c)) {
			if (sum_c < 100000) {
				$(".credit input[name='sum']").addClass('error');
				sum_c = 1;
				error_c = 1;
			} else if (sum_c > 500000) {
				$(".credit input[name='sum']").addClass('error');
				sum_c = 1;
				error_c = 1;
			} else {
				$(".credit input[name='sum']").removeClass('error');
			}
		} else {
			$(".credit input[name='sum']").val(100000);
			sum_c = 100000;
			error_c = 1;
		}

		if ($.isNumeric(obyaz_c) === false) {
			$(".credit input[name='obyaz']").val(0);
			obyaz_c = 0;
		}

		if ($.isNumeric(member_c) === false || member_c < 1) {
			$(".credit input[name='member']").val(1);
			member_c = 1;
		}

		if ($.isNumeric(dohod_c) === false) {
			$(".credit input[name='dohod_fam']").val(1);
			dohod_c = 1;
		}

		var proc_c = 0;

		var reg_min_zarpl_arr = [0, 5160, 7815, 5967, 7671, 5923, 5390, 6561, 5423, 6265, 5160, 6078, 5279, 6074, 7249, 4975, 5970, 5215, 9437, 6987, 9228, 6183, 6561, 5279, 6568, 7249, 5363, 5491, 5466, 6690, 5911, 6545, 6458, 5440, 6074, 5887, 5558, 9228, 8226, 5911, 6545, 6656, 5848, 6319, 5558, 9228, 5704, 6514, 5789]
		var reg_min_zarpl = reg_min_zarpl_arr[reg_c];

		if (srok_c >= 25) { proc_c = 28.5; } else { proc_c = 27.5; }

		var month_p = (sum_c * proc_c / 100) / 12 / (1 - Math.pow((1 + (proc_c / 100) / 12), -srok_c));
		var month_p_ceil = Math.round(month_p);

		var koef = 1;

		if (podtver_c == 2) {
			if (type_c == 3) {
				koef = 0.6;
			}
			if (type_c == 4) {
				koef = 0.9;
			}
		}

		if (podtver_c == 3) {
			if (type_c == 1) {
				koef = 0.8;
			}
			if (type_c == 2) {
				koef = 0.7;
			}
			if (type_c == 3) {
				koef = 0.3;
			}
			if (type_c == 4) {
				koef = 0.5;
			}
		}

		var obyaz_all = obyaz_c * 1 + (member_c * reg_min_zarpl) + month_p;
		var vash_doh = dohod_c * koef;

		var ob_doh = (obyaz_all / vash_doh) * 100;
		var plat_doh = (month_p / vash_doh) * 100;

		if (ob_doh > 40) {
			$(".credit input[name='dohod_fam']").addClass('error');
			error_c = 1;
		} else if (plat_doh > 30) {
			$(".credit input[name='dohod_fam']").addClass('error');
			error_c = 1;
		} else {
			$(".credit input[name='dohod_fam']").removeClass('error');
		}

		if (error_c == 1) {
			$(".message_box").text('Заявка на кредит не одобрена');
			$(".button_form.btn-more").hide();
			return false;
		}
		if (error_c == 0) {
			$(".message_box").text('Заявка на кредит предварительно одобрена');
			$(".button_form.btn-more").show();
		}

		$(".itog_col .month_val").text(month_p_ceil + ' р.');
		$(".itog_col .pers_val").text(proc_c + '%');

	}
