$(function () {


	// tooltips
	$('.tooltip-ask').each(function () {
		$(this).tooltipster({
			theme: 'tooltipster-dark',
			//arrow: false,
			interactive: true,
			content: $($(this).data('tooltip')).html(),
			contentAsHTML: true,
			maxWidth: 960
		});
	});


	// плавный скроллинг
	$('.scrollto').click(
		function (e) {
			var hash = $(this).attr('href'),
				offset = $(this).data('offset') || 0;
			e.preventDefault();
			$.scrollTo(
				hash,
				{
					duration: 700,
					offset: offset
				}
			);
		}
	);


	var $screenMasthead = $('.first_slide_wrapper');


	// определение размеров окна
	var screenSize = {
		style: null,
		width: null,
		height: null,
		ratio: 1,
		update: function () {
			var w = parseInt($(window).width()),
			h = parseInt(window.innerHeight ? window.innerHeight : $(window).height());

			if (w == screenSize.width && h == screenSize.height) {
				return false;
			}

			screenSize.width = w;
			screenSize.height = h;
			screenSize.ratio = w / h;

			if (screenSize.height > 730) {
				screenSize.height = 730
			}

			if (screenSize.style) {
				screenSize.style.remove();
			}

			screenSize.style = $('<style>.screen-full{height: ' + screenSize.height + 'px}</style>').appendTo('head');
			screenSize.width >= 750 ? $screenMasthead.addClass('screen-full') : $screenMasthead.removeClass('screen-full');

			$('#menu-link').removeClass('active');
			$('#mobile-menu').removeClass('active');
			$('.search-row').removeClass('active');
			$('#top-menu li').slice(1).removeClass('hide');
		}
	};

	var isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

	if (isMobile) {
		$(window).on('orientationchange.screen load.screen', screenSize.update).trigger('orientationchange.screen');
	} else {
		$(window).on('resize.screen load.screen', screenSize.update).trigger('resize.screen');
	}

	$('.galery').newsLine({
		itemsSelector: '.galery-item'
	});
	var nav = $('#main-menu');
	$(window).scroll(function () {
		if ($(this).scrollTop() > 86) {
			nav.addClass("f-nav");
		} else {
			nav.removeClass("f-nav");
		}
	});

	$('#menu-link').click(function (e) {
		e.stopPropagation();
		$(this).toggleClass('active');
		$('#mobile-menu').toggleClass('active');
		return false;
	});

	var wow = new WOW({ mobile: false, offset: 0 });
	wow.init();

	$('.search-row a').click(function () {
		$('.search-row').toggleClass('active');
		$('#top-menu li').slice(1).toggleClass('hide');
	});

	$('.tab-link').click(function () {
		if ($(this).hasClass('current'))
			return false;
		var par = $(this).closest('.tab-link-group');
		var cur = $('a.current', par).attr('data-calc');
		var cur1 = $('a.current', par).attr('data-target');
		$(cur).hide();
		$(cur1).hide();
		$('a', par).removeClass('current');
		var target = $(this).attr('data-target');
		var target1 = $(this).attr('data-calc');
		$(target).show();
		$(target1).show();
		$(this).addClass('current');
		return false;
	});

	/*calc*/
	$('#calculyator input[type=radio]').styler();
	$('#calculyator select').styler();
	$('#calculyator_credit select').styler();

	var curr, open_in, curr_convert, popolnenie, cap, srock;
	var isCalcDepositInit = false;

	$('.valuta_button').bind("click", function (e) {
		var range_srok_sliders, range_capital_sliders;
		var data = $('form#calculyator').serializeArray();
		init = 0;

		if (data[0].value == 'RUR' && data[2].value == 'no' && data[3].value == 'no') { // валюта = рубли, конвертация = нет, пополнение = нет (доходный)

			$('#popolnenie_select').show();
			$('#popolnenie_only').hide();

			range_srok_sliders = {
				'min': [1],
				'20%': [3, 3],
				'80%': [12, 12],
				'max': [24]
			};

			$("#slider").noUiSlider({
				range: range_srok_sliders,
				start: isCalcDepositInit ? srock * 1 : 3,
				direction: 'ltr',
				step: 2
			}, true);

			$("#slider").noUiSlider_pips({
				mode: 'values',
				values: [1, 3, 6, 9, 12, 24],
				density: 100,
				format: wNumb({
					postfix: 'мес.'
				})
			});

			range_capital_sliders = {
				'min': [50],
				'20%': [100, 50],
				'40%': [500, 50],
				'60%': [1000, 50],
				'80%': [2000, 100],
				'max': [5000]
			};

			$("#slider1").noUiSlider({
				range: range_capital_sliders,
				start: isCalcDepositInit ? cap * 1 : 500,
				direction: 'ltr',
				step: 2
			}, true);

			$("#slider1").noUiSlider_pips({
				mode: 'values',
				values: [50, 100, 500, 1000, 2000, 5000],
				density: 100,
				format: wNumb({
					postfix: 'т.'
				})
			});

			$('#slider .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider .noUi-pips >div:last').addClass('last');
			$('#slider1 .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider1 .noUi-pips >div:last').addClass('last');

			$('#slider .noUi-pips >div.noUi-value:eq(4)').text('1г.');
			$('#slider .noUi-pips >div.noUi-value:eq(5)').text('2г.');
			$('#slider1 .noUi-pips >div.noUi-value:eq(3)').text('1млн.');
			$('#slider1 .noUi-pips >div.noUi-value:eq(4)').text('2млн.');
			$('#slider1 .noUi-pips >div.noUi-value:eq(5)').text('5млн.');

			$('.deposit-pros, .deposit-details').hide();
			$('#dohodny-pros, #dohodny-details').show();

			$('#deposit_name').val('Доходный');

			if (!isCalcDepositInit) {
				curr = 'rur';
				open_in = data[1].value;
				curr_convert = 'no';
				popolnenie = 'no';
				srock = Math.round($("#slider").val());
				cap = Math.round($("#slider1").val());
			}

			result(srock, cap, curr, open_in, popolnenie, curr_convert);
			procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
			dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
			srock_res(srock);
			cap_result(cap, curr);
			make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
		}

		if (data[0].value == 'RUR' && data[2].value == 'no' && data[3].value == 'yes') { // валюта = рубли, конвертация = нет, пополнение = да (универсальный выбор)

			$('#popolnenie_select').show();
			$('#popolnenie_only').hide();

			range_srok_sliders = {
				'min': [3],
				'33%': [6, 6],
				'66%': [12, 12],
				'max': [24]
			};

			$("#slider").noUiSlider({
				range: range_srok_sliders,
				start: isCalcDepositInit ? srock * 1 : 3,
				direction: 'ltr',
				step: 3
			}, true);

			$("#slider").noUiSlider_pips({
				mode: 'values',
				values: [3, 6, 12, 24],
				density: 100,
				format: wNumb({
					postfix: 'мес.'
				})
			});

			range_capital_sliders = {
				'min': [50],
				'20%': [100, 50],
				'40%': [500, 50],
				'60%': [1000, 50],
				'80%': [5000, 100],
				'max': [10000]
			};

			$("#slider1").noUiSlider({
				range: range_capital_sliders,
				start: isCalcDepositInit ? cap * 1 : 500,
				direction: 'ltr',
				step: 2
			}, true);

			$("#slider1").noUiSlider_pips({
				mode: 'values',
				values: [50, 100, 500, 1000, 5000, 10000],
				density: 100,
				format: wNumb({
					postfix: 'т.'
				})
			});

			$('#slider .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider .noUi-pips >div:last').addClass('last');
			$('#slider1 .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider1 .noUi-pips >div:last').addClass('last');

			$('#slider .noUi-pips >div.noUi-value:eq(4)').text('1г.');
			$('#slider .noUi-pips >div.noUi-value:eq(5)').text('2г.');
			$('#slider1 .noUi-pips >div.noUi-value:eq(3)').text('1млн.');
			$('#slider1 .noUi-pips >div.noUi-value:eq(4)').text('5млн.');
			$('#slider1 .noUi-pips >div.noUi-value:eq(5)').text('10млн.');

			$('.deposit-pros, .deposit-details').hide();
			$('#universal-pros, #universal-details').show();

			$('#deposit_name').val('Универсальный выбор');

			if (!isCalcDepositInit) {
				curr = 'rur';
				open_in = data[1].value;
				curr_convert = 'no';
				popolnenie = 'yes';
				srock = Math.round($("#slider").val());
				cap = Math.round($("#slider1").val());
			}

			result(srock, cap, curr, open_in, popolnenie, curr_convert);
			procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
			dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
			srock_res(srock);
			cap_result(cap, curr);
			make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
		}

		if (data[0].value == 'USD' && data[2].value == 'no') { // валюта = доллары, конвертация = нет (универсальный выбор)

			$('#popolnenie_select').show();
			$('#popolnenie_only').hide();

			range_srok_sliders = {
				'min': [3],
				'33%': [6, 6],
				'66%': [12, 12],
				'max': [24]
			};

			$("#slider").noUiSlider({
				range: range_srok_sliders,
				start: isCalcDepositInit ? srock * 1 : 12,
				direction: 'ltr',
				step: 3
			}, true);

			$("#slider").noUiSlider_pips({
				mode: 'values',
				values: [3, 6, 12, 24],
				density: 100,
				format: wNumb({
					postfix: 'мес.'
				})
			});

			range_capital_sliders = {
				'min': [2],
				'20%': [5, 1],
				'40%': [10, 1],
				'60%': [20, 1],
				'80%': [50, 1],
				'max': [100]
			};

			$("#slider1").noUiSlider({
				range: range_capital_sliders,
				start: isCalcDepositInit ? cap * 1 : 10,
				direction: 'ltr',
				step: 1
			}, true);

			$("#slider1").noUiSlider_pips({
				mode: 'values',
				values: [2, 5, 10, 20, 50, 100],
				density: 100,
				format: wNumb({
					postfix: 'т.'
				})
			});

			$('#slider .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider .noUi-pips >div:last').addClass('last');
			$('#slider1 .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider1 .noUi-pips >div:last').addClass('last');

			$('.deposit-pros, .deposit-details').hide();
			$('#universal-pros, #universal-details').show();

			$('#deposit_name').val('Универсальный выбор');

			if (!isCalcDepositInit) {
				curr = 'usd';
				open_in = data[1].value;
				curr_convert = 'no';
				popolnenie = data[3].value;
				srock = Math.round($("#slider").val());
				cap = Math.round($("#slider1").val());
			}

			result(srock, cap, curr, open_in, popolnenie, curr_convert);
			procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
			dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
			srock_res(srock);
			cap_result(cap, curr);
			make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
		}

		if (data[0].value == 'EUR' && data[2].value == 'no') { // валюта = евро, конвертация = нет (универсальный выбор)

			$('#popolnenie_select').show();
			$('#popolnenie_only').hide();

			range_srok_sliders = {
				'min': [3],
				'33%': [6, 6],
				'66%': [12, 12],
				'max': [24]
			};

			$("#slider").noUiSlider({
				range: range_srok_sliders,
				start: isCalcDepositInit ? srock * 1 : 12,
				direction: 'ltr',
				step: 3
			}, true);

			$("#slider").noUiSlider_pips({
				mode: 'values',
				values: [3, 6, 12, 24],
				density: 100,
				format: wNumb({
					postfix: 'мес.'
				})
			});

			range_capital_sliders = {
				'min': [2],
				'20%': [5, 1],
				'40%': [10, 1],
				'60%': [20, 1],
				'80%': [50, 1],
				'max': [100]
			};

			$("#slider1").noUiSlider({
				range: range_capital_sliders,
				start: isCalcDepositInit ? cap * 1 : 10,
				direction: 'ltr',
				step: 1
			}, true);

			$("#slider1").noUiSlider_pips({
				mode: 'values',
				values: [2, 5, 10, 20, 50, 100],
				density: 100,
				format: wNumb({
					postfix: 'т.'
				})
			});

			$('#slider .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider .noUi-pips >div:last').addClass('last');
			$('#slider1 .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider1 .noUi-pips >div:last').addClass('last');

			$('.deposit-pros, .deposit-details').hide();
			$('#universal-pros, #universal-details').show();

			$('#deposit_name').val('Универсальный выбор');

			if (!isCalcDepositInit) {
				curr = 'eur';
				open_in = data[1].value;
				curr_convert = 'no';
				popolnenie = data[3].value;
				srock = Math.round($("#slider").val());
				cap = Math.round($("#slider1").val());
			}

			result(srock, cap, curr, open_in, popolnenie, curr_convert);
			procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
			dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
			srock_res(srock);
			cap_result(cap, curr);
			make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
		}

		if (data[2].value == 'yes') { // конвертация = да (мультивалютный)

			$('#popolnenie_select').hide();
			$('#popolnenie_only').show();

			range_srok_sliders = {
				'min': [6],
				'max': [12]
			};

			$("#slider").noUiSlider({
				range: range_srok_sliders,
				start: isCalcDepositInit ? srock * 1 : 12,
				direction: 'ltr',
				step: 6
			}, true);

			$("#slider").noUiSlider_pips({
				mode: 'values',
				values: [6, 12],
				density: 100,
				format: wNumb({
					postfix: 'мес.'
				})
			});

			if (data[0].value == 'RUR') {
				range_capital_sliders = {
					'min': [500],
					'max': [10000]
				};

				$("#slider1").noUiSlider({
					range: range_capital_sliders,
					start: isCalcDepositInit ? cap * 1 : 1000,
					direction: 'ltr',
					step: 100
				}, true);

				$("#slider1").noUiSlider_pips({
					mode: 'values',
					values: [500, 5000, 10000],
					density: 100,
					format: wNumb({
						postfix: 'т.'
					})
				});

				$('#slider1 .noUi-pips >div.noUi-value:eq(1)').text('5млн.');
				$('#slider1 .noUi-pips >div.noUi-value:eq(2)').text('10млн.');
			}

			var capital_sliders_min, capital_sliders_max;

			if (data[0].value == 'USD') {
				if (!UsdRurCbr) UsdRurCbr = 60;
				capital_sliders_min = Math.ceil(500 / UsdRurCbr);
				capital_sliders_max = Math.ceil(10000 / UsdRurCbr);

				range_capital_sliders = {
					'min': capital_sliders_min,
					'max': capital_sliders_max
				};

				$("#slider1").noUiSlider({
					range: range_capital_sliders,
					start: isCalcDepositInit ? cap * 1 : capital_sliders_min,
					direction: 'ltr',
					step: 1
				}, true);

				$("#slider1").noUiSlider_pips({
					mode: 'values',
					values: [capital_sliders_min, 100, capital_sliders_max],
					density: 100,
					format: wNumb({
						postfix: 'т.'
					})
				});
			}

			if (data[0].value == 'EUR') {
				if (!EurRurCbr) EurRurCbr = 70;
				capital_sliders_min = Math.ceil(500 / EurRurCbr);
				capital_sliders_max = Math.ceil(10000 / EurRurCbr);

				range_capital_sliders = {
					'min': capital_sliders_min,
					'max': capital_sliders_max
				};

				$("#slider1").noUiSlider({
					range: range_capital_sliders,
					start: isCalcDepositInit ? cap * 1 : capital_sliders_min,
					direction: 'ltr',
					step: 1
				}, true);

				$("#slider1").noUiSlider_pips({
					mode: 'values',
					values: [capital_sliders_min, 100, capital_sliders_max],
					density: 100,
					format: wNumb({
						postfix: 'т.'
					})
				});
			}

			$('#slider .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider .noUi-pips >div:last').addClass('last');
			$('#slider1 .noUi-pips >div.noUi-value').filter(":first").addClass('first');
			$('#slider1 .noUi-pips >div:last').addClass('last');

			$('.deposit-pros, .deposit-details').hide();
			$('#multivalut-pros, #multivalut-details').show();

			$('#deposit_name').val('Мультивалютная корзина');

			if (!isCalcDepositInit) {
				curr = data[0].value;
				open_in = data[1].value;
				curr_convert = 'yes';
				popolnenie = data[3].value;
				srock = Math.round($("#slider").val());
				cap = Math.round($("#slider1").val());
			}

			result(srock, cap, curr, open_in, popolnenie, curr_convert);
			procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
			dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
			srock_res(srock);
			cap_result(cap, curr);
			make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
		}
	});

	var init = calcDepositLoadParams() ? 0 : 1;
	if (init == 1) {
		var range_srok_sliders = {
			'min': [1],
			'20%': [3, 3],
			'80%': [12, 12],
			'max': [24]
		};

		$("#slider").noUiSlider({
			range: range_srok_sliders,
			start: 3,
			direction: 'ltr',
			step: 2
		});

		$("#slider").noUiSlider_pips({
			mode: 'values',
			values: [1, 3, 6, 9, 12, 24],
			density: 100,
			format: wNumb({
				postfix: 'мес.'
			})
		});

		var range_capital_sliders = {
			'min': [50],
			'20%': [100, 50],
			'40%': [500, 50],
			'60%': [1000, 50],
			'80%': [2000, 100],
			'max': [5000]
		};

		$("#slider1").noUiSlider({
			range: range_capital_sliders,
			start: 500,
			direction: 'ltr',
			step: 2
		});

		$("#slider1").noUiSlider_pips({
			mode: 'values',
			values: [50, 100, 500, 1000, 2000, 5000],
			density: 100,
			format: wNumb({
				postfix: 'т.'
			})
		});

		$('#slider .noUi-pips >div.noUi-value').filter(":first").addClass('first');
		$('#slider .noUi-pips >div:last').addClass('last');
		$('#slider1 .noUi-pips >div.noUi-value').filter(":first").addClass('first');
		$('#slider1 .noUi-pips >div:last').addClass('last');

		$('#slider .noUi-pips >div.noUi-value:eq(4)').text('1г.');
		$('#slider .noUi-pips >div.noUi-value:eq(5)').text('2г.');
		$('#slider1 .noUi-pips >div.noUi-value:eq(3)').text('1млн.');
		$('#slider1 .noUi-pips >div.noUi-value:eq(4)').text('2млн.');
		$('#slider1 .noUi-pips >div.noUi-value:eq(5)').text('5млн.');

		$('#dohodny-pros').show();
		$('#dohodny-details').show();

		$('#deposit_name').val('Доходный');

		srock = Math.round($("#slider").val());
		cap = Math.round($("#slider1").val());
		curr = 'rur';
		open_in = 'bcs';
		curr_convert = 'no';
		popolnenie = 'no';

		result(srock, cap, curr, open_in, popolnenie, curr_convert);
		procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
		dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
		srock_res(srock);
		cap_result(cap, curr);
		make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
	}

	function calcDepositSaveParams(srock, cap, curr, open_in, popolnenie, curr_convert) {
		localStorage["bcsbank.calc.deposit.curr"] = curr;
		localStorage["bcsbank.calc.deposit.open_in"] = open_in;
		localStorage["bcsbank.calc.deposit.curr_convert"] = curr_convert;
		localStorage["bcsbank.calc.deposit.popolnenie"] = popolnenie;
		localStorage["bcsbank.calc.deposit.cap"] = cap;
		localStorage["bcsbank.calc.deposit.srock"] = srock;
	}

	function calcDepositLoadParams() {
		curr = localStorage["bcsbank.calc.deposit.curr"];
		open_in = localStorage["bcsbank.calc.deposit.open_in"];
		curr_convert = localStorage["bcsbank.calc.deposit.curr_convert"];
		popolnenie = localStorage["bcsbank.calc.deposit.popolnenie"];
		cap = localStorage["bcsbank.calc.deposit.cap"];
		srock = localStorage["bcsbank.calc.deposit.srock"];

		if (!curr || !open_in || !curr_convert || !popolnenie || !cap || !srock) return false;
		if (curr == 'NaN' || open_in == 'NaN' || curr_convert == 'NaN' || popolnenie == 'NaN' || cap == 'NaN' || srock == 'NaN') return false;
		isCalcDepositInit = true;

		$('.valuta_button')
			.filter('.' + curr.toLowerCase()).trigger('click').end()
			.filter('.' + open_in).trigger('click').end()
			.filter('.curr_convert_' + curr_convert).trigger('click').end()
			.filter('.' + popolnenie).trigger('click');

		isCalcDepositInit = false;
		return true;
	}

	function srock_res(srock) {
		var srock_text = '';
		if (srock == 3) {
			srock_text = srock + ' месяца';
		}
		if (srock == 1) {
			srock_text = srock + ' месяц';
		}
		if (srock == 6 || srock == 12 || srock == 36 || srock == 9) {
			srock_text = srock + ' месяцев';
		}
		if (srock == 24) {
			srock_text = srock + ' месяца';
		}
		$('.srok_result').text(srock_text);
		$('.time').text(srock_text);
	}

	function make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert) {
		var proc = procent(srock, curr, cap, open_in, popolnenie, curr_convert);
		var full = Math.ceil(cap * 1000 + (srock * cap * (proc / 100) * 1000 / 12));
		var prifit = Math.ceil(srock * cap * (proc / 100) * 1000 / 12);
		var str = full.toString();
		var sum_full = str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1\u00a0');

		var num = cap * 1000;
		var str1 = num.toString();
		var sum_cap = str1.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1\u00a0');

		var start, finish;

		if (curr.toLowerCase() == 'rur') {
			start = 'ВЛОЖЕННАЯ СУММА\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002' + sum_cap + '\240р.';
			finish = 'ДОХОД ПО\u00a0ВКЛАДУ\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002' + sum_full + '\240р.';
		}
		if (curr.toLowerCase() == 'usd') {
			start = 'ВЛОЖЕННАЯ СУММА\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002' + sum_cap + '\240$';
			finish = 'ДОХОД ПО\u00a0ВКЛАДУ\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002' + sum_full + '\240$';
		}
		if (curr.toLowerCase() == 'eur') {
			start = 'ВЛОЖЕННАЯ СУММА\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002' + sum_cap + '\240€';
			finish = 'ДОХОД ПО\u00a0ВКЛАДУ\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002' + sum_full + '\240€';
		}
		var profit_height = Math.ceil((prifit * 156) / full);
		var user_height = 156 - profit_height;
		$('.first_diagram .user_money').height(user_height + 'px');
		$('.first_diagram .user_money').attr('data-content', start);
		$('.second_diagram .profit_money').attr('data-content', finish);
		$('.second_diagram .user_money').height(user_height + 'px');
		$('.second_diagram .profit_money').height(profit_height + 'px');
	}

	function result(srock, cap, curr, open_in, popolnenie, curr_convert) {
		var proc = procent(srock, curr, cap, open_in, popolnenie, curr_convert);
		var zarabot = Math.ceil(cap * 1000 + ((srock * cap * (proc / 100) * 1000) / 12));
		var str = zarabot.toString();
		var sum = str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		if (curr.toLowerCase() == 'rur') {
			$('.res').text(sum + ' р.');
		}
		if (curr.toLowerCase() == 'usd') {
			$('.res').text(sum + ' $');
		}
		if (curr.toLowerCase() == 'eur') {
			$('.res').text(sum + ' €');
		}

		// сохраняем текущие параметры для использования на других страницах
		calcDepositSaveParams(srock, cap, curr, open_in, popolnenie, curr_convert);

		//сохраняем параметры для формы обратной связи
		$('#deposit_params').val(
			'Срок вклада: ' + srock + ' мес., ' +
			'Сумма вклада: ' + (cap * 1000) + ' ' + curr + ', ' +
			'Валюта вклада: ' + curr + ', ' +
			'Офис открытия вклада: ' + (open_in == 'office' ? 'Офис продаж' : 'БКС онлайн') + ', ' +
			'Конвертация валюты между счетами: ' + (curr_convert == 'yes' ? 'Да' : 'Нет') + ', ' +
			'Пополнение и снятие средств со вклада: ' + (popolnenie == 'yes' ? 'Да' : 'Нет') + ', ' +
			'Процент вклада: ' + proc + '%.'
		);
	}

	function dohod(srock, cap, curr, open_in, popolnenie, curr_convert) {
		var proc = procent(srock, curr, cap, open_in, popolnenie, curr_convert);
		var zarabot = Math.ceil((srock * cap * (proc / 100) * 1000) / 12);
		var str = zarabot.toString();
		var sum = str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		if (curr.toLowerCase() == 'rur') {
			$('.dohod').text(sum + ' р.');
		}
		if (curr.toLowerCase() == 'usd') {
			$('.dohod').text(sum + ' $');
		}
		if (curr.toLowerCase() == 'eur') {
			$('.dohod').text(sum + ' €');
		}
	}


	function procent_text(srock, curr, cap, open_in, popolnenie, curr_convert) {
		var proc = procent(srock, curr, cap, open_in, popolnenie, curr_convert);
		$('.proc').text(proc);
	}

	function procent(srock, curr, cap, open_in, popolnenie, curr_convert) {
		var proc = 0;

		if (curr_convert == 'yes') { // мультивалютный
			if (curr.toLowerCase() == 'rur') {
				if (srock == 6) proc = 8.6;
				if (srock == 12) proc = 8.95;
			}

			if (curr.toLowerCase() == 'usd') {
				if (srock == 6) proc = 3;
				if (srock == 12) proc = 3.5;
			}

			if (curr.toLowerCase() == 'eur') {
				if (srock == 6) proc = 3;
				if (srock == 12) proc = 3.5;
			}

			return proc;
		}

		if (curr.toLowerCase() == 'rur') {
			if (open_in == 'bcs') {
				if (popolnenie == 'no') { // доходный
					if (cap <= 300) {
						if (srock == 1) proc = 7.5;
						if (srock == 3) proc = 11.7;
						if (srock == 6) proc = 12.1;
						if (srock == 9) proc = 12.1;
						if (srock == 12) proc = 12.45;
						if (srock == 24) proc = 12.45;
					}
					if (cap > 300) {
						if (srock == 1) proc = 8;
						if (srock == 3) proc = 12.2;
						if (srock == 6) proc = 12.6;
						if (srock == 9) proc = 12.6;
						if (srock == 12) proc = 12.95;
						if (srock == 24) proc = 12.95;
					}
				}
				if (popolnenie == 'yes') { // универсальный выбор
					if (cap <= 300) {
						if (srock == 3) proc = 8.2;
						if (srock == 6) proc = 8.6;
						if (srock == 12) proc = 8.95;
						if (srock == 24) proc = 8.95;
					}
					if (cap > 300 && cap < 10000) {
						if (srock == 3) proc = 8.7;
						if (srock == 6) proc = 9.1;
						if (srock == 12) proc = 9.45;
						if (srock == 24) proc = 9.45;
					}
					if (cap >= 10000) {
						if (srock == 3) proc = 9.2;
						if (srock == 6) proc = 9.6;
						if (srock == 12) proc = 9.95;
						if (srock == 24) proc = 9.95;
					}
				}
			}
			if (open_in == 'office') {
				if (popolnenie == 'no') { // доходный
					if (cap <= 300) {
						if (srock == 1) proc = 7.2;
						if (srock == 3) proc = 11.4;
						if (srock == 6) proc = 11.8;
						if (srock == 9) proc = 11.8;
						if (srock == 12) proc = 12.15;
						if (srock == 24) proc = 12.15;
					}
					if (cap > 300) {
						if (srock == 1) proc = 7.7;
						if (srock == 3) proc = 11.9;
						if (srock == 6) proc = 12.3;
						if (srock == 9) proc = 12.3;
						if (srock == 12) proc = 12.65;
						if (srock == 24) proc = 12.65;
					}
				}
				if (popolnenie == 'yes') { // универсальный выбор
					if (cap <= 300) {
						if (srock == 3) proc = 7.9;
						if (srock == 6) proc = 8.3;
						if (srock == 12) proc = 8.65;
						if (srock == 24) proc = 8.65;
					}
					if (cap > 300 && cap < 10000) {
						if (srock == 3) proc = 8.4;
						if (srock == 6) proc = 8.8;
						if (srock == 12) proc = 9.15;
						if (srock == 24) proc = 9.15;
					}
					if (cap >= 10000) {
						if (srock == 3) proc = 8.9;
						if (srock == 6) proc = 9.3;
						if (srock == 12) proc = 9.65;
						if (srock == 24) proc = 9.65;
					}
				}
			}
		}

		if (curr.toLowerCase() == 'usd' || curr.toLowerCase() == 'eur') { // универсальный выбор

			if (srock == 3) proc = 1;
			if (srock == 6) proc = 3;
			if (srock == 12) proc = 3.5;
			if (srock == 24) proc = 3.5;
		}
		return proc;
	}

	function cap_result(cap, curr) {
		var num = cap * 1000;
		var str = num.toString();
		var sum = str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		var cap_text;
		if (curr.toLowerCase() == 'rur') {
			cap_text = sum + ' р.';
			$('.cap_result').text(cap_text);
		}
		if (curr.toLowerCase() == 'usd') {
			cap_text = sum + ' $';
			$('.cap_result').text(cap_text);
		}
		if (curr.toLowerCase() == 'eur') {
			cap_text = sum + ' €';
			$('.cap_result').text(cap_text);
		}
	}

	$("#slider").on({
		slide: function () {
			srock = Math.round($("#slider").val());
			cap = Math.round($("#slider1").val());
			result(srock, cap, curr, open_in, popolnenie, curr_convert);
			procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
			srock_res(srock);
			cap_result(cap, curr);
			dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
			make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
		}
	});

	$("#slider1").on({
		slide: function () {
			srock = Math.round($("#slider").val());
			cap = Math.round($("#slider1").val());
			result(srock, cap, curr, open_in, popolnenie, curr_convert);
			procent_text(srock, curr, cap, open_in, popolnenie, curr_convert);
			srock_res(srock);
			cap_result(cap, curr);
			dohod(srock, cap, curr, open_in, popolnenie, curr_convert);
			make_diagram(srock, curr, cap, open_in, popolnenie, curr_convert);
		}
	});



});

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

