var markers = [];
var contactMap, orsMap;

function hoverMarker(num) {
	var marker = markers[num];
	var placemark = marker.placemark;
	placemark.options.set('iconContentLayout', ymaps.templateLayoutFactory.createClass('<span class="marker active">'+num+'</span>'));
	$('.point[data-point='+num+']').addClass('hovered');
}

function blurMarker(num) {
	var marker = markers[num];
	var placemark = marker.placemark;
	if (!marker.active) {
		placemark.options.set('iconContentLayout', ymaps.templateLayoutFactory.createClass('<span class="marker">' + num + '</span>'));
	}
	$('.point[data-point='+num+']').removeClass('hovered');
}

function openPointDetails(num) {
	var at = $('.contacts-offices__addr .tabs-content.active');
	if (at.find('.point-detail[data-point=' + num + ']').is(':visible'))
        return false;

    closeAllPointDetails();
    at.find('.point[data-point=' + num + ']').addClass('active');
    at.find('.point-detail[data-point=' + num + ']').show();

    var top = at.find('.point-detail[data-point=' + num + ']').position().top;
    at.find('.contacts-offices__addr-list').scrollTo(top - 100);

    var marker = markers[num];
    marker.active = true;
    markers[num] = marker;
    hoverMarker(num);
}

function closePointDetails(num) {
	$('.point[data-point='+num+']').removeClass('active');
    $('.point-detail[data-point='+num+']').hide();
    var marker = markers[num];
    marker.active = false;
    markers[num] = marker;
    blurMarker(num);
}

function closeAllPointDetails() {
	$('.point-detail').each(function () {
		var num = parseInt($(this).attr('data-point'));
		closePointDetails(num);
	});
}

var myGeoObjects = [];
var atms = [];

function init_ors(clear) {
	if (clear) atms = [];
	if (atms && atms.length > 0) return;
	var city = $('#ors_city').val();
	if (!city) return;

	var jqxhr = $.get(rootPath + 'api/ors_atm/' + city)
		.done(function (json) {
			atms = json;
			if (clear) {
				var cd = $('#ors_city option[value="' + city + '"]').data('center');
				var center = cd.split(',');
				orsMap.geoObjects.removeAll();
				orsMap.setCenter(center, 12);
			}

			for (var i = 0; i < atms.length; i++) {
				var atm = atms[i];
				myGeoObjects[i] = new ymaps.GeoObject({
					geometry: {
						type: "Point",
						coordinates: atm.coords
					},
					properties: {
						hintContent: atm.address,
						balloonContentHeader: atm.bank,
						balloonContentBody: atm.address + "<br/>" + atm.remark,
						balloonContentFooter: atm.mode
					}

				});
			}

			var myClusterer = new ymaps.Clusterer();
			myClusterer.add(myGeoObjects);
			orsMap.geoObjects.add(myClusterer);

		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			alert('Ошибка получения списка банкоматов');
		});
}

$(function () {
	$('#contacts_tabs').easytabs({
		animate: false,
		updateHash: false,
		defaultTab: defaultTab
	});

	$('#contacts_tabs').on('easytabs:before', function (event, $clicked, $targetPanel, settings) {
		if ($targetPanel.selector == '#atm_ors' && tabs_mode == 'contacts') {
			document.location.href = $clicked.attr('href').split('#')[0];
			return false;
		}
		if ($targetPanel.selector != '#atm_ors' && tabs_mode == 'ors') {
			document.location.href = $clicked.attr('href');
			return false;
		}
	});

	$('.contacts-offices__addr .tabs .tab a').on('click', function (e) {
		closeAllPointDetails();

	});

	$('.contacts-offices__addr-list h3').on('mouseenter', function () {
		var num = parseInt($(this).attr('data-point'));
		hoverMarker(num);
	});
	$('.contacts-offices__addr-list h3').on('mouseleave', function () {
		var num = parseInt($(this).attr('data-point'));
		blurMarker(num);
	});
	$('.contacts-offices__addr-list h3').on('click', function () {
		var num = parseInt($(this).attr('data-point'));
		openPointDetails(num);
		return false;
	});
	$('.contacts-offices__addr-list h3 .btn-close').on('click', function () {
		var $parent = $(this).parent();
		var num = parseInt($parent.attr('data-point'));
		closePointDetails(num);
		return false;
	});

	if ($('#contact-map') && $('#contact-map').length) {
		ymaps.ready(function () {
			contactMap = new ymaps.Map("contact-map",
				{
					center: [center_latitude, center_longitude],
					zoom: 11,
					controls: ['zoomControl'],
					behaviors: ['drag']
				}
			);

			for (var j in contactPoints) {
				var point = contactPoints[j];
				var placemark = new ymaps.Placemark(point, {}, {
					iconLayout: 'default#imageWithContent',
					iconImageHref: '/content/img/spacer.png',
					iconImageSize: [44, 44],
					iconImageOffset: [-22, -22],
					iconContentSize: [44, 44],
					pointNum: j,
					iconContentLayout: ymaps.templateLayoutFactory.createClass('<span class="marker">' + j + '</span>')
				});

				placemark.events
					.add('mouseenter', function (e) {
						var num = e.get('target').options.get('pointNum');
						hoverMarker(num);
					})
					.add('mouseleave', function (e) {
						var num = e.get('target').options.get('pointNum');
						blurMarker(num);
					})
					.add('click', function (e) {
						var num = e.get('target').options.get('pointNum');
						openPointDetails(num);
					});

				contactMap.geoObjects.add(placemark);
				markers[j] = {
					placemark: placemark,
					active: false
				};
			}
		});
	}

	$('#ors_city').on('change', function () {
		init_ors(true);
	});

	$('#ors_city').chosen({
		no_results_text: 'Не найдено:',
		disable_search_threshold: 10,
		search_contains: true,
		width: '100%'
	});
});