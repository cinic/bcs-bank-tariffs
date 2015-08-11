jQuery.validator.addMethod("phonenumber", function (value, element) {
	if (this.optional(element)) return true;
	var pnumber_od = value.replace(/\D/g, '');
	if (pnumber_od.length < 11) return false;
	var pnumber10 = pnumber_od.slice(-10),
		ccode = parseInt(pnumber10.substring(0, 1)),
		ocode = parseInt(pnumber10.substring(0, 3));
	if (ccode == 9 || ccode == 7) return true;
	var prefixes = [495, 499, 812, 877, 388, 385, 416, 818, 851, 347, 472, 483, 301, 492, 844, 817, 473, 872, 426, 302, 493, 873, 395, 866, 401, 847, 484, 415, 878, 814, 384, 833, 821, 494, 861, 391, 352, 471, 813, 474, 413, 836, 834, 496, 498, 815, 831, 816, 383, 381, 353, 486, 841, 342, 423, 811, 863, 491, 846, 845, 424, 343, 867, 481, 865, 475, 843, 482, 382, 487, 394, 345, 341, 842, 421, 390, 351, 871, 835, 427, 411, 349, 485];
	return $.inArray(ocode, prefixes) >= 0;
});
jQuery.validator.unobtrusive.adapters.addBool("phonenumber");

jQuery.validator.addMethod("phoneprefix", function (value, element) {
	if (this.optional(element)) return true;
	var pnumber_od = value.replace(/\D/g, '');
	if (pnumber_od.length < 3) return false;
	var pnumber3 = pnumber_od.slice(-3),
		ccode = parseInt(pnumber3.substring(0, 1)),
		ocode = parseInt(pnumber3.substring(0, 3));
	if (ccode == 9 || ccode == 7) return true;
	var prefixes = [495, 499, 812, 877, 388, 385, 416, 818, 851, 347, 472, 483, 301, 492, 844, 817, 473, 872, 426, 302, 493, 873, 395, 866, 401, 847, 484, 415, 878, 814, 384, 833, 821, 494, 861, 391, 352, 471, 813, 474, 413, 836, 834, 496, 498, 815, 831, 816, 383, 381, 353, 486, 841, 342, 423, 811, 863, 491, 846, 845, 424, 343, 867, 481, 865, 475, 843, 482, 382, 487, 394, 345, 341, 842, 421, 390, 351, 871, 835, 427, 411, 349, 485];
	return $.inArray(ocode, prefixes) >= 0;
});
jQuery.validator.unobtrusive.adapters.addBool("phoneprefix");

jQuery.validator.addMethod("datetime", function (value, element) {
	var optional = this.optional(element),
		placeholder = $(element).data('val-date-placeholder'),
		stamp = value.split(" ");
	if (optional && (!value || value == placeholder)) return true;

	var validDate = false, reDate = /^\d{2}\.\d{2}\.\d{4}$/;
	if (reDate.test(stamp[0])) {
		var adata = stamp[0].split('.');
		var gg = parseInt(adata[0], 10);
		var mm = parseInt(adata[1], 10);
		var aaaa = parseInt(adata[2], 10);
		var xdata = new Date(aaaa, mm - 1, gg);
		if ((xdata.getFullYear() === aaaa) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === gg)) {
			validDate = true;
		} else {
			validDate = false;
		}
	} else {
		validDate = false;
	}

	var validTime = /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i.test(stamp[1]);

	return validDate && validTime;
});
jQuery.validator.unobtrusive.adapters.addBool("datetime");

jQuery.validator.addMethod("daterange", function (value, element, param) {
	var optional = this.optional(element),
		stamp = value.split(" ");
	if (optional && (!value || value == placeholder)) return true;
	if (!param || !param.min || !param.max) return true;

	var validDate = false, reDate = /^\d{2}\.\d{2}\.\d{4}$/;
	if (reDate.test(stamp[0])) {
		var adata = stamp[0].split('.');
		var gg = parseInt(adata[0], 10);
		var mm = parseInt(adata[1], 10);
		var aaaa = parseInt(adata[2], 10);
		var xdata = new Date(aaaa, mm - 1, gg);
		if ((xdata.getFullYear() === aaaa) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === gg)) {
			validDate = true;
		} else {
			validDate = false;
		}
	} else {
		validDate = false;
	}

	return validDate && ((param.min <= xdata) && (xdata <= param.max));
});
jQuery.validator.unobtrusive.adapters.addMinMax("daterange", '', '', "daterange");

$.validator.addMethod('daterange2360', function (value, element) {
	if (this.optional(element)) {
		return true;
	}

	var dt = value, dts = dt.split('.');
	// возраст от 23 до 60 лет
	var d = parseInt(dts[0], 10),
		m = parseInt(dts[1], 10),
		y = parseInt(dts[2], 10),
		t = new Date(),
		a = (t.getFullYear() - y - ((t.getMonth() - --m || t.getDate() - d) < 0));
	if (a < 23 || a > 60) return false;

	return true;

	/*var startDate = Date.parse('2010-11-29'),
	endDate = Date.parse('2010-12-15'),
	enteredDate = Date.parse(value);

	if (isNan(enteredDate)) {
	return false;
	}

	return ((startDate <= enteredDate) && (enteredDate <= endDate));*/
});
jQuery.validator.unobtrusive.adapters.addBool("daterange2360");

jQuery.validator.addMethod("decimal", function (value, element) {
	return this.optional(element) || /^(\d+|\d+,\d{1,2})$/.test(value);
});
jQuery.validator.unobtrusive.adapters.addBool("decimal");

jQuery.validator.addMethod("notequal", function (value, element, param) {
	if (this.optional(element)) {
		return true;
	}
	return value != param;
});
jQuery.validator.unobtrusive.adapters.addBool("notequal");

/*
* Localized default methods for the jQuery validation plugin.
* Locale: RU
*/
jQuery.extend(jQuery.validator.methods, {
	date: function (value, element) {
		var optional = this.optional(element),
			placeholder = $(element).data('val-date-placeholder');
		if (optional && (!value || value == placeholder)) return true;

		var check = false;
		var re = /^\d{2}\.\d{2}\.\d{4}$/;
		if (re.test(value)) {
			var adata = value.split('.');
			var gg = parseInt(adata[0], 10);
			var mm = parseInt(adata[1], 10);
			var aaaa = parseInt(adata[2], 10);
			var xdata = new Date(aaaa, mm - 1, gg);
			if ((xdata.getFullYear() === aaaa) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === gg)) {
				check = true;
			} else {
				check = false;
			}
		} else {
			check = false;
		}
		return check;
	}
});

jQuery.validator.addMethod("mustbetrue", function (value, element) {
	return element.checked;
});
jQuery.validator.unobtrusive.adapters.addBool("mustbetrue");

/*разрешаем использовать запятую как разделителя дестичного разряда*/
$.validator.methods.range = function (value, element, param) {
	var globalizedValue = value.replace(",", ".");
	return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
}

$.validator.methods.number = function (value, element) {
	return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);
}