(function ($) {

	var isSubmited = false;

	function _error(response, status, xhr, f, settings) {
		//message(settings.Name, 'Ошибка при отправке формы, не удалось отправить заявку.<br />' + status + ': ' + xhr);
		isSubmited = false;
		if (settings.errorHandler)
			settings.errorHandler(f);
	}

	function _success(response, status, xhr, f, settings) {
		isSubmited = false;
		if (response.success) {
		} else {
			//message(settings.Name, 'Ошибка при обработке формы, не удалось отправить заявку.');
		}
		if (settings.succesHandler)
			settings.succesHandler(f);
	}


	$.fn.BaseForm = function (options) {

		var settings = $.extend({
			Name: 'Заявка',
			Url: 'http://bcs-bank.com/',
			succesHandler: undefined,
			errorHandler: undefined
		}, options);

		this.find('.phone-mask').mask('+7 (999) 999-9999');

		this.data('validator').settings.submitHandler = function (f) {
			if (isSubmited) return false;
			isSubmited = true;
			$(f).ajaxSubmit({
				url: f.action,
				type: 'POST',
				dataType: 'json',
				resetForm: false,
				error: function (response, status, xhr, f) { _error(response, status, xhr, f, settings); },
				success: function (response, status, xhr, f) { _success(response, status, xhr, f, settings); }
			});
		};

		return this;
	};
} (jQuery));
