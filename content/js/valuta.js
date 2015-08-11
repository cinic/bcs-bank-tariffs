/**
 * пошаговка
 */

$(function () {
	var $stepperWrapper = $('.stepper-wrapper'),
		$stepper = $('.stepper', $stepperWrapper);

	$stepper.owlCarousel({
		items: 4,
		itemsDesktop: false,
		itemsDesktopSmall: false,
		navigation: true,
		navigationText: false,
		pagination: false,
		theme: ''
	});

	var owl = $(".owl-carousel").data('owlCarousel');
	owl.jumpTo($stepper.data('step') - 1);

	$stepperWrapper.scrollspy({
		min: $stepperWrapper.offset().top,
		max: $('body').height(),
		onEnter: function () {
			$stepperWrapper.addClass('stepper-wrapper--fixed');
		},
		onLeave: function () {
			$stepperWrapper.removeClass('stepper-wrapper--fixed');
		}
	});
});


/**
 * таймер
 */

$(function () {
	$('.valuta-timer img').click(function () {
		$.magnificPopup.open({
			items: {
				src: '.timeout-popup',
				type: 'inline'
			}
		});

		return false;
	});
});
