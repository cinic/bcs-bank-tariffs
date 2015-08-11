$(function () {


	$("#rko_carousel").owlCarousel({
		items: 3,
		itemsDesktop: [1199, 3],
		itemsDesktopSmall: [979, 3],
		itemsTablet: [768, 2],
		itemsTabletSmall: [640, 2],
		itemsMobile: [479, 1]
	});


	var owl = $("#rko_carousel").data('owlCarousel');


	$(".arr-right").click(function () {
		owl.next();
	});


	$(".arr-left").click(function () {
		owl.prev();
	});


	$('.rko_tarif_selector a.tab-link').on('click', function (e) {
		e.preventDefault();
		$(this).parents('.item').trigger('click');
	});


	$('.rko_tarif_selector .item').on('click', function (e) {
		var
			$this = $(this),
			target = $this.data('target'),
			rkonum = $this.data('rkonum');
		e.preventDefault();

		owl.goTo(rkonum);
		$('.vtab-content .vtab').hide();
		$('.rko_tarif_selector a.tab-link.active, .rko_tarif_selector a.tab-link.active + p').removeClass('active');
		$('[data-rkonum=' + rkonum + '] a.tab-link, [data-rkonum=' + rkonum + '] a.tab-link + p').addClass('active');
		$(target).show();
	});


});