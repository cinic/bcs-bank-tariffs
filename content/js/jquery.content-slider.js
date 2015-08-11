jQuery.fn.newsLine = function(options)
{
    var defaults = {
        itemsSelector: '.item',
        arrowLeftSelector: '.arr-left',
        arrowRightSelector: '.arr-right',
        tabsCont: '.tabs_slider'
    };
    var settings = $.extend(false, defaults, options);

    return this.each(
        function()
        {
            var elem = $(this), api = elem.data('newsLine');
            if (api) {
            } else {
                api = new NewsLine(this, settings);
                elem.data('newsLine', api);
            }
        }
    );
}
function NewsLine(wrapper, settings) {
    this.init(wrapper, settings);
};
NewsLine.prototype = {
    targetObject: false,
    banners: false,
    settings: false,
    navPrev: false,
    navNext: false,
    tabs: false,
    count: 0,
    current: 0,
    tmout: 10000,
    timer: false,
    init: function(wrapper, settings) {
        var context = this;
        this.targetObject = $(wrapper);
        this.settings = settings;
        this.banners = $(this.settings.itemsSelector, this.targetObject);
        this.navPrev = $(this.settings.arrowLeftSelector, this.targetObject);
        this.navNext = $(this.settings.arrowRightSelector, this.targetObject);
        this.tabs = $(this.settings.tabsCont);
        this.current = 1;
        this.count = this.banners.length;
       
       var first = $(this.settings.itemsSelector+':first', this.targetObject);
        first.show();
        first.find('.galery-item-content h2').addClass('animated bounceInDown');
        first.find('.galery-item-content h3').addClass('animated bounceInLeft');
       first.find('.galery-item-content .button').addClass('animated bounceInLeft');
        this.initActions();
        this.checkLimits();
        this.tabsDraw();
        if (this.banners.length > 1)
        {
            this.startRotation();
        }
    },
    startRotation: function() {
        var context = this;
        this.timer = setTimeout(function(){
            context.slideNext();
            context.startRotation();
        }, this.tmout);
    },
    stopRotation: function () {
        if (this.timer)
            clearTimeout(this.timer);
    },
    restartRotation: function() {
        this.stopRotation();
        this.startRotation();
    },
    initActions: function() {
        var context = this;
        this.navPrev.click(function(){
            context.slidePrev();
            context.restartRotation();
            return false;
        });
        this.navNext.click(function(){
            context.slideNext();
            context.restartRotation();
            return false;
        });
        this.tabs.delegate( "a","click", function() {
            var link = $(this).index();
            var cur = context.getCurrent();
            var cur_ind = cur.index();
            if(cur_ind != link){
              $('.tabs_slider a').removeClass('current'); 
              $('.tabs_slider a').eq(link).addClass('current');
              context.slideTo(link);
            }
            return false;
        });
    },
    slideNext: function() {
        var cur = this.getCurrent();
        if (!cur.length)
            this.stopRotation();
        var next = this.getNext();
        var next_ind = next.index();
        if (cur.length && next.length)
        {
            $('.tabs_slider a').removeClass('current');
            $('.tabs_slider a').eq(next_ind).addClass('current');
            cur.hide('fade', {direction: 'left', easing:'easeOutExpo'}, 1000);
            next.show('fade', {direction: 'right', easing:'easeOutExpo'}, 1000);
            next.find('.galery-item-content h2').addClass('animated bounceInDown');
            next.find('.galery-item-content h3').addClass('animated bounceInLeft');
            next.find('.galery-item-content .button').addClass('animated bounceInLeft');
            
        }
    },
    slideTo: function(index) {
      var cur = this.getCurrent();
       if (!cur.length)
            this.stopRotation();
      var index_slide = this.getIndex(index);  
      cur.hide('fade', {direction: 'right', easing:'easeOutExpo'}, 1000);
      index_slide.show('fade', {direction: 'left', easing:'easeOutExpo'}, 1000);
      index_slide.find('.galery-item-content h2').addClass('animated bounceInDown');
      index_slide.find('.galery-item-content h3').addClass('animated bounceInLeft');
      index_slide.find('.galery-item-content .button').addClass('animated bounceInLeft');
    },
    slidePrev: function() {
        var cur = this.getCurrent();
        var prev = this.getPrev();
        var prev_ind = prev.index();
        if (cur.length && prev.length)
        {
            $('.tabs_slider a').removeClass('current');
            $('.tabs_slider a').eq(next_ind).addClass('current');
            cur.hide('fade', {direction: 'right', easing:'easeOutExpo'}, 1000);
            prev.show('fade', {direction: 'left', easing:'easeOutExpo'}, 1000);
        }
    },
    getCurrent: function() {
        var cur = $(this.settings.itemsSelector+':visible', this.targetObject);
        return cur;
    },
    getIndex: function(index) {
        var index_slide = $(this.settings.itemsSelector, this.targetObject).eq(index);
        return index_slide;
    },
    getPrev: function() {
        var cur = this.getCurrent();
        var prev = cur.prev(this.settings.itemsSelector);
        if (!prev.length)
            prev = $(this.settings.itemsSelector+':last', this.targetObject);
        return prev;
    },
    getNext: function() {
        var cur = this.getCurrent();
        var next = cur.next(this.settings.itemsSelector);
        if (!next.length)
            next = $(this.settings.itemsSelector+':first', this.targetObject);
        return next;
    },
    checkLimits: function() {
        if (this.current == 1)
            this.navPrev.hide();
        else
            this.navPrev.show();

        if (this.current == this.count)
            this.navNext.hide();
        else
            this.navNext.show();
    },
    tabsDraw: function() {
      var i = 0;
      while (i < this.count) {
        if (i == 0) {
          this.tabs.append('<a href="#" class="current">'+i+'</a>');
        }else {
          this.tabs.append('<a href="#">'+i+'</a>');
        }
        i++;
      }
    },
    fireCallback: function(fn) {
        if($.isFunction(fn)) {
            fn.call(this);
        };
        this.fireCallback(this.settings.onstart);
    }
}