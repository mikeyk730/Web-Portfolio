(function($) {
    $.fn.fullBleed = function(parameters) {
        parameters = parameters || {};
        var defaults = {
            align: 'center center',
            className: ''
        };
        parameters = $.extend(defaults, parameters);
        var ie = (function() {
            var v = 3,
                div = document.createElement('div'),
                a = div.all || [];
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0]);
            return v > 4 ? v : !v;
        }());
        return this.each(function() {
            if (!ie || ie >= 9) {
                var src = $(this).prop('src');
                var $div = $('<div></div>').css({
                    'background-image': 'url(' + src + ')',
                    'background-position': parameters.align,
                    'background-repeat': 'no-repeat',
                    '-webkit-background-size': 'cover',
                    '-moz-background-size': 'cover',
                    '-o-background-size': 'cover',
                    'background-size': 'cover',
                    'width': '100%',
                    'height': '100%',
                    'position': 'absolute',
                    'top': 0,
                    'left': 0
                });
                if (parameters.className != "") $div.addClass(parameters.className);
                $(this).replaceWith($div);
            } else {
                var $image = $(this);
                var $window = $(window);
                $image.parent().css({
                    overflow: 'hidden'
                });
                $image.css({
                    position: 'absolute'
                });
                if (parameters.className != "") $image.addClass(parameters.className);

                function resize() {
                    var width = $image.data('width');
                    var height = $image.data('height');
                    var windowWidth = parseInt($window.width());
                    var windowHeight = parseInt($window.height());
                    var aspectRatio = Math.round(width / height * 100) / 100;
                    var newWidth = windowWidth;
                    var newHeight = Math.round(newWidth / aspectRatio);
                    if (newHeight < windowHeight) {
                        var newHeight = windowHeight;
                        var newWidth = Math.round(newHeight * aspectRatio);
                    }
                    switch (parameters.align) {
                        case "top left":
                            var newPosition = [0, 'auto', 'auto', 0];
                            break;
                        case "top center":
                            var newPosition = [0, 'auto', 'auto', (windowWidth - newWidth) / 2 + 'px'];
                            break;
                        case "top right":
                            var newPosition = [0, 0, 'auto', 'auto'];
                            break;
                        case "center left":
                            var newPosition = [(windowHeight - newHeight) / 2 + "px", 'auto', 'auto', 0];
                            break;
                        case "center center":
                            var newPosition = [(windowHeight - newHeight) / 2 + 'px', 'auto', 'auto', (windowWidth - newWidth) / 2 + 'px'];
                            break;
                        case "center right":
                            var newPosition = [(windowHeight - newHeight) / 2 + "px", 0, 'auto', 'auto'];
                            break;
                        case "bottom left":
                            var newPosition = ['auto', 'auto', 0, 0];
                            break;
                        case "bottom center":
                            var newPosition = ['auto', 'auto', 0, (windowWidth - newWidth) / 2 + 'px'];
                            break;
                        case "bottom right":
                            var newPosition = ['auto', 0, 0, 'auto'];
                            break;
                    }
                    $image.css({
                        'width': newWidth + 'px',
                        'height': newHeight + 'px',
                        'top': Math.round(newPosition[0]),
                        'right': Math.round(newPosition[1]),
                        'bottom': Math.round(newPosition[2]),
                        'left': Math.round(newPosition[3])
                    });
                }
                $(window).resize(function() {
                    console.log('resizing');
                    resize($image);
                });
                $image.load(function() {
                    $this = $(this);
                    $this.data({
                        'width': parseInt($this.width()),
                        'height': parseInt($this.height())
                    });
                    resize($this);
                    $this.css({
                        opacity: 1
                    });
                }).each(function() {
                    if (this.complete) $(this).load();
                });
            }
            return this;
        });
    };
})(jQuery);
var rsn = new Object();
rsn.markup = function() {
    $('.grid.archive > li:nth-child(3n+1)').addClass('clear');
};
rsn.pages = function() {
    if ($('body').hasClass('left')) {
        $('#content').scroll(function() {
            if ($('#content').height() + $('#content').scrollTop() == $('#content')[0].scrollHeight) {
                rsn.moreImages();
            }
        });
    } else {
        $(window).scroll(function() {
            if ($(window).height() + $(window).scrollTop() == $(document).height()) {
                rsn.moreImages();
            }
        });
    }
};
rsn.moreImages = function() {
    var currentPage = $('.images').attr('class').split(' ').pop().replace('page', '') * 1;
    var nextPage = currentPage + 1;
    $('.images').removeClass('page' + currentPage).addClass('page' + nextPage);
    var url = "/archive?page=" + nextPage;
    $('<ul id="temporary"></ul>').appendTo('body').load(url + ' .images > li', function() {
        $(this).children('li').each(function() {
            $(this).appendTo('.images');
        });
        $(this).remove();
    });
};
rsn.forms = function() {
    var action = "/actions" + $(this).attr('action');
    $(this).attr('action', action);
};
function handleResize() {
    $("#post-container header").css({
	height: $(window).height() + "px"
    });
}
$(document).ready(function() {
    $('body').removeClass('loading');
    rsn.markup();
    if ($('.list.archive').length > 0) rsn.pages();
    $('.contact_form').each(rsn.forms);
    $('header > div > .menu').click(function() {
        $('nav').toggleClass('expanded');
        return false;
    });
    $('nav ul ul').siblings('a').click(function() {
        $(this).siblings('ul').toggleClass('expanded');
        return false;
    });
    if ($('.page-cover').length){
        var e = $('.images img');
        e.attr('src', e.attr('data-src'));
        e.fullBleed({'className': 'to-move'});
        $('.to-move').appendTo('body');
    }
    $(window).resize(function () {
        handleResize();
    });
    handleResize();
    $('#post-cover').click(function(){
        var pos = $('#content').position();
        var top = pos ? pos.top : 300;
        scrollTo(0, top-100);
    });
});
$(window).load(function() {
    $('body').removeClass('loading');
});
