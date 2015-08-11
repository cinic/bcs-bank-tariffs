$(function () {
	$('textarea').tinymce({
		script_url: root_v_path + 'content/js/tiny_mce/tiny_mce.js?v2',
		content_css: root_v_path + 'content/css/tiny_mce.css?2',
		language: 'ru',
		mode: 'textareas',
		theme: 'advanced',
		plugins: 'table,inlinepopups,paste',
		paste_auto_cleanup_on_paste: true,
		theme_advanced_buttons1: 'pastetext,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,removeformat,code,link,hr,|,forecolor,sub,sup,styleselect,formatselect',
		theme_advanced_buttons2: '',
		theme_advanced_buttons3: '',
		theme_advanced_buttons4: '',
		theme_advanced_toolbar_location: 'top',
		theme_advanced_toolbar_align: 'left',
		theme_advanced_statusbar_location: 'bottom',
		theme_advanced_resizing: true,
		relative_urls: false,
		remove_script_host: false,
		style_formats: [{
			title: 'Сноска',
			block: 'div',
			classes: 'reference s-txt gray-line'
		}],
		formats: {
			alignleft: {
				selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
				styles: {
					'text-align': 'left'
				}
			},
			aligncenter: {
				selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
				styles: {
					'text-align': 'center'
				}
			},
			alignright: {
				selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
				styles: {
					'text-align': 'right'
				}
			},
			alignfull: {
				selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
				styles: {
					'text-align': 'width'
				}
			},
			bold: {
				inline: 'b'
			},
			italic: {
				inline: 'i'
			},
			underline: {
				inline: 'u'
			},
			strikethrough: {
				inline: 'span'
			},
			customformat: {
				inline: 'span',
				styles: {
					color: '#00ff00',
					fontSize: '20px'
				},
				attributes: {
					title: 'My custom format'
				}
			}
		}
	});
});