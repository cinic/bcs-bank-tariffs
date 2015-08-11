/*!
 * jQuery Transparent Selector Plugin
 * version: 0.1.0
 * author: @kbychkov
 * license: MIT
 */
;(function($) {
    'use strict'
    
    $.fn.transparentSelector = function(options) {
        var settings = $.extend({
            'class': ''
        }, options);
        
        return this.each(function() {
            var $wrapper = $('<span class="transparent-selector"></span>'),
                $value = $('<span class="transparent-selector__value"></span>'),
                $button = $('<span class="transparent-selector__button"></span>'),
                $select = $(this);
            
            if (settings['class'] != '') $wrapper.addClass(settings['class']);

            $select
                .wrap($wrapper)
                .before($value)
                .before($button)
                .on('change', function() {
					var text = $select.find(':selected').text();
                    $value.text(text);
                }).triggerHandler('change');
        });
    }
})(jQuery);
