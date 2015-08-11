$(function () {


	$("#ds_carousel").owlCarousel({
		items: 3,
		itemsDesktop: [1400, 3],
		itemsDesktopSmall: [1400, 3],
		itemsTablet: [1185, 2],
		itemsTabletSmall: [1185, 2],
		itemsMobile: [700, 1]
	});


	var owl = $("#ds_carousel").data('owlCarousel');


	$(".arr-right").click(function () {
		owl.next();

		if (GetWidth() < 700) {

			var flagClick = false;
			var eqA = $('.rko_tarif_selector .item a.active').parent().data('dsnum');
			eqA++;
			$('.rko_tarif_selector .item').each(function () {
				if ($(this).data('dsnum') == eqA) {
					$(this).trigger('click');
					flagClick = true;
				}
			});

			if (!flagClick) {
				$('.rko_tarif_selector .item').eq(0).trigger('click');
			}

		}

	});


	$(".arr-left").click(function () {
		owl.prev();

		if (GetWidth() < 700) {

			var flagClick = false;
			var eqA = $('.rko_tarif_selector .item a.active').parent().data('dsnum');
			eqA--;
			$('.rko_tarif_selector .item').each(function () {
				if ($(this).data('dsnum') == eqA) {
					$(this).trigger('click');
					flagClick = true;
				}
			});

			if (!flagClick) {
				$('.rko_tarif_selector .item').eq(-1).trigger('click');
			}

		}

	});


	$('.rko_tarif_selector a.tab-link').on('click', function (e) {
		e.preventDefault();
		$(this).parents('.item').trigger('click');
	});


	$('.rko_tarif_selector .item').on('click', function (e) {
		var 
			$this = $(this),
			target = $this.data('target'),
			details = $this.data('details'),
			dsnum = $this.data('dsnum'),
			depositName = $this.children().first().text();
		e.preventDefault();

		owl.goTo(dsnum);
		$('.vtab-content .vtab, .deposit-details').hide();
		$('.rko_tarif_selector a.tab-link.active, .rko_tarif_selector a.tab-link.active + p').removeClass('active');
		$('[data-dsnum=' + dsnum + '] a.tab-link, [data-dsnum=' + dsnum + '] a.tab-link + p').addClass('active');
		$(target).show();
		$(details).show();

		$('#deposit_name').val(depositName);
	});


	$('#deposit_params').val('не передаются, поскольку калькулятор вкладов временно скрыт.');


});


function GetWidth() {
	return parseInt($(window).width());
}