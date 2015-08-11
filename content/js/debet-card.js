$(function () {
	$('.bcs_card_selector a.tab-link').click(function (e) {
		var $this = $(this),
			target = $this.data('target'),
			url = $this.data('url');
		e.preventDefault();
		$('.bcs_card_selector').find('a.tab-link').removeClass('active');
		$this.addClass('active');
		$('.vtab-content .vtab').hide();
		$(target).show();
	});
});