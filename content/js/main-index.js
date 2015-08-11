function update_qonline() {
	var jqxhr = $.getJSON(rootPath + "get_courses_update", function (data) {
		$('.bcs_online .update_date').html("на " + data.online_date + " Мск");
		for (var code in data.cources) {
			var b = parseNumber(data.cources[code][1]),
					s = parseNumber(data.cources[code][0]),
					bo = parseNumber(data.cources[code][2]),
					so = parseNumber(data.cources[code][3]);

			var row = $('.bcs_online tr.' + code);
			row.find('td.buy').text(b.toMoney(4, ',', ''));
			row.find('td.sell').text(s.toMoney(4, ',', ''));
		}

		$('.bcs_offline .update_date').html("на " + data.clearing_date);
		for (var code in data.bank) {
			var bb = parseNumber(data.bank[code][0]),
					bs = parseNumber(data.bank[code][1]);

			var row = $('.bcs_offline tr.' + code);
			row.find('td.buy').text(bb.toMoney(4, ',', ''));
			row.find('td.sell').text(bs.toMoney(4, ',', ''));
		}
	});
}

function parseNumber(n) {
	if (typeof (n) != "string") n = String(n);

	n = n.replace(/[^\w\.,-]/g, "");
	n = n.replace(/,/, ".");

	return Number(n);
}

Number.prototype.toMoney = function (decimals, decimal_sep, thousands_sep) {
	var n = this,
		c = isNaN(decimals) ? 2 : Math.abs(decimals),
		d = decimal_sep || '.',
		t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		sign = (n < 0) ? '-' : '',
		i = parseInt(n = Math.abs(n).toFixed(c)) + '',
		j = ((j = i.length) > 3) ? j % 3 : 0;
	return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}

$(function () {

	$.ajaxSetup({ cache: false });
	setInterval(function () {
		update_qonline();
	}, 30000);

});