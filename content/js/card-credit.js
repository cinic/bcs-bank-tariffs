var product_id = 5;

$(function () {

	$('#callbackForm_amount').val('');
	$('#callbackForm_period').val('12').parents('.form-group').hide();

	$('#callbackForm').BaseForm({
		Name: 'Заявка',
		Url: 'http://bcs-bank.com/',
		succesHandler: function () {
			$('.contact-form .container.first').hide();
			$('.contact-form .container.second').show();
			try {
				GTM.push('Заявка с сайта', 'Кредитная карта «Бонус»');
				GTM.conversion(
						$.trim($('#callbackForm_name').val() + ' ' + $('#callbackForm_lastname').val()),
						$('#callbackForm_phone').val(),
						$('#callbackForm_email').val(),
						"Заявка с сайта - Кредитная карта «Бонус»",
						'card_bonus',
						null,
						null,
						'FEEDBACK_REQUEST_BONUS'
					);
			} catch (_) { }
			aco_start({ product: 5, skip_step1: true, page: 'card_bonus', goal: 'FEEDBACK_ANKETA_BONUS', refid: null });
		},
		errorHandler: function () {
			message('Контакты', 'Ошибка при обработке формы, не удалось отправить заявку.');
		}
	});

	$("#cards_carousel").owlCarousel({
		items: 3,
		itemsDesktop: [1199, 3],
		itemsDesktopSmall: [979, 3],
		itemsTablet: [768, 2],
		itemsTabletSmall: [640, 2],
		itemsMobile: [479, 1]
	});
	var owl = $("#cards_carousel").data('owlCarousel');

	$(".arr-right").click(function () {
		owl.next();
	});
	$(".arr-left").click(function () {
		owl.prev();
	});

	var set_card = function (cardnum, vtab) {
		owl.goTo(cardnum);
		$('.bcs_card_selector a.tab-link.active').removeClass('active');
		$('[data-cardnum=' + cardnum + '] a.tab-link').addClass('active');
		$('.vtab-content .vtab').hide();
		$(vtab).show();
		if (cardnum == 3) { $('.nevklad').hide(); $('.vklad').show(); }
		else { $('.nevklad').show(); $('.vklad').hide(); }
	}

	$('.bcs_card_selector a.tab-link').on('click', function (e) {
		e.preventDefault();
		$(this).parents('.item').trigger('click');
	});

	$('.bcs_card_selector .item').on('click', function (e) {
		var $this = $(this),
				target = $this.data('target'),
				cardnum = $this.data('cardnum');
		e.preventDefault();
		set_card(cardnum, target);
	});

});