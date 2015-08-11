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

	var $map = $('.js-map'),
		$city = $('.js-filial-city'),
		$branch = $('.js-filial-branch'),
		$filial = $('.js-filial-info'),
		$address = $('.js-filial-address'),
		$worktimeMonFri = $('.js-worktime-mon-fri'),
		$worktimeSat = $('.js-worktime-sat'),
		$worktimeSun = $('.js-worktime-sun'),
		$phone = $('.js-filial-phone');

	var htmlCity = '<option disabled selected>Выберите город</option>',
		htmlBranch = '<option disabled selected>Выберите отделение</option>',
		html = '';

	var selectedCity, selectedBranch, contactMap;

	var init = function () {
		$.each(filialInfo, function (key, obj) {
			html += '<option value="' + obj.id + '" data-key="' + key + '">' + obj.city + '</option>';
		});

		html = htmlCity + html;
		$city.html(html).on('change', changeCity).triggerHandler('change');
	};

	var changeCity = function () {
		selectedCity = $(this).find(':selected').data('key');

		if (typeof selectedCity == 'undefined') {
			resetBranch();
			return;
		}

		html = '';
		$.each(filialInfo[selectedCity].branches, function (key, obj) {
			html += '<option value="' + obj.id + '" data-key="' + key + '">' + obj.title + '</option>';
		});

		html = htmlBranch + html;
		$branch.html(html).on('change', changeBranch).triggerHandler('change');
		$filial.hide();

		var point = filialInfo[selectedCity].coords;
		contactMap.setCenter(point, 11, { duration: 500 });
	};

	var changeBranch = function () {
		var branch;

		selectedBranch = $(this).find(':selected').data('key');
		if (typeof selectedBranch == 'undefined') {
			return;
		}

		branch = filialInfo[selectedCity].branches[selectedBranch];

		$address.text(branch.address);
		$worktimeMonFri.text(branch.worktime.mon_fri);
		$worktimeSat.text(branch.worktime.sat);
		$worktimeSun.text(branch.worktime.sun);
		$phone.text(branch.phone);
		$filial.show();

		var point = branch.coords;
		contactMap.setCenter(point, 15, { duration: 500 });
	};

	var resetBranch = function () {
		$branch.html(htmlBranch);
		$filial.hide();
	};

	ymaps.ready(function () {
		contactMap = new ymaps.Map("map", {
			center: [59.648456, 70.256996],
			zoom: 4,
			controls: ['zoomControl'],
			behaviors: ['drag']
		});

		$.each(filialInfo, function (id, obj) {
			$.each(obj.branches, function (id, obj) {
				var point = obj.coords;
				var placemark = new ymaps.Placemark(point, {}, {
					iconLayout: 'default#imageWithContent',
					iconImageHref: '/content/img/spacer.png',
					iconImageSize: [44, 44],
					iconImageOffset: [-22, -22],
					iconContentSize: [44, 44],
					iconContentLayout: ymaps.templateLayoutFactory.createClass('<span class="marker">' + id + '</span>')
				});

				contactMap.geoObjects.add(placemark);
			});
		});
	});

	init();
});
