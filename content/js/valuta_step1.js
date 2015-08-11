/**
 * выбор операции
 */

$(function () {

	$('.stepper').owlCarousel({
		items: 4,
		itemsDesktop: false,
		itemsDesktopSmall: false,
		navigation: true,
		navigationText: false,
		pagination: false,
		theme: ''
	});

	var $radio = $('.valuta-course__radio'),
		$input = $('.valuta-input__form-control'),
		$slider = $('.valuta-input__slider'),
		$operation = $('.js-operation'),
		$operationNominativ = $('.js-operation-nominativ'),
		$operationGenitiv = $('.js-operation-genitiv'),
		$currency = $('.js-currency'),
		$amount = $('.js-amount'),
		$amountRub = $('.js-amount-rub'),
		$advance = $('.js-advance'),
		$course = $('.js-course');

	var operation, currency, amount, course;

	var Format = wNumb({
		mark: ',',
		thousand: ' ',
		decimals: 2
	});

	function getCurrencySign(currency) {
		return currency == 'usd' ? '$' : '€';
	}

	$slider.noUiSlider({
		start: 10000,
		range: {
			'min': [1000, 500],
			'20%': [20000, 1000],
			'40%': [40000, 1000],
			'60%': [60000, 1000],
			'80%': [80000, 1000],
			'max': [100000]
		},
		format: wNumb({
			decimals: 0
		})
	});

	$slider.noUiSlider_pips({
		mode: 'range',
		density: 10,
		format: wNumb({
			postfix: ' т',
			encoder: function (value) {
				return value / 1000;
			}
		}),
	});

	$slider.on('set', function () {
		amount = Format.from($(this).val());
		$amount.text(Format.to(amount));
		$amountRub.text(Format.to(course*amount));
		$advance.text(Format.to(course*amount*0.05));
	});

	$slider.triggerHandler('set');

	$radio.on('change', function () {
		var courseClass;

		operation = $(this).data('operation');
		$operation.text(operation == 'buy' ? 'покупаю' : 'продаю');
		$operationNominativ.text(operation == 'buy' ? 'купить' : 'продать');
		$operationGenitiv.text(operation == 'buy' ? 'покупки' : 'продажи');

		currency = $(this).data('currency');
		$currency.text(getCurrencySign(currency));

		courseClass = '.js-course-' + operation + '-' + currency;
		course = Format.from($(courseClass).text());
		$course.text(Format.to(course));
		$amountRub.text(Format.to(course*amount));
		$advance.text(Format.to(course*amount*0.05));

		$slider.Link().to($input, null, wNumb({
			decimals: 0,
			postfix: ' ' + getCurrencySign(currency),
			thousand: ' '
		}));
	});

	$radio.filter(':checked').triggerHandler('change');
});


/**
 * Стать клиентом БКС прямо сейчас
 */

$(function () {
	var isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

	var $datepicker = $('.js-datepicker'),
		$timepicker = $('.js-timepicker');

	$('.valuta-way').easytabs({
		animate: false,
		updateHash: false
	}).on('easytabs:midTransition', function (event, tab) {
		var hash = tab.attr('href')

		if (hash == '#cash') {
			$map.show();
		} else {
			$map.hide();
		}
	});

	$('.choose-way').easytabs({
		animate: false,
		updateHash: false
	});

	$('.valuta-selector').transparentSelector({ 'class': 'transparent-selector--valuta' });

	if (!isMobile) {
		$datepicker.val($datepicker.data('value'));
		$datepicker.datepicker({
			autoclose: true,
			language: 'ru'
		});
	}
});
