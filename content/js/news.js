var NewsLoading = false;
var NewsLastPage = 'false';
var NewsCurrentPage = 1;

function loadMoreNews(params) {
	var jqxhr = $.get(
		rootPath + 'news/page/' + params,
		function () {
		})
		.done(
			function (data) {
				$('.bcs_news .news-list-content .row:last').after(data);
				if (NewsLastPage == 'true') {
					$('div.more').hide();
				} else {
					NewsCurrentPage++;
				}
				NewsLoading = false;
			}
		)
		.fail(
			function () {
				NewsLoading = false;
			}
		)
		.always(
			function () {
				NewsLoading = false;
			}
		);
	return false;
}

$(function () {

	$('[data-action="more"]').click(
		function () {
			if (NewsLoading) return false;
			if (NewsLastPage == 'true') return false;
			NewsLoading = true;
			return loadMoreNews(NewsCurrentPage + 1);
		}
	);

});
