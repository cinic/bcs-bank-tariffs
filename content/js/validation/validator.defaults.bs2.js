$.validator.setDefaults({
	ignore: '',
	highlight: function (element, errorClass, validClass) {
		$(element).addClass(errorClass).removeClass(validClass);
		$(element).closest(".form-control").addClass("error");
	},
	unhighlight: function (element, errorClass, validClass) {
		$(element).removeClass(errorClass).addClass(validClass);
		$(element).closest(".form-control").removeClass("error");
	}
});