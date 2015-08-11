$.validator.setDefaults({
	ignore: '',
	highlight: function (element, errorClass, validClass) {
		$(element).addClass(errorClass).removeClass(validClass);
		$(element).closest(".form-group").addClass("has-error");
	},
	unhighlight: function (element, errorClass, validClass) {
		$(element).removeClass(errorClass).addClass(validClass);
		$(element).closest(".form-group").removeClass("has-error");
	}
});