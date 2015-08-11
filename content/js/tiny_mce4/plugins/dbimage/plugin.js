/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*jshint unused:false */
/*global tinymce:true */

/**
 * dbimage plugin that adds a toolbar button and menu item.
 */
tinymce.PluginManager.add('dbimage', function (editor, url) {

	var ShowDialog = function () {
		// Open window with a specific url
		//alert(url + '/dialog.cshtml');
		editor.windowManager.open({
			title: 'Экспресс',
			url: url + '/dialog.cshtml',
			width: 600,
			height: 400,
			buttons: [
					{
						text: 'Вставить',
						onclick: function () {
							// Top most window object
							var win = editor.windowManager.getWindows()[0];
							var content = win.getContentWindow().document.getElementById('content');
							if (!content || !content.innerHTML) {
								alert('Сначала загрузите изображение!');
								return;
							}

							// Insert the contents of the dialog.html textarea into the editor
							var html = content.innerHTML.replace('../../../', '/');
							editor.insertContent(html);

							// Close the window
							win.close();
						}
					},

					{ text: 'Close', onclick: 'close' }
				]
		}, {
			image_url: editor.getParam('dbimage_get_url', 'image.cshtml'),
			image_table: editor.getParam('dbimage_table', '')
		});
	}

	// Add a button that opens a window
	editor.addButton('dbimage', {
		tooltip: 'Добавить изображение',
		icon: 'image',
		onclick: ShowDialog
	});

	// Adds a menu item to the tools menu
	editor.addMenuItem('dbimage', {
		icon: 'image',
		text: 'Добавить изображение',
		context: 'insert',
		onclick: ShowDialog
	});
});