// MagnificPopup ------------------------------------------

var mfq_popup = function (selector) {
	if (!selector) return;

	try {
		$.magnificPopup.open(
			{
				items: {
					src: selector
				},
				type: 'inline',
				alignTop: true,
				mainClass: 'common-popup-container'
			},
			0
		);
	} catch (_) { }
}

$(function () {

	// стилизация radio и checkbox
	$('.jq-checkbox-styled, .jq-radio-styled').styler();

	// всплывашка согласия
	$('.common-popup-trigger').magnificPopup({
		alignTop: true,
		mainClass: 'common-popup-container'
	});

});

//#region Новая выбиралка-всплывашка без manifiq
$(function () {
	$('.dd-select-trigger').on('click', function (ev) {
		$(this).parents('.dd-select').find('.dd-select-popup').toggle();
		return false;
	});
	$('.dd-select-item').on('click', function (ev) {
		var link = $(this),
			dd_select = link.parents('.dd-select'),
			items_selector = dd_select.data('items-selector'),
			trigger = $('.dd-select-trigger', dd_select),
			items = $(items_selector),
			current_item = $(link.attr('href')),
			popup = link.parents('.dd-select-popup');

		items.hide();
		current_item.slideDown();
		current_item.removeAttr('visibility');
		popup.hide();
		trigger.text(link.text());
		return false;
	});
});
//#endregion

//яндекс поиск
$(function () {
	(function (w, d, c) { var s = d.createElement('script'), h = d.getElementsByTagName('script')[0], e = d.documentElement; if ((' ' + e.className + ' ').indexOf(' ya-page_js_yes ') === -1) { e.className += ' ya-page_js_yes'; } s.type = 'text/javascript'; s.async = true; s.charset = 'utf-8'; s.src = (d.location.protocol === 'https:' ? 'https:' : 'http:') + '//site.yandex.net/v2.0/js/all.js'; h.parentNode.insertBefore(s, h); (w[c] || (w[c] = [])).push(function () { Ya.Site.Form.init() }) })(window, document, 'yandex_site_callbacks');
	$('.search_q').keyup(
		function (e) {
			$('.ya-site-form__input-text').val($(this).val());
			if (e.keyCode == 13) {
				$('.ya-site-form__submit').click();
			}
		}
	);

});

$(function () {
	$('.toggle-link').click(function () {
		var selector = $(this).attr('data-toggle');
		var selectorPrepare = selector;
		selectorPrepare = selectorPrepare.replace('.', '\\.');
		var allLinks = $('.toggle-link[data-toggle=' + selectorPrepare + ']');
		var block = $(selector);
		if (block.is(':hidden')) {
			allLinks.addClass('active');
		}
		else {
			allLinks.removeClass('active');
		}
		var effect = $(this).attr('data-effect');
		if (!effect)
			effect = 'slide';
		if (effect == 'fade') {
			block.fadeToggle(300);
		}
		else {
			block.slideToggle(300);
		}
		return false;
	});
});

function set_city(city_id) {
	$.removeCookie('CurrentCity.Id');
	$.cookie('CurrentCity.Id', city_id, { expires: 7, domain: SiteDomain, path: "/" });
	document.location.reload();
}


/* Cookies ********************************************************************/
(function ($) {
	$.cookie = function (name, value, params) {
		if (value === undefined) {
			return get()[name];
		} else {
			var obj = {};
			obj[name] = value;
			set($.extend(obj, params));
		}
	};

	$.removeCookie = function (name, params) {
		var obj = {
			expires: new Date()
		};
		obj[name] = '';

		set($.extend(obj, params));
	};

	var get = function () {
		var result = {};

		$.each(document.cookie.split('; '), function () {
			var cookie = this.split('=');
			result[cookie[0]] = cookie[1];
		});

		return result;
	},

        set = function (params) {
        	if (params.expires !== undefined) {
        		params.expires = ($.type(params.expires) === 'number' ?
                                    new Date((new Date()).getTime() + params.expires * 1000 * 60 * 60 * 24) :
                                    params.expires).toUTCString();
        	}

        	document.cookie = $.map(params, function (el, index) {
        		return index + '=' + el;
        	}).join(';');
        };
})(jQuery);
/* End Cookies ****************************************************************/

$(function () {
	$(document).on('click', '.city-select-link', function (e) {
		e.preventDefault();
		set_city($(this).data('city_id'));
	});
});
