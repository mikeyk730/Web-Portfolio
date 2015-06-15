(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory(jQuery);
    }
}(function($) {
    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;
    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
    }
    $.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },
        teardown: function() {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };
    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },
        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });

    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";
        if (orgEvent.wheelDelta) {
            delta = orgEvent.wheelDelta;
        }
        if (orgEvent.detail) {
            delta = orgEvent.detail * -1;
        }
        if (orgEvent.deltaY) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if (orgEvent.deltaX) {
            deltaX = orgEvent.deltaX;
            delta = deltaX * -1;
        }
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
            lowestDeltaXY = absDeltaXY;
        }
        fn = delta > 0 ? 'floor' : 'ceil';
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);
        args.unshift(event, delta, deltaX, deltaY);
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
}));
if (jQuery)(function() {
    $.extend($.fn, {
        rightClick: function(handler) {
            $(this).each(function() {
                $(this).mousedown(function(e) {
                    var evt = e;
                    $(this).mouseup(function() {
                        $(this).unbind('mouseup');
                        if (evt.button == 2) {
                            handler.call($(this), evt);
                            return false;
                        } else {
                            return true;
                        }
                    });
                });
                $(this)[0].oncontextmenu = function() {
                    return false;
                }
            });
            return $(this);
        },
        rightMouseDown: function(handler) {
            $(this).each(function() {
                $(this).mousedown(function(e) {
                    if (e.button == 2) {
                        handler.call($(this), e);
                        return false;
                    } else {
                        return true;
                    }
                });
                $(this)[0].oncontextmenu = function() {
                    return false;
                }
            });
            return $(this);
        },
        rightMouseUp: function(handler) {
            $(this).each(function() {
                $(this).mouseup(function(e) {
                    if (e.button == 2) {
                        handler.call($(this), e);
                        return false;
                    } else {
                        return true;
                    }
                });
                $(this)[0].oncontextmenu = function() {
                    return false;
                }
            });
            return $(this);
        },
        noContext: function() {
            $(this).each(function() {
                $(this)[0].oncontextmenu = function() {
                    return false;
                }
            });
            return $(this);
        }
    });
})(jQuery);;
(function($, undefined) {
    "use strict";
    var ver = '3.0.3';

    function debug(s) {
        if ($.fn.cycle.debug)
            log(s);
    }

    function log() {
        if (window.console && console.log)
            console.log('[cycle] ' + Array.prototype.join.call(arguments, ' '));
    }
    $.expr[':'].paused = function(el) {
        return el.cyclePause;
    };
    $.fn.cycle = function(options, arg2) {
        var o = {
            s: this.selector,
            c: this.context
        };
        if (this.length === 0 && options != 'stop') {
            if (!$.isReady && o.s) {
                log('DOM not ready, queuing slideshow');
                $(function() {
                    $(o.s, o.c).cycle(options, arg2);
                });
                return this;
            }
            log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
            return this;
        }
        return this.each(function() {
            var opts = handleArguments(this, options, arg2);
            if (opts === false)
                return;
            opts.updateActivePagerLink = opts.updateActivePagerLink || $.fn.cycle.updateActivePagerLink;
            if (this.cycleTimeout)
                clearTimeout(this.cycleTimeout);
            this.cycleTimeout = this.cyclePause = 0;
            this.cycleStop = 0;
            var $cont = $(this);
            var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
            var els = $slides.get();
            if (els.length < 2) {
                log('terminating; too few slides: ' + els.length);
                return;
            }
            var opts2 = buildOptions($cont, $slides, els, opts, o);
            if (opts2 === false)
                return;
            var startTime = opts2.continuous ? 10 : getTimeout(els[opts2.currSlide], els[opts2.nextSlide], opts2, !opts2.backwards);
            if (startTime) {
                startTime += (opts2.delay || 0);
                if (startTime < 10)
                    startTime = 10;
                debug('first timeout: ' + startTime);
                this.cycleTimeout = setTimeout(function() {
                    go(els, opts2, 0, !opts.backwards);
                }, startTime);
            }
        });
    };

    function triggerPause(cont, byHover, onPager) {
        var opts = $(cont).data('cycle.opts');
        if (!opts)
            return;
        var paused = !!cont.cyclePause;
        if (paused && opts.paused)
            opts.paused(cont, opts, byHover, onPager);
        else if (!paused && opts.resumed)
            opts.resumed(cont, opts, byHover, onPager);
    }

    function handleArguments(cont, options, arg2) {
        if (cont.cycleStop === undefined)
            cont.cycleStop = 0;
        if (options === undefined || options === null)
            options = {};
        if (options.constructor == String) {
            switch (options) {
                case 'destroy':
                case 'stop':
                    var opts = $(cont).data('cycle.opts');
                    if (!opts)
                        return false;
                    cont.cycleStop++;
                    if (cont.cycleTimeout)
                        clearTimeout(cont.cycleTimeout);
                    cont.cycleTimeout = 0;
                    if (opts.elements)
                        $(opts.elements).stop();
                    $(cont).removeData('cycle.opts');
                    if (options == 'destroy')
                        destroy(cont, opts);
                    return false;
                case 'toggle':
                    cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
                    checkInstantResume(cont.cyclePause, arg2, cont);
                    triggerPause(cont);
                    return false;
                case 'pause':
                    cont.cyclePause = 1;
                    triggerPause(cont);
                    return false;
                case 'resume':
                    cont.cyclePause = 0;
                    checkInstantResume(false, arg2, cont);
                    triggerPause(cont);
                    return false;
                case 'prev':
                case 'next':
                    opts = $(cont).data('cycle.opts');
                    if (!opts) {
                        log('options not found, "prev/next" ignored');
                        return false;
                    }
                    if (typeof arg2 == 'string')
                        opts.oneTimeFx = arg2;
                    $.fn.cycle[options](opts);
                    return false;
                default:
                    options = {
                        fx: options
                    };
            }
            return options;
        } else if (options.constructor == Number) {
            var num = options;
            options = $(cont).data('cycle.opts');
            if (!options) {
                log('options not found, can not advance slide');
                return false;
            }
            if (num < 0 || num >= options.elements.length) {
                log('invalid slide index: ' + num);
                return false;
            }
            options.nextSlide = num;
            if (cont.cycleTimeout) {
                clearTimeout(cont.cycleTimeout);
                cont.cycleTimeout = 0;
            }
            if (typeof arg2 == 'string')
                options.oneTimeFx = arg2;
            go(options.elements, options, 1, num >= options.currSlide);
            return false;
        }
        return options;

        function checkInstantResume(isPaused, arg2, cont) {
            if (!isPaused && arg2 === true) {
                var options = $(cont).data('cycle.opts');
                if (!options) {
                    log('options not found, can not resume');
                    return false;
                }
                if (cont.cycleTimeout) {
                    clearTimeout(cont.cycleTimeout);
                    cont.cycleTimeout = 0;
                }
                go(options.elements, options, 1, !options.backwards);
            }
        }
    }

    function removeFilter(el, opts) {
        if (!$.support.opacity && opts.cleartype && el.style.filter) {
            try {
                el.style.removeAttribute('filter');
            } catch (smother) {}
        }
    }

    function destroy(cont, opts) {
        if (opts.next)
            $(opts.next).unbind(opts.prevNextEvent);
        if (opts.prev)
            $(opts.prev).unbind(opts.prevNextEvent);
        if (opts.pager || opts.pagerAnchorBuilder)
            $.each(opts.pagerAnchors || [], function() {
                this.unbind().remove();
            });
        opts.pagerAnchors = null;
        $(cont).unbind('mouseenter.cycle mouseleave.cycle');
        if (opts.destroy)
            opts.destroy(opts);
    }

    function buildOptions($cont, $slides, els, options, o) {
        var startingSlideSpecified;
        var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
        var meta = $.isFunction($cont.data) ? $cont.data(opts.metaAttr) : null;
        if (meta)
            opts = $.extend(opts, meta);
        if (opts.autostop)
            opts.countdown = opts.autostopCount || els.length;
        var cont = $cont[0];
        $cont.data('cycle.opts', opts);
        opts.$cont = $cont;
        opts.stopCount = cont.cycleStop;
        opts.elements = els;
        opts.before = opts.before ? [opts.before] : [];
        opts.after = opts.after ? [opts.after] : [];
        if (!$.support.opacity && opts.cleartype)
            opts.after.push(function() {
                removeFilter(this, opts);
            });
        if (opts.continuous)
            opts.after.push(function() {
                go(els, opts, 0, !opts.backwards);
            });
        saveOriginalOpts(opts);
        if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
            clearTypeFix($slides);
        if ($cont.css('position') == 'static')
            $cont.css('position', 'relative');
        if (opts.width)
            $cont.width(opts.width);
        if (opts.height && opts.height != 'auto')
            $cont.height(opts.height);
        if (opts.startingSlide !== undefined) {
            opts.startingSlide = parseInt(opts.startingSlide, 10);
            if (opts.startingSlide >= els.length || opts.startSlide < 0)
                opts.startingSlide = 0;
            else
                startingSlideSpecified = true;
        } else if (opts.backwards)
            opts.startingSlide = els.length - 1;
        else
            opts.startingSlide = 0;
        if (opts.random) {
            opts.randomMap = [];
            for (var i = 0; i < els.length; i++)
                opts.randomMap.push(i);
            opts.randomMap.sort(function(a, b) {
                return Math.random() - 0.5;
            });
            if (startingSlideSpecified) {
                for (var cnt = 0; cnt < els.length; cnt++) {
                    if (opts.startingSlide == opts.randomMap[cnt]) {
                        opts.randomIndex = cnt;
                    }
                }
            } else {
                opts.randomIndex = 1;
                opts.startingSlide = opts.randomMap[1];
            }
        } else if (opts.startingSlide >= els.length)
            opts.startingSlide = 0;
        opts.currSlide = opts.startingSlide || 0;
        var first = opts.startingSlide;
        $slides.css({
            position: 'absolute',
            top: 0,
            left: 0
        }).hide().each(function(i) {
            var z;
            if (opts.backwards)
                z = first ? i <= first ? els.length + (i - first) : first - i : els.length - i;
            else
                z = first ? i >= first ? els.length - (i - first) : first - i : els.length - i;
            $(this).css('z-index', z);
        });
        $(els[first]).css('opacity', 1).show();
        removeFilter(els[first], opts);
        if (opts.fit) {
            if (!opts.aspect) {
                if (opts.width)
                    $slides.width(opts.width);
                if (opts.height && opts.height != 'auto')
                    $slides.height(opts.height);
            } else {
                $slides.each(function() {
                    var $slide = $(this);
                    var ratio = (opts.aspect === true) ? $slide.width() / $slide.height() : opts.aspect;
                    if (opts.width && $slide.width() != opts.width) {
                        $slide.width(opts.width);
                        $slide.height(opts.width / ratio);
                    }
                    if (opts.height && $slide.height() < opts.height) {
                        $slide.height(opts.height);
                        $slide.width(opts.height * ratio);
                    }
                });
            }
        }
        if (opts.center && ((!opts.fit) || opts.aspect)) {
            $slides.each(function() {
                var $slide = $(this);
                $slide.css({
                    "margin-left": opts.width ? ((opts.width - $slide.width()) / 2) + "px" : 0,
                    "margin-top": opts.height ? ((opts.height - $slide.height()) / 2) + "px" : 0
                });
            });
        }
        if (opts.center && !opts.fit && !opts.slideResize) {
            $slides.each(function() {
                var $slide = $(this);
                $slide.css({
                    "margin-left": opts.width ? ((opts.width - $slide.width()) / 2) + "px" : 0,
                    "margin-top": opts.height ? ((opts.height - $slide.height()) / 2) + "px" : 0
                });
            });
        }
        var reshape = (opts.containerResize || opts.containerResizeHeight) && $cont.innerHeight() < 1;
        if (reshape) {
            var maxw = 0,
                maxh = 0;
            for (var j = 0; j < els.length; j++) {
                var $e = $(els[j]),
                    e = $e[0],
                    w = $e.outerWidth(),
                    h = $e.outerHeight();
                if (!w) w = e.offsetWidth || e.width || $e.attr('width');
                if (!h) h = e.offsetHeight || e.height || $e.attr('height');
                maxw = w > maxw ? w : maxw;
                maxh = h > maxh ? h : maxh;
            }
            if (opts.containerResize && maxw > 0 && maxh > 0)
                $cont.css({
                    width: maxw + 'px',
                    height: maxh + 'px'
                });
            if (opts.containerResizeHeight && maxh > 0)
                $cont.css({
                    height: maxh + 'px'
                });
        }
        var pauseFlag = false;
        if (opts.pause)
            $cont.bind('mouseenter.cycle', function() {
                pauseFlag = true;
                this.cyclePause++;
                triggerPause(cont, true);
            }).bind('mouseleave.cycle', function() {
                if (pauseFlag)
                    this.cyclePause--;
                triggerPause(cont, true);
            });
        if (supportMultiTransitions(opts) === false)
            return false;
        var requeue = false;
        options.requeueAttempts = options.requeueAttempts || 0;
        $slides.each(function() {
            var $el = $(this);
            this.cycleH = (opts.fit && opts.height) ? opts.height : ($el.height() || this.offsetHeight || this.height || $el.attr('height') || 0);
            this.cycleW = (opts.fit && opts.width) ? opts.width : ($el.width() || this.offsetWidth || this.width || $el.attr('width') || 0);
            if ($el.is('img')) {
                var loading = (this.cycleH === 0 && this.cycleW === 0 && !this.complete);
                if (loading) {
                    if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) {
                        log(options.requeueAttempts, ' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
                        setTimeout(function() {
                            $(o.s, o.c).cycle(options);
                        }, opts.requeueTimeout);
                        requeue = true;
                        return false;
                    } else {
                        log('could not determine size of image: ' + this.src, this.cycleW, this.cycleH);
                    }
                }
            }
            return true;
        });
        if (requeue)
            return false;
        opts.cssBefore = opts.cssBefore || {};
        opts.cssAfter = opts.cssAfter || {};
        opts.cssFirst = opts.cssFirst || {};
        opts.animIn = opts.animIn || {};
        opts.animOut = opts.animOut || {};
        $slides.not(':eq(' + first + ')').css(opts.cssBefore);
        $($slides[first]).css(opts.cssFirst);
        if (opts.timeout) {
            opts.timeout = parseInt(opts.timeout, 10);
            if (opts.speed.constructor == String)
                opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed, 10);
            if (!opts.sync)
                opts.speed = opts.speed / 2;
            var buffer = opts.fx == 'none' ? 0 : opts.fx == 'shuffle' ? 500 : 250;
            while ((opts.timeout - opts.speed) < buffer)
                opts.timeout += opts.speed;
        }
        if (opts.easing)
            opts.easeIn = opts.easeOut = opts.easing;
        if (!opts.speedIn)
            opts.speedIn = opts.speed;
        if (!opts.speedOut)
            opts.speedOut = opts.speed;
        opts.slideCount = els.length;
        opts.currSlide = opts.lastSlide = first;
        if (opts.random) {
            if (++opts.randomIndex == els.length)
                opts.randomIndex = 0;
            opts.nextSlide = opts.randomMap[opts.randomIndex];
        } else if (opts.backwards)
            opts.nextSlide = opts.startingSlide === 0 ? (els.length - 1) : opts.startingSlide - 1;
        else
            opts.nextSlide = opts.startingSlide >= (els.length - 1) ? 0 : opts.startingSlide + 1;
        if (!opts.multiFx) {
            var init = $.fn.cycle.transitions[opts.fx];
            if ($.isFunction(init))
                init($cont, $slides, opts);
            else if (opts.fx != 'custom' && !opts.multiFx) {
                log('unknown transition: ' + opts.fx, '; slideshow terminating');
                return false;
            }
        }
        var e0 = $slides[first];
        if (!opts.skipInitializationCallbacks) {
            if (opts.before.length)
                opts.before[0].apply(e0, [e0, e0, opts, true]);
            if (opts.after.length)
                opts.after[0].apply(e0, [e0, e0, opts, true]);
        }
        if (opts.next)
            $(opts.next).bind(opts.prevNextEvent, function() {
                return advance(opts, 1);
            });
        if (opts.prev)
            $(opts.prev).bind(opts.prevNextEvent, function() {
                return advance(opts, 0);
            });
        if (opts.pager || opts.pagerAnchorBuilder)
            buildPager(els, opts);
        exposeAddSlide(opts, els);
        return opts;
    }

    function saveOriginalOpts(opts) {
        opts.original = {
            before: [],
            after: []
        };
        opts.original.cssBefore = $.extend({}, opts.cssBefore);
        opts.original.cssAfter = $.extend({}, opts.cssAfter);
        opts.original.animIn = $.extend({}, opts.animIn);
        opts.original.animOut = $.extend({}, opts.animOut);
        $.each(opts.before, function() {
            opts.original.before.push(this);
        });
        $.each(opts.after, function() {
            opts.original.after.push(this);
        });
    }

    function supportMultiTransitions(opts) {
        var i, tx, txs = $.fn.cycle.transitions;
        if (opts.fx.indexOf(',') > 0) {
            opts.multiFx = true;
            opts.fxs = opts.fx.replace(/\s*/g, '').split(',');
            for (i = 0; i < opts.fxs.length; i++) {
                var fx = opts.fxs[i];
                tx = txs[fx];
                if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
                    log('discarding unknown transition: ', fx);
                    opts.fxs.splice(i, 1);
                    i--;
                }
            }
            if (!opts.fxs.length) {
                log('No valid transitions named; slideshow terminating.');
                return false;
            }
        } else if (opts.fx == 'all') {
            opts.multiFx = true;
            opts.fxs = [];
            for (var p in txs) {
                if (txs.hasOwnProperty(p)) {
                    tx = txs[p];
                    if (txs.hasOwnProperty(p) && $.isFunction(tx))
                        opts.fxs.push(p);
                }
            }
        }
        if (opts.multiFx && opts.randomizeEffects) {
            var r1 = Math.floor(Math.random() * 20) + 30;
            for (i = 0; i < r1; i++) {
                var r2 = Math.floor(Math.random() * opts.fxs.length);
                opts.fxs.push(opts.fxs.splice(r2, 1)[0]);
            }
            debug('randomized fx sequence: ', opts.fxs);
        }
        return true;
    }

    function exposeAddSlide(opts, els) {
        opts.addSlide = function(newSlide, prepend) {
            var $s = $(newSlide),
                s = $s[0];
            if (!opts.autostopCount)
                opts.countdown++;
            els[prepend ? 'unshift' : 'push'](s);
            if (opts.els)
                opts.els[prepend ? 'unshift' : 'push'](s);
            opts.slideCount = els.length;
            if (opts.random) {
                opts.randomMap.push(opts.slideCount - 1);
                opts.randomMap.sort(function(a, b) {
                    return Math.random() - 0.5;
                });
            }
            $s.css('position', 'absolute');
            $s[prepend ? 'prependTo' : 'appendTo'](opts.$cont);
            if (prepend) {
                opts.currSlide++;
                opts.nextSlide++;
            }
            if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
                clearTypeFix($s);
            if (opts.fit && opts.width)
                $s.width(opts.width);
            if (opts.fit && opts.height && opts.height != 'auto')
                $s.height(opts.height);
            s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
            s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();
            $s.css(opts.cssBefore);
            if (opts.pager || opts.pagerAnchorBuilder)
                $.fn.cycle.createPagerAnchor(els.length - 1, s, $(opts.pager), els, opts);
            if ($.isFunction(opts.onAddSlide))
                opts.onAddSlide($s);
            else
                $s.hide();
        };
    }
    $.fn.cycle.resetState = function(opts, fx) {
        fx = fx || opts.fx;
        opts.before = [];
        opts.after = [];
        opts.cssBefore = $.extend({}, opts.original.cssBefore);
        opts.cssAfter = $.extend({}, opts.original.cssAfter);
        opts.animIn = $.extend({}, opts.original.animIn);
        opts.animOut = $.extend({}, opts.original.animOut);
        opts.fxFn = null;
        $.each(opts.original.before, function() {
            opts.before.push(this);
        });
        $.each(opts.original.after, function() {
            opts.after.push(this);
        });
        var init = $.fn.cycle.transitions[fx];
        if ($.isFunction(init))
            init(opts.$cont, $(opts.elements), opts);
    };

    function go(els, opts, manual, fwd) {
        var p = opts.$cont[0],
            curr = els[opts.currSlide],
            next = els[opts.nextSlide];
        if (manual && opts.busy && opts.manualTrump) {
            debug('manualTrump in go(), stopping active transition');
            $(els).stop(true, true);
            opts.busy = 0;
            clearTimeout(p.cycleTimeout);
        }
        if (opts.busy) {
            debug('transition active, ignoring new tx request');
            return;
        }
        if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
            return;
        if (!manual && !p.cyclePause && !opts.bounce && ((opts.autostop && (--opts.countdown <= 0)) || (opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
            if (opts.end)
                opts.end(opts);
            return;
        }
        var changed = false;
        if ((manual || !p.cyclePause) && (opts.nextSlide != opts.currSlide)) {
            changed = true;
            var fx = opts.fx;
            curr.cycleH = curr.cycleH || $(curr).height();
            curr.cycleW = curr.cycleW || $(curr).width();
            next.cycleH = next.cycleH || $(next).height();
            next.cycleW = next.cycleW || $(next).width();
            if (opts.multiFx) {
                if (fwd && (opts.lastFx === undefined || ++opts.lastFx >= opts.fxs.length))
                    opts.lastFx = 0;
                else if (!fwd && (opts.lastFx === undefined || --opts.lastFx < 0))
                    opts.lastFx = opts.fxs.length - 1;
                fx = opts.fxs[opts.lastFx];
            }
            if (opts.oneTimeFx) {
                fx = opts.oneTimeFx;
                opts.oneTimeFx = null;
            }
            $.fn.cycle.resetState(opts, fx);
            if (opts.before.length)
                $.each(opts.before, function(i, o) {
                    if (p.cycleStop != opts.stopCount) return;
                    o.apply(next, [curr, next, opts, fwd]);
                });
            var after = function() {
                opts.busy = 0;
                $.each(opts.after, function(i, o) {
                    if (p.cycleStop != opts.stopCount) return;
                    o.apply(next, [curr, next, opts, fwd]);
                });
                if (!p.cycleStop) {
                    queueNext();
                }
            };
            debug('tx firing(' + fx + '); currSlide: ' + opts.currSlide + '; nextSlide: ' + opts.nextSlide);
            opts.busy = 1;
            if (opts.fxFn)
                opts.fxFn(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
            else if ($.isFunction($.fn.cycle[opts.fx]))
                $.fn.cycle[opts.fx](curr, next, opts, after, fwd, manual && opts.fastOnEvent);
            else
                $.fn.cycle.custom(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
        } else {
            queueNext();
        }
        if (changed || opts.nextSlide == opts.currSlide) {
            var roll;
            opts.lastSlide = opts.currSlide;
            if (opts.random) {
                opts.currSlide = opts.nextSlide;
                if (++opts.randomIndex == els.length) {
                    opts.randomIndex = 0;
                    opts.randomMap.sort(function(a, b) {
                        return Math.random() - 0.5;
                    });
                }
                opts.nextSlide = opts.randomMap[opts.randomIndex];
                if (opts.nextSlide == opts.currSlide)
                    opts.nextSlide = (opts.currSlide == opts.slideCount - 1) ? 0 : opts.currSlide + 1;
            } else if (opts.backwards) {
                roll = (opts.nextSlide - 1) < 0;
                if (roll && opts.bounce) {
                    opts.backwards = !opts.backwards;
                    opts.nextSlide = 1;
                    opts.currSlide = 0;
                } else {
                    opts.nextSlide = roll ? (els.length - 1) : opts.nextSlide - 1;
                    opts.currSlide = roll ? 0 : opts.nextSlide + 1;
                }
            } else {
                roll = (opts.nextSlide + 1) == els.length;
                if (roll && opts.bounce) {
                    opts.backwards = !opts.backwards;
                    opts.nextSlide = els.length - 2;
                    opts.currSlide = els.length - 1;
                } else {
                    opts.nextSlide = roll ? 0 : opts.nextSlide + 1;
                    opts.currSlide = roll ? els.length - 1 : opts.nextSlide - 1;
                }
            }
        }
        if (changed && opts.pager)
            opts.updateActivePagerLink(opts.pager, opts.currSlide, opts.activePagerClass);

        function queueNext() {
            var ms = 0,
                timeout = opts.timeout;
            if (opts.timeout && !opts.continuous) {
                ms = getTimeout(els[opts.currSlide], els[opts.nextSlide], opts, fwd);
                if (opts.fx == 'shuffle')
                    ms -= opts.speedOut;
            } else if (opts.continuous && p.cyclePause)
                ms = 10;
            if (ms > 0)
                p.cycleTimeout = setTimeout(function() {
                    go(els, opts, 0, !opts.backwards);
                }, ms);
        }
    }
    $.fn.cycle.updateActivePagerLink = function(pager, currSlide, clsName) {
        $(pager).each(function() {
            $(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
        });
    };

    function getTimeout(curr, next, opts, fwd) {
        if (opts.timeoutFn) {
            var t = opts.timeoutFn.call(curr, curr, next, opts, fwd);
            while (opts.fx != 'none' && (t - opts.speed) < 250)
                t += opts.speed;
            debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
            if (t !== false)
                return t;
        }
        return opts.timeout;
    }
    $.fn.cycle.next = function(opts) {
        advance(opts, 1);
    };
    $.fn.cycle.prev = function(opts) {
        advance(opts, 0);
    };

    function advance(opts, moveForward) {
        var val = moveForward ? 1 : -1;
        var els = opts.elements;
        var p = opts.$cont[0],
            timeout = p.cycleTimeout;
        if (timeout) {
            clearTimeout(timeout);
            p.cycleTimeout = 0;
        }
        if (opts.random && val < 0) {
            opts.randomIndex--;
            if (--opts.randomIndex == -2)
                opts.randomIndex = els.length - 2;
            else if (opts.randomIndex == -1)
                opts.randomIndex = els.length - 1;
            opts.nextSlide = opts.randomMap[opts.randomIndex];
        } else if (opts.random) {
            opts.nextSlide = opts.randomMap[opts.randomIndex];
        } else {
            opts.nextSlide = opts.currSlide + val;
            if (opts.nextSlide < 0) {
                if (opts.nowrap) return false;
                opts.nextSlide = els.length - 1;
            } else if (opts.nextSlide >= els.length) {
                if (opts.nowrap) return false;
                opts.nextSlide = 0;
            }
        }
        var cb = opts.onPrevNextEvent || opts.prevNextClick;
        if ($.isFunction(cb))
            cb(val > 0, opts.nextSlide, els[opts.nextSlide]);
        go(els, opts, 1, moveForward);
        return false;
    }

    function buildPager(els, opts) {
        var $p = $(opts.pager);
        $.each(els, function(i, o) {
            $.fn.cycle.createPagerAnchor(i, o, $p, els, opts);
        });
        opts.updateActivePagerLink(opts.pager, opts.startingSlide, opts.activePagerClass);
    }
    $.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
        var a;
        if ($.isFunction(opts.pagerAnchorBuilder)) {
            a = opts.pagerAnchorBuilder(i, el);
            debug('pagerAnchorBuilder(' + i + ', el) returned: ' + a);
        } else
            a = '<a href="#">' + (i + 1) + '</a>';
        if (!a)
            return;
        var $a = $(a);
        if ($a.parents('body').length === 0) {
            var arr = [];
            if ($p.length > 1) {
                $p.each(function() {
                    var $clone = $a.clone(true);
                    $(this).append($clone);
                    arr.push($clone[0]);
                });
                $a = $(arr);
            } else {
                $a.appendTo($p);
            }
        }
        opts.pagerAnchors = opts.pagerAnchors || [];
        opts.pagerAnchors.push($a);
        var pagerFn = function(e) {
            e.preventDefault();
            opts.nextSlide = i;
            var p = opts.$cont[0],
                timeout = p.cycleTimeout;
            if (timeout) {
                clearTimeout(timeout);
                p.cycleTimeout = 0;
            }
            var cb = opts.onPagerEvent || opts.pagerClick;
            if ($.isFunction(cb))
                cb(opts.nextSlide, els[opts.nextSlide]);
            go(els, opts, 1, opts.currSlide < i);
        };
        if (/mouseenter|mouseover/i.test(opts.pagerEvent)) {
            $a.hover(pagerFn, function() {});
        } else {
            $a.bind(opts.pagerEvent, pagerFn);
        }
        if (!/^click/.test(opts.pagerEvent) && !opts.allowPagerClickBubble)
            $a.bind('click.cycle', function() {
                return false;
            });
        var cont = opts.$cont[0];
        var pauseFlag = false;
        if (opts.pauseOnPagerHover) {
            $a.hover(function() {
                pauseFlag = true;
                cont.cyclePause++;
                triggerPause(cont, true, true);
            }, function() {
                if (pauseFlag)
                    cont.cyclePause--;
                triggerPause(cont, true, true);
            });
        }
    };
    $.fn.cycle.hopsFromLast = function(opts, fwd) {
        var hops, l = opts.lastSlide,
            c = opts.currSlide;
        if (fwd)
            hops = c > l ? c - l : opts.slideCount - l;
        else
            hops = c < l ? l - c : l + opts.slideCount - c;
        return hops;
    };

    function clearTypeFix($slides) {
        debug('applying clearType background-color hack');

        function hex(s) {
            s = parseInt(s, 10).toString(16);
            return s.length < 2 ? '0' + s : s;
        }

        function getBg(e) {
            for (; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
                var v = $.css(e, 'background-color');
                if (v && v.indexOf('rgb') >= 0) {
                    var rgb = v.match(/\d+/g);
                    return '#' + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
                }
                if (v && v != 'transparent')
                    return v;
            }
            return '#ffffff';
        }
        $slides.each(function() {
            $(this).css('background-color', getBg(this));
        });
    }
    $.fn.cycle.commonReset = function(curr, next, opts, w, h, rev) {
        $(opts.elements).not(curr).hide();
        if (typeof opts.cssBefore.opacity == 'undefined')
            opts.cssBefore.opacity = 1;
        opts.cssBefore.display = 'block';
        if (opts.slideResize && w !== false && next.cycleW > 0)
            opts.cssBefore.width = next.cycleW;
        if (opts.slideResize && h !== false && next.cycleH > 0)
            opts.cssBefore.height = next.cycleH;
        opts.cssAfter = opts.cssAfter || {};
        opts.cssAfter.display = 'none';
        $(curr).css('zIndex', opts.slideCount + (rev === true ? 1 : 0));
        $(next).css('zIndex', opts.slideCount + (rev === true ? 0 : 1));
    };
    $.fn.cycle.custom = function(curr, next, opts, cb, fwd, speedOverride) {
        var $l = $(curr),
            $n = $(next);
        var speedIn = opts.speedIn,
            speedOut = opts.speedOut,
            easeIn = opts.easeIn,
            easeOut = opts.easeOut,
            animInDelay = opts.animInDelay,
            animOutDelay = opts.animOutDelay;
        $n.css(opts.cssBefore);
        if (speedOverride) {
            if (typeof speedOverride == 'number')
                speedIn = speedOut = speedOverride;
            else
                speedIn = speedOut = 1;
            easeIn = easeOut = null;
        }
        var fn = function() {
            $n.delay(animInDelay).animate(opts.animIn, speedIn, easeIn, function() {
                cb();
            });
        };
        $l.delay(animOutDelay).animate(opts.animOut, speedOut, easeOut, function() {
            $l.css(opts.cssAfter);
            if (!opts.sync)
                fn();
        });
        if (opts.sync) fn();
    };
    $.fn.cycle.transitions = {
        fade: function($cont, $slides, opts) {
            $slides.not(':eq(' + opts.currSlide + ')').css('opacity', 0);
            opts.before.push(function(curr, next, opts) {
                $.fn.cycle.commonReset(curr, next, opts);
                opts.cssBefore.opacity = 0;
            });
            opts.animIn = {
                opacity: 1
            };
            opts.animOut = {
                opacity: 0
            };
            opts.cssBefore = {
                top: 0,
                left: 0
            };
        }
    };
    $.fn.cycle.ver = function() {
        return ver;
    };
    $.fn.cycle.defaults = {
        activePagerClass: 'activeSlide',
        after: null,
        allowPagerClickBubble: false,
        animIn: null,
        animInDelay: 0,
        animOut: null,
        animOutDelay: 0,
        aspect: false,
        autostop: 0,
        autostopCount: 0,
        backwards: false,
        before: null,
        center: null,
        cleartype: !$.support.opacity,
        cleartypeNoBg: false,
        containerResize: 1,
        containerResizeHeight: 0,
        continuous: 0,
        cssAfter: null,
        cssBefore: null,
        delay: 0,
        easeIn: null,
        easeOut: null,
        easing: null,
        end: null,
        fastOnEvent: 0,
        fit: 0,
        fx: 'fade',
        fxFn: null,
        height: 'auto',
        manualTrump: true,
        metaAttr: 'cycle',
        next: null,
        nowrap: 0,
        onPagerEvent: null,
        onPrevNextEvent: null,
        pager: null,
        pagerAnchorBuilder: null,
        pagerEvent: 'click.cycle',
        pause: 0,
        pauseOnPagerHover: 0,
        prev: null,
        prevNextEvent: 'click.cycle',
        random: 0,
        randomizeEffects: 1,
        requeueOnImageNotLoaded: true,
        requeueTimeout: 250,
        rev: 0,
        shuffle: null,
        skipInitializationCallbacks: false,
        slideExpr: null,
        slideResize: 1,
        speed: 1000,
        speedIn: null,
        speedOut: null,
        startingSlide: undefined,
        sync: 1,
        timeout: 4000,
        timeoutFn: null,
        updateActivePagerLink: null,
        width: null
    };
})(jQuery);
(function($) {
    "use strict";
    $.fn.cycle.transitions.none = function($cont, $slides, opts) {
        opts.fxFn = function(curr, next, opts, after) {
            $(next).show();
            $(curr).hide();
            after();
        };
    };
    $.fn.cycle.transitions.fadeout = function($cont, $slides, opts) {
        $slides.not(':eq(' + opts.currSlide + ')').css({
            display: 'block',
            'opacity': 1
        });
        opts.before.push(function(curr, next, opts, w, h, rev) {
            $(curr).css('zIndex', opts.slideCount + (rev !== true ? 1 : 0));
            $(next).css('zIndex', opts.slideCount + (rev !== true ? 0 : 1));
        });
        opts.animIn.opacity = 1;
        opts.animOut.opacity = 0;
        opts.cssBefore.opacity = 1;
        opts.cssBefore.display = 'block';
        opts.cssAfter.zIndex = 0;
    };
    $.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
        $cont.css('overflow', 'hidden');
        opts.before.push($.fn.cycle.commonReset);
        var h = $cont.height();
        opts.cssBefore.top = h;
        opts.cssBefore.left = 0;
        opts.cssFirst.top = 0;
        opts.animIn.top = 0;
        opts.animOut.top = -h;
    };
    $.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
        $cont.css('overflow', 'hidden');
        opts.before.push($.fn.cycle.commonReset);
        var h = $cont.height();
        opts.cssFirst.top = 0;
        opts.cssBefore.top = -h;
        opts.cssBefore.left = 0;
        opts.animIn.top = 0;
        opts.animOut.top = h;
    };
    $.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
        $cont.css('overflow', 'hidden');
        opts.before.push($.fn.cycle.commonReset);
        var w = $cont.width();
        opts.cssFirst.left = 0;
        opts.cssBefore.left = w;
        opts.cssBefore.top = 0;
        opts.animIn.left = 0;
        opts.animOut.left = 0 - w;
    };
    $.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
        $cont.css('overflow', 'hidden');
        opts.before.push($.fn.cycle.commonReset);
        var w = $cont.width();
        opts.cssFirst.left = 0;
        opts.cssBefore.left = -w;
        opts.cssBefore.top = 0;
        opts.animIn.left = 0;
        opts.animOut.left = w;
    };
    $.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
        $cont.css('overflow', 'hidden').width();
        opts.before.push(function(curr, next, opts, fwd) {
            if (opts.rev)
                fwd = !fwd;
            $.fn.cycle.commonReset(curr, next, opts);
            opts.cssBefore.left = fwd ? (next.cycleW - 1) : (1 - next.cycleW);
            opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
        });
        opts.cssFirst.left = 0;
        opts.cssBefore.top = 0;
        opts.animIn.left = 0;
        opts.animOut.top = 0;
    };
    $.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
        $cont.css('overflow', 'hidden');
        opts.before.push(function(curr, next, opts, fwd) {
            if (opts.rev)
                fwd = !fwd;
            $.fn.cycle.commonReset(curr, next, opts);
            opts.cssBefore.top = fwd ? (1 - next.cycleH) : (next.cycleH - 1);
            opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
        });
        opts.cssFirst.top = 0;
        opts.cssBefore.left = 0;
        opts.animIn.top = 0;
        opts.animOut.left = 0;
    };
    $.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $(opts.elements).not(curr).hide();
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.animIn.width = next.cycleW;
        });
        opts.cssBefore.left = 0;
        opts.cssBefore.top = 0;
        opts.cssBefore.width = 0;
        opts.animIn.width = 'show';
        opts.animOut.width = 0;
    };
    $.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $(opts.elements).not(curr).hide();
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.animIn.height = next.cycleH;
        });
        opts.cssBefore.left = 0;
        opts.cssBefore.top = 0;
        opts.cssBefore.height = 0;
        opts.animIn.height = 'show';
        opts.animOut.height = 0;
    };
    $.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
        var i, w = $cont.css('overflow', 'visible').width();
        $slides.css({
            left: 0,
            top: 0
        });
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
        });
        if (!opts.speedAdjusted) {
            opts.speed = opts.speed / 2;
            opts.speedAdjusted = true;
        }
        opts.random = 0;
        opts.shuffle = opts.shuffle || {
            left: -w,
            top: 15
        };
        opts.els = [];
        for (i = 0; i < $slides.length; i++)
            opts.els.push($slides[i]);
        for (i = 0; i < opts.currSlide; i++)
            opts.els.push(opts.els.shift());
        opts.fxFn = function(curr, next, opts, cb, fwd) {
            if (opts.rev)
                fwd = !fwd;
            var $el = fwd ? $(curr) : $(next);
            $(next).css(opts.cssBefore);
            var count = opts.slideCount;
            $el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
                var hops = $.fn.cycle.hopsFromLast(opts, fwd);
                for (var k = 0; k < hops; k++) {
                    if (fwd)
                        opts.els.push(opts.els.shift());
                    else
                        opts.els.unshift(opts.els.pop());
                }
                if (fwd) {
                    for (var i = 0, len = opts.els.length; i < len; i++)
                        $(opts.els[i]).css('z-index', len - i + count);
                } else {
                    var z = $(curr).css('z-index');
                    $el.css('z-index', parseInt(z, 10) + 1 + count);
                }
                $el.animate({
                    left: 0,
                    top: 0
                }, opts.speedOut, opts.easeOut, function() {
                    $(fwd ? this : curr).hide();
                    if (cb) cb();
                });
            });
        };
        $.extend(opts.cssBefore, {
            display: 'block',
            opacity: 1,
            top: 0,
            left: 0
        });
    };
    $.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.cssBefore.top = next.cycleH;
            opts.animIn.height = next.cycleH;
            opts.animOut.width = next.cycleW;
        });
        opts.cssFirst.top = 0;
        opts.cssBefore.left = 0;
        opts.cssBefore.height = 0;
        opts.animIn.top = 0;
        opts.animOut.height = 0;
    };
    $.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssFirst.top = 0;
        opts.cssBefore.left = 0;
        opts.cssBefore.top = 0;
        opts.cssBefore.height = 0;
        opts.animOut.height = 0;
    };
    $.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.cssBefore.left = next.cycleW;
            opts.animIn.width = next.cycleW;
        });
        opts.cssBefore.top = 0;
        opts.cssBefore.width = 0;
        opts.animIn.left = 0;
        opts.animOut.width = 0;
    };
    $.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.animIn.width = next.cycleW;
            opts.animOut.left = curr.cycleW;
        });
        $.extend(opts.cssBefore, {
            top: 0,
            left: 0,
            width: 0
        });
        opts.animIn.left = 0;
        opts.animOut.width = 0;
    };
    $.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, false, true);
            opts.cssBefore.top = next.cycleH / 2;
            opts.cssBefore.left = next.cycleW / 2;
            $.extend(opts.animIn, {
                top: 0,
                left: 0,
                width: next.cycleW,
                height: next.cycleH
            });
            $.extend(opts.animOut, {
                width: 0,
                height: 0,
                top: curr.cycleH / 2,
                left: curr.cycleW / 2
            });
        });
        opts.cssFirst.top = 0;
        opts.cssFirst.left = 0;
        opts.cssBefore.width = 0;
        opts.cssBefore.height = 0;
    };
    $.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, false);
            opts.cssBefore.left = next.cycleW / 2;
            opts.cssBefore.top = next.cycleH / 2;
            $.extend(opts.animIn, {
                top: 0,
                left: 0,
                width: next.cycleW,
                height: next.cycleH
            });
        });
        opts.cssBefore.width = 0;
        opts.cssBefore.height = 0;
        opts.animOut.opacity = 0;
    };
    $.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
        var w = $cont.css('overflow', 'hidden').width();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.width = next.cycleW;
            opts.animOut.left = curr.cycleW;
        });
        opts.cssBefore.left = w;
        opts.cssBefore.top = 0;
        opts.animIn.left = 0;
        opts.animOut.left = w;
    };
    $.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
        var h = $cont.css('overflow', 'hidden').height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssBefore.top = h;
        opts.cssBefore.left = 0;
        opts.animIn.top = 0;
        opts.animOut.top = h;
    };
    $.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
        var h = $cont.css('overflow', 'hidden').height();
        var w = $cont.width();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssBefore.top = h;
        opts.cssBefore.left = w;
        opts.animIn.top = 0;
        opts.animIn.left = 0;
        opts.animOut.top = h;
        opts.animOut.left = w;
    };
    $.fn.cycle.transitions.growX = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.cssBefore.left = this.cycleW / 2;
            opts.animIn.left = 0;
            opts.animIn.width = this.cycleW;
            opts.animOut.left = 0;
        });
        opts.cssBefore.top = 0;
        opts.cssBefore.width = 0;
    };
    $.fn.cycle.transitions.growY = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.cssBefore.top = this.cycleH / 2;
            opts.animIn.top = 0;
            opts.animIn.height = this.cycleH;
            opts.animOut.top = 0;
        });
        opts.cssBefore.height = 0;
        opts.cssBefore.left = 0;
    };
    $.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true, true);
            opts.cssBefore.left = next.cycleW / 2;
            opts.animIn.left = 0;
            opts.animIn.width = this.cycleW;
            opts.animOut.left = curr.cycleW / 2;
            opts.animOut.width = 0;
        });
        opts.cssBefore.top = 0;
        opts.cssBefore.width = 0;
    };
    $.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false, true);
            opts.cssBefore.top = next.cycleH / 2;
            opts.animIn.top = 0;
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH / 2;
            opts.animOut.height = 0;
        });
        opts.cssBefore.height = 0;
        opts.cssBefore.left = 0;
    };
    $.fn.cycle.transitions.cover = function($cont, $slides, opts) {
        var d = opts.direction || 'left';
        var w = $cont.css('overflow', 'hidden').width();
        var h = $cont.height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.cssAfter.display = '';
            if (d == 'right')
                opts.cssBefore.left = -w;
            else if (d == 'up')
                opts.cssBefore.top = h;
            else if (d == 'down')
                opts.cssBefore.top = -h;
            else
                opts.cssBefore.left = w;
        });
        opts.animIn.left = 0;
        opts.animIn.top = 0;
        opts.cssBefore.top = 0;
        opts.cssBefore.left = 0;
    };
    $.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
        var d = opts.direction || 'left';
        var w = $cont.css('overflow', 'hidden').width();
        var h = $cont.height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
            if (d == 'right')
                opts.animOut.left = w;
            else if (d == 'up')
                opts.animOut.top = -h;
            else if (d == 'down')
                opts.animOut.top = h;
            else
                opts.animOut.left = -w;
        });
        opts.animIn.left = 0;
        opts.animIn.top = 0;
        opts.cssBefore.top = 0;
        opts.cssBefore.left = 0;
    };
    $.fn.cycle.transitions.toss = function($cont, $slides, opts) {
        var w = $cont.css('overflow', 'visible').width();
        var h = $cont.height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
            if (!opts.animOut.left && !opts.animOut.top)
                $.extend(opts.animOut, {
                    left: w * 2,
                    top: -h / 2,
                    opacity: 0
                });
            else
                opts.animOut.opacity = 0;
        });
        opts.cssBefore.left = 0;
        opts.cssBefore.top = 0;
        opts.animIn.left = 0;
    };
    $.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
        var w = $cont.css('overflow', 'hidden').width();
        var h = $cont.height();
        opts.cssBefore = opts.cssBefore || {};
        var clip;
        if (opts.clip) {
            if (/l2r/.test(opts.clip))
                clip = 'rect(0px 0px ' + h + 'px 0px)';
            else if (/r2l/.test(opts.clip))
                clip = 'rect(0px ' + w + 'px ' + h + 'px ' + w + 'px)';
            else if (/t2b/.test(opts.clip))
                clip = 'rect(0px ' + w + 'px 0px 0px)';
            else if (/b2t/.test(opts.clip))
                clip = 'rect(' + h + 'px ' + w + 'px ' + h + 'px 0px)';
            else if (/zoom/.test(opts.clip)) {
                var top = parseInt(h / 2, 10);
                var left = parseInt(w / 2, 10);
                clip = 'rect(' + top + 'px ' + left + 'px ' + top + 'px ' + left + 'px)';
            }
        }
        opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';
        var d = opts.cssBefore.clip.match(/(\d+)/g);
        var t = parseInt(d[0], 10),
            r = parseInt(d[1], 10),
            b = parseInt(d[2], 10),
            l = parseInt(d[3], 10);
        opts.before.push(function(curr, next, opts) {
            if (curr == next) return;
            var $curr = $(curr),
                $next = $(next);
            $.fn.cycle.commonReset(curr, next, opts, true, true, false);
            opts.cssAfter.display = 'block';
            var step = 1,
                count = parseInt((opts.speedIn / 13), 10) - 1;
            (function f() {
                var tt = t ? t - parseInt(step * (t / count), 10) : 0;
                var ll = l ? l - parseInt(step * (l / count), 10) : 0;
                var bb = b < h ? b + parseInt(step * ((h - b) / count || 1), 10) : h;
                var rr = r < w ? r + parseInt(step * ((w - r) / count || 1), 10) : w;
                $next.css({
                    clip: 'rect(' + tt + 'px ' + rr + 'px ' + bb + 'px ' + ll + 'px)'
                });
                (step++ <= count) ? setTimeout(f, 13): $curr.css('display', 'none');
            })();
        });
        $.extend(opts.cssBefore, {
            display: 'block',
            opacity: 1,
            top: 0,
            left: 0
        });
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: 0
        };
    };
})(jQuery);
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
! function(a) {
    function b() {}

    function c(a) {
        function c(b) {
            b.prototype.option || (b.prototype.option = function(b) {
                a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
            })
        }

        function e(b, c) {
            a.fn[b] = function(e) {
                if ("string" == typeof e) {
                    for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                        var j = this[h],
                            k = a.data(j, b);
                        if (k)
                            if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                var l = k[e].apply(k, g);
                                if (void 0 !== l) return l
                            } else f("no such method '" + e + "' for " + b + " instance");
                        else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var d = a.data(this, b);
                    d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
                })
            }
        }
        if (a) {
            var f = "undefined" == typeof console ? b : function(a) {
                console.error(a)
            };
            return a.bridget = function(a, b) {
                c(b), e(a, b)
            }, a.bridget
        }
    }
    var d = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery)
}(window),
function(a) {
    function b(b) {
        var c = a.event;
        return c.target = c.target || c.srcElement || b, c
    }
    var c = document.documentElement,
        d = function() {};
    c.addEventListener ? d = function(a, b, c) {
        a.addEventListener(b, c, !1)
    } : c.attachEvent && (d = function(a, c, d) {
        a[c + d] = d.handleEvent ? function() {
            var c = b(a);
            d.handleEvent.call(d, c)
        } : function() {
            var c = b(a);
            d.call(a, c)
        }, a.attachEvent("on" + c, a[c + d])
    });
    var e = function() {};
    c.removeEventListener ? e = function(a, b, c) {
        a.removeEventListener(b, c, !1)
    } : c.detachEvent && (e = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c]
        } catch (d) {
            a[b + c] = void 0
        }
    });
    var f = {
        bind: d,
        unbind: e
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f
}(this),
function(a) {
    function b(a) {
        "function" == typeof a && (b.isReady ? a() : g.push(a))
    }

    function c(a) {
        var c = "readystatechange" === a.type && "complete" !== f.readyState;
        b.isReady || c || d()
    }

    function d() {
        b.isReady = !0;
        for (var a = 0, c = g.length; c > a; a++) {
            var d = g[a];
            d()
        }
    }

    function e(e) {
        return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)), b
    }
    var f = a.document,
        g = [];
    b.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie)
}(window),
function() {
    function a() {}

    function b(a, b) {
        for (var c = a.length; c--;)
            if (a[c].listener === b) return c;
        return -1
    }

    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
        e = this,
        f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if (a instanceof RegExp) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else b = d[a] || (d[a] = []);
        return b
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a),
            f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener,
            g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp)
            for (d = c.length; d--;) f.call(this, b, c[d]);
        else
            for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    }, d.removeEvent = function(a) {
        var b, c = typeof a,
            d = this._getEvents();
        if ("string" === c) delete d[a];
        else if (a instanceof RegExp)
            for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else delete this._events;
        return this
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g)
            if (g.hasOwnProperty(e))
                for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this
    }, d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, d._getEvents = function() {
        return this._events || (this._events = {})
    }, a.noConflict = function() {
        return e.EventEmitter = f, a
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a : e.EventEmitter = a
}.call(this),
    function(a) {
        function b(a) {
            if (a) {
                if ("string" == typeof d[a]) return a;
                a = a.charAt(0).toUpperCase() + a.slice(1);
                for (var b, e = 0, f = c.length; f > e; e++)
                    if (b = c[e] + a, "string" == typeof d[b]) return b
            }
        }
        var c = "Webkit Moz ms Ms O".split(" "),
            d = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return b
        }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b
    }(window),
    function(a) {
        function b(a) {
            var b = parseFloat(a),
                c = -1 === a.indexOf("%") && !isNaN(b);
            return c && b
        }

        function c() {}

        function d() {
            for (var a = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, b = 0, c = g.length; c > b; b++) {
                var d = g[b];
                a[d] = 0
            }
            return a
        }

        function e(c) {
            function e() {
                if (!m) {
                    m = !0;
                    var d = a.getComputedStyle;
                    if (j = function() {
                            var a = d ? function(a) {
                                return d(a, null)
                            } : function(a) {
                                return a.currentStyle
                            };
                            return function(b) {
                                var c = a(b);
                                return c || f("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), c
                            }
                        }(), k = c("boxSizing")) {
                        var e = document.createElement("div");
                        e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[k] = "border-box";
                        var g = document.body || document.documentElement;
                        g.appendChild(e);
                        var h = j(e);
                        l = 200 === b(h.width), g.removeChild(e)
                    }
                }
            }

            function h(a) {
                if (e(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                    var c = j(a);
                    if ("none" === c.display) return d();
                    var f = {};
                    f.width = a.offsetWidth, f.height = a.offsetHeight;
                    for (var h = f.isBorderBox = !(!k || !c[k] || "border-box" !== c[k]), m = 0, n = g.length; n > m; m++) {
                        var o = g[m],
                            p = c[o];
                        p = i(a, p);
                        var q = parseFloat(p);
                        f[o] = isNaN(q) ? 0 : q
                    }
                    var r = f.paddingLeft + f.paddingRight,
                        s = f.paddingTop + f.paddingBottom,
                        t = f.marginLeft + f.marginRight,
                        u = f.marginTop + f.marginBottom,
                        v = f.borderLeftWidth + f.borderRightWidth,
                        w = f.borderTopWidth + f.borderBottomWidth,
                        x = h && l,
                        y = b(c.width);
                    y !== !1 && (f.width = y + (x ? 0 : r + v));
                    var z = b(c.height);
                    return z !== !1 && (f.height = z + (x ? 0 : s + w)), f.innerWidth = f.width - (r + v), f.innerHeight = f.height - (s + w), f.outerWidth = f.width + t, f.outerHeight = f.height + u, f
                }
            }

            function i(b, c) {
                if (a.getComputedStyle || -1 === c.indexOf("%")) return c;
                var d = b.style,
                    e = d.left,
                    f = b.runtimeStyle,
                    g = f && f.left;
                return g && (f.left = b.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, g && (f.left = g), c
            }
            var j, k, l, m = !1;
            return h
        }
        var f = "undefined" == typeof console ? c : function(a) {
                console.error(a)
            },
            g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], e) : "object" == typeof exports ? module.exports = e(require("desandro-get-style-property")) : a.getSize = e(a.getStyleProperty)
    }(window),
    function(a) {
        function b(a, b) {
            return a[g](b)
        }

        function c(a) {
            if (!a.parentNode) {
                var b = document.createDocumentFragment();
                b.appendChild(a)
            }
        }

        function d(a, b) {
            c(a);
            for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++)
                if (d[e] === a) return !0;
            return !1
        }

        function e(a, d) {
            return c(a), b(a, d)
        }
        var f, g = function() {
            if (a.matchesSelector) return "matchesSelector";
            for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) {
                var e = b[c],
                    f = e + "MatchesSelector";
                if (a[f]) return f
            }
        }();
        if (g) {
            var h = document.createElement("div"),
                i = b(h, "div");
            f = i ? b : e
        } else f = d;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return f
        }) : "object" == typeof exports ? module.exports = f : window.matchesSelector = f
    }(Element.prototype),
    function(a) {
        function b(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }

        function c(a) {
            for (var b in a) return !1;
            return b = null, !0
        }

        function d(a) {
            return a.replace(/([A-Z])/g, function(a) {
                return "-" + a.toLowerCase()
            })
        }

        function e(a, e, f) {
            function h(a, b) {
                a && (this.element = a, this.layout = b, this.position = {
                    x: 0,
                    y: 0
                }, this._create())
            }
            var i = f("transition"),
                j = f("transform"),
                k = i && j,
                l = !!f("perspective"),
                m = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend"
                }[i],
                n = ["transform", "transition", "transitionDuration", "transitionProperty"],
                o = function() {
                    for (var a = {}, b = 0, c = n.length; c > b; b++) {
                        var d = n[b],
                            e = f(d);
                        e && e !== d && (a[d] = e)
                    }
                    return a
                }();
            b(h.prototype, a.prototype), h.prototype._create = function() {
                this._transn = {
                    ingProperties: {},
                    clean: {},
                    onEnd: {}
                }, this.css({
                    position: "absolute"
                })
            }, h.prototype.handleEvent = function(a) {
                var b = "on" + a.type;
                this[b] && this[b](a)
            }, h.prototype.getSize = function() {
                this.size = e(this.element)
            }, h.prototype.css = function(a) {
                var b = this.element.style;
                for (var c in a) {
                    var d = o[c] || c;
                    b[d] = a[c]
                }
            }, h.prototype.getPosition = function() {
                var a = g(this.element),
                    b = this.layout.options,
                    c = b.isOriginLeft,
                    d = b.isOriginTop,
                    e = parseInt(a[c ? "left" : "right"], 10),
                    f = parseInt(a[d ? "top" : "bottom"], 10);
                e = isNaN(e) ? 0 : e, f = isNaN(f) ? 0 : f;
                var h = this.layout.size;
                e -= c ? h.paddingLeft : h.paddingRight, f -= d ? h.paddingTop : h.paddingBottom, this.position.x = e, this.position.y = f
            }, h.prototype.layoutPosition = function() {
                var a = this.layout.size,
                    b = this.layout.options,
                    c = {};
                b.isOriginLeft ? (c.left = this.position.x + a.paddingLeft + "px", c.right = "") : (c.right = this.position.x + a.paddingRight + "px", c.left = ""), b.isOriginTop ? (c.top = this.position.y + a.paddingTop + "px", c.bottom = "") : (c.bottom = this.position.y + a.paddingBottom + "px", c.top = ""), this.css(c), this.emitEvent("layout", [this])
            };
            var p = l ? function(a, b) {
                return "translate3d(" + a + "px, " + b + "px, 0)"
            } : function(a, b) {
                return "translate(" + a + "px, " + b + "px)"
            };
            h.prototype._transitionTo = function(a, b) {
                this.getPosition();
                var c = this.position.x,
                    d = this.position.y,
                    e = parseInt(a, 10),
                    f = parseInt(b, 10),
                    g = e === this.position.x && f === this.position.y;
                if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
                var h = a - c,
                    i = b - d,
                    j = {},
                    k = this.layout.options;
                h = k.isOriginLeft ? h : -h, i = k.isOriginTop ? i : -i, j.transform = p(h, i), this.transition({
                    to: j,
                    onTransitionEnd: {
                        transform: this.layoutPosition
                    },
                    isCleaning: !0
                })
            }, h.prototype.goTo = function(a, b) {
                this.setPosition(a, b), this.layoutPosition()
            }, h.prototype.moveTo = k ? h.prototype._transitionTo : h.prototype.goTo, h.prototype.setPosition = function(a, b) {
                this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10)
            }, h.prototype._nonTransition = function(a) {
                this.css(a.to), a.isCleaning && this._removeStyles(a.to);
                for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this)
            }, h.prototype._transition = function(a) {
                if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
                var b = this._transn;
                for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
                for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0);
                if (a.from) {
                    this.css(a.from);
                    var d = this.element.offsetHeight;
                    d = null
                }
                this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0
            };
            var q = j && d(j) + ",opacity";
            h.prototype.enableTransition = function() {
                this.isTransitioning || (this.css({
                    transitionProperty: q,
                    transitionDuration: this.layout.options.transitionDuration
                }), this.element.addEventListener(m, this, !1))
            }, h.prototype.transition = h.prototype[i ? "_transition" : "_nonTransition"], h.prototype.onwebkitTransitionEnd = function(a) {
                this.ontransitionend(a)
            }, h.prototype.onotransitionend = function(a) {
                this.ontransitionend(a)
            };
            var r = {
                "-webkit-transform": "transform",
                "-moz-transform": "transform",
                "-o-transform": "transform"
            };
            h.prototype.ontransitionend = function(a) {
                if (a.target === this.element) {
                    var b = this._transn,
                        d = r[a.propertyName] || a.propertyName;
                    if (delete b.ingProperties[d], c(b.ingProperties) && this.disableTransition(), d in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[d]), d in b.onEnd) {
                        var e = b.onEnd[d];
                        e.call(this), delete b.onEnd[d]
                    }
                    this.emitEvent("transitionEnd", [this])
                }
            }, h.prototype.disableTransition = function() {
                this.removeTransitionStyles(), this.element.removeEventListener(m, this, !1), this.isTransitioning = !1
            }, h.prototype._removeStyles = function(a) {
                var b = {};
                for (var c in a) b[c] = "";
                this.css(b)
            };
            var s = {
                transitionProperty: "",
                transitionDuration: ""
            };
            return h.prototype.removeTransitionStyles = function() {
                this.css(s)
            }, h.prototype.removeElem = function() {
                this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
            }, h.prototype.remove = function() {
                if (!i || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
                var a = this;
                this.on("transitionEnd", function() {
                    return a.removeElem(), !0
                }), this.hide()
            }, h.prototype.reveal = function() {
                delete this.isHidden, this.css({
                    display: ""
                });
                var a = this.layout.options;
                this.transition({
                    from: a.hiddenStyle,
                    to: a.visibleStyle,
                    isCleaning: !0
                })
            }, h.prototype.hide = function() {
                this.isHidden = !0, this.css({
                    display: ""
                });
                var a = this.layout.options;
                this.transition({
                    from: a.visibleStyle,
                    to: a.hiddenStyle,
                    isCleaning: !0,
                    onTransitionEnd: {
                        opacity: function() {
                            this.isHidden && this.css({
                                display: "none"
                            })
                        }
                    }
                })
            }, h.prototype.destroy = function() {
                this.css({
                    position: "",
                    left: "",
                    right: "",
                    top: "",
                    bottom: "",
                    transition: "",
                    transform: ""
                })
            }, h
        }
        var f = a.getComputedStyle,
            g = f ? function(a) {
                return f(a, null)
            } : function(a) {
                return a.currentStyle
            };
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], e) : "object" == typeof exports ? module.exports = e(require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property")) : (a.Outlayer = {}, a.Outlayer.Item = e(a.EventEmitter, a.getSize, a.getStyleProperty))
    }(window),
    function(a) {
        function b(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }

        function c(a) {
            return "[object Array]" === l.call(a)
        }

        function d(a) {
            var b = [];
            if (c(a)) b = a;
            else if (a && "number" == typeof a.length)
                for (var d = 0, e = a.length; e > d; d++) b.push(a[d]);
            else b.push(a);
            return b
        }

        function e(a, b) {
            var c = n(b, a); - 1 !== c && b.splice(c, 1)
        }

        function f(a) {
            return a.replace(/(.)([A-Z])/g, function(a, b, c) {
                return b + "-" + c
            }).toLowerCase()
        }

        function g(c, g, l, n, o, p) {
            function q(a, c) {
                if ("string" == typeof a && (a = h.querySelector(a)), !a || !m(a)) return void(i && i.error("Bad " + this.constructor.namespace + " element: " + a));
                this.element = a, this.options = b({}, this.constructor.defaults), this.option(c);
                var d = ++r;
                this.element.outlayerGUID = d, s[d] = this, this._create(), this.options.isInitLayout && this.layout()
            }
            var r = 0,
                s = {};
            return q.namespace = "outlayer", q.Item = p, q.defaults = {
                containerStyle: {
                    position: "relative"
                },
                isInitLayout: !0,
                isOriginLeft: !0,
                isOriginTop: !0,
                isResizeBound: !0,
                isResizingContainer: !0,
                transitionDuration: "0.4s",
                hiddenStyle: {
                    opacity: 0,
                    transform: "scale(0.001)"
                },
                visibleStyle: {
                    opacity: 1,
                    transform: "scale(1)"
                }
            }, b(q.prototype, l.prototype), q.prototype.option = function(a) {
                b(this.options, a)
            }, q.prototype._create = function() {
                this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), b(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
            }, q.prototype.reloadItems = function() {
                this.items = this._itemize(this.element.children)
            }, q.prototype._itemize = function(a) {
                for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
                    var g = b[e],
                        h = new c(g, this);
                    d.push(h)
                }
                return d
            }, q.prototype._filterFindItemElements = function(a) {
                a = d(a);
                for (var b = this.options.itemSelector, c = [], e = 0, f = a.length; f > e; e++) {
                    var g = a[e];
                    if (m(g))
                        if (b) {
                            o(g, b) && c.push(g);
                            for (var h = g.querySelectorAll(b), i = 0, j = h.length; j > i; i++) c.push(h[i])
                        } else c.push(g)
                }
                return c
            }, q.prototype.getItemElements = function() {
                for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
                return a
            }, q.prototype.layout = function() {
                this._resetLayout(), this._manageStamps();
                var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                this.layoutItems(this.items, a), this._isLayoutInited = !0
            }, q.prototype._init = q.prototype.layout, q.prototype._resetLayout = function() {
                this.getSize()
            }, q.prototype.getSize = function() {
                this.size = n(this.element)
            }, q.prototype._getMeasurement = function(a, b) {
                var c, d = this.options[a];
                d ? ("string" == typeof d ? c = this.element.querySelector(d) : m(d) && (c = d), this[a] = c ? n(c)[b] : d) : this[a] = 0
            }, q.prototype.layoutItems = function(a, b) {
                a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout()
            }, q.prototype._getItemsForLayout = function(a) {
                for (var b = [], c = 0, d = a.length; d > c; c++) {
                    var e = a[c];
                    e.isIgnored || b.push(e)
                }
                return b
            }, q.prototype._layoutItems = function(a, b) {
                function c() {
                    d.emitEvent("layoutComplete", [d, a])
                }
                var d = this;
                if (!a || !a.length) return void c();
                this._itemsOn(a, "layout", c);
                for (var e = [], f = 0, g = a.length; g > f; f++) {
                    var h = a[f],
                        i = this._getItemLayoutPosition(h);
                    i.item = h, i.isInstant = b || h.isLayoutInstant, e.push(i)
                }
                this._processLayoutQueue(e)
            }, q.prototype._getItemLayoutPosition = function() {
                return {
                    x: 0,
                    y: 0
                }
            }, q.prototype._processLayoutQueue = function(a) {
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    this._positionItem(d.item, d.x, d.y, d.isInstant)
                }
            }, q.prototype._positionItem = function(a, b, c, d) {
                d ? a.goTo(b, c) : a.moveTo(b, c)
            }, q.prototype._postLayout = function() {
                this.resizeContainer()
            }, q.prototype.resizeContainer = function() {
                if (this.options.isResizingContainer) {
                    var a = this._getContainerSize();
                    a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
                }
            }, q.prototype._getContainerSize = k, q.prototype._setContainerMeasure = function(a, b) {
                if (void 0 !== a) {
                    var c = this.size;
                    c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px"
                }
            }, q.prototype._itemsOn = function(a, b, c) {
                function d() {
                    return e++, e === f && c.call(g), !0
                }
                for (var e = 0, f = a.length, g = this, h = 0, i = a.length; i > h; h++) {
                    var j = a[h];
                    j.on(b, d)
                }
            }, q.prototype.ignore = function(a) {
                var b = this.getItem(a);
                b && (b.isIgnored = !0)
            }, q.prototype.unignore = function(a) {
                var b = this.getItem(a);
                b && delete b.isIgnored
            }, q.prototype.stamp = function(a) {
                if (a = this._find(a)) {
                    this.stamps = this.stamps.concat(a);
                    for (var b = 0, c = a.length; c > b; b++) {
                        var d = a[b];
                        this.ignore(d)
                    }
                }
            }, q.prototype.unstamp = function(a) {
                if (a = this._find(a))
                    for (var b = 0, c = a.length; c > b; b++) {
                        var d = a[b];
                        e(d, this.stamps), this.unignore(d)
                    }
            }, q.prototype._find = function(a) {
                return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = d(a)) : void 0
            }, q.prototype._manageStamps = function() {
                if (this.stamps && this.stamps.length) {
                    this._getBoundingRect();
                    for (var a = 0, b = this.stamps.length; b > a; a++) {
                        var c = this.stamps[a];
                        this._manageStamp(c)
                    }
                }
            }, q.prototype._getBoundingRect = function() {
                var a = this.element.getBoundingClientRect(),
                    b = this.size;
                this._boundingRect = {
                    left: a.left + b.paddingLeft + b.borderLeftWidth,
                    top: a.top + b.paddingTop + b.borderTopWidth,
                    right: a.right - (b.paddingRight + b.borderRightWidth),
                    bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
                }
            }, q.prototype._manageStamp = k, q.prototype._getElementOffset = function(a) {
                var b = a.getBoundingClientRect(),
                    c = this._boundingRect,
                    d = n(a),
                    e = {
                        left: b.left - c.left - d.marginLeft,
                        top: b.top - c.top - d.marginTop,
                        right: c.right - b.right - d.marginRight,
                        bottom: c.bottom - b.bottom - d.marginBottom
                    };
                return e
            }, q.prototype.handleEvent = function(a) {
                var b = "on" + a.type;
                this[b] && this[b](a)
            }, q.prototype.bindResize = function() {
                this.isResizeBound || (c.bind(a, "resize", this), this.isResizeBound = !0)
            }, q.prototype.unbindResize = function() {
                this.isResizeBound && c.unbind(a, "resize", this), this.isResizeBound = !1
            }, q.prototype.onresize = function() {
                function a() {
                    b.resize(), delete b.resizeTimeout
                }
                this.resizeTimeout && clearTimeout(this.resizeTimeout);
                var b = this;
                this.resizeTimeout = setTimeout(a, 100)
            }, q.prototype.resize = function() {
                this.isResizeBound && this.needsResizeLayout() && this.layout()
            }, q.prototype.needsResizeLayout = function() {
                var a = n(this.element),
                    b = this.size && a;
                return b && a.innerWidth !== this.size.innerWidth
            }, q.prototype.addItems = function(a) {
                var b = this._itemize(a);
                return b.length && (this.items = this.items.concat(b)), b
            }, q.prototype.appended = function(a) {
                var b = this.addItems(a);
                b.length && (this.layoutItems(b, !0), this.reveal(b))
            }, q.prototype.prepended = function(a) {
                var b = this._itemize(a);
                if (b.length) {
                    var c = this.items.slice(0);
                    this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c)
                }
            }, q.prototype.reveal = function(a) {
                var b = a && a.length;
                if (b)
                    for (var c = 0; b > c; c++) {
                        var d = a[c];
                        d.reveal()
                    }
            }, q.prototype.hide = function(a) {
                var b = a && a.length;
                if (b)
                    for (var c = 0; b > c; c++) {
                        var d = a[c];
                        d.hide()
                    }
            }, q.prototype.getItem = function(a) {
                for (var b = 0, c = this.items.length; c > b; b++) {
                    var d = this.items[b];
                    if (d.element === a) return d
                }
            }, q.prototype.getItems = function(a) {
                if (a && a.length) {
                    for (var b = [], c = 0, d = a.length; d > c; c++) {
                        var e = a[c],
                            f = this.getItem(e);
                        f && b.push(f)
                    }
                    return b
                }
            }, q.prototype.remove = function(a) {
                a = d(a);
                var b = this.getItems(a);
                if (b && b.length) {
                    this._itemsOn(b, "remove", function() {
                        this.emitEvent("removeComplete", [this, b])
                    });
                    for (var c = 0, f = b.length; f > c; c++) {
                        var g = b[c];
                        g.remove(), e(g, this.items)
                    }
                }
            }, q.prototype.destroy = function() {
                var a = this.element.style;
                a.height = "", a.position = "", a.width = "";
                for (var b = 0, c = this.items.length; c > b; b++) {
                    var d = this.items[b];
                    d.destroy()
                }
                this.unbindResize();
                var e = this.element.outlayerGUID;
                delete s[e], delete this.element.outlayerGUID, j && j.removeData(this.element, this.constructor.namespace)
            }, q.data = function(a) {
                var b = a && a.outlayerGUID;
                return b && s[b]
            }, q.create = function(a, c) {
                function d() {
                    q.apply(this, arguments)
                }
                return Object.create ? d.prototype = Object.create(q.prototype) : b(d.prototype, q.prototype), d.prototype.constructor = d, d.defaults = b({}, q.defaults), b(d.defaults, c), d.prototype.settings = {}, d.namespace = a, d.data = q.data, d.Item = function() {
                    p.apply(this, arguments)
                }, d.Item.prototype = new p, g(function() {
                    for (var b = f(a), c = h.querySelectorAll(".js-" + b), e = "data-" + b + "-options", g = 0, k = c.length; k > g; g++) {
                        var l, m = c[g],
                            n = m.getAttribute(e);
                        try {
                            l = n && JSON.parse(n)
                        } catch (o) {
                            i && i.error("Error parsing " + e + " on " + m.nodeName.toLowerCase() + (m.id ? "#" + m.id : "") + ": " + o);
                            continue
                        }
                        var p = new d(m, l);
                        j && j.data(m, a, p)
                    }
                }), j && j.bridget && j.bridget(a, d), d
            }, q.Item = p, q
        }
        var h = a.document,
            i = a.console,
            j = a.jQuery,
            k = function() {},
            l = Object.prototype.toString,
            m = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(a) {
                return a instanceof HTMLElement
            } : function(a) {
                return a && "object" == typeof a && 1 === a.nodeType && "string" == typeof a.nodeName
            },
            n = Array.prototype.indexOf ? function(a, b) {
                return a.indexOf(b)
            } : function(a, b) {
                for (var c = 0, d = a.length; d > c; c++)
                    if (a[c] === b) return c;
                return -1
            };
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], g) : "object" == typeof exports ? module.exports = g(require("eventie"), require("doc-ready"), require("wolfy87-eventemitter"), require("get-size"), require("desandro-matches-selector"), require("./item")) : a.Outlayer = g(a.eventie, a.docReady, a.EventEmitter, a.getSize, a.matchesSelector, a.Outlayer.Item)
    }(window),
    function(a) {
        function b(a, b) {
            var d = a.create("masonry");
            return d.prototype._resetLayout = function() {
                this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
                var a = this.cols;
                for (this.colYs = []; a--;) this.colYs.push(0);
                this.maxY = 0
            }, d.prototype.measureColumns = function() {
                if (this.getContainerWidth(), !this.columnWidth) {
                    var a = this.items[0],
                        c = a && a.element;
                    this.columnWidth = c && b(c).outerWidth || this.containerWidth
                }
                this.columnWidth += this.gutter, this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
            }, d.prototype.getContainerWidth = function() {
                var a = this.options.isFitWidth ? this.element.parentNode : this.element,
                    c = b(a);
                this.containerWidth = c && c.innerWidth
            }, d.prototype._getItemLayoutPosition = function(a) {
                a.getSize();
                var b = a.size.outerWidth % this.columnWidth,
                    d = b && 1 > b ? "round" : "ceil",
                    e = Math[d](a.size.outerWidth / this.columnWidth);
                e = Math.min(e, this.cols);
                for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c(f, g), i = {
                        x: this.columnWidth * h,
                        y: g
                    }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j;
                return i
            }, d.prototype._getColGroup = function(a) {
                if (2 > a) return this.colYs;
                for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
                    var e = this.colYs.slice(d, d + a);
                    b[d] = Math.max.apply(Math, e)
                }
                return b
            }, d.prototype._manageStamp = function(a) {
                var c = b(a),
                    d = this._getElementOffset(a),
                    e = this.options.isOriginLeft ? d.left : d.right,
                    f = e + c.outerWidth,
                    g = Math.floor(e / this.columnWidth);
                g = Math.max(0, g);
                var h = Math.floor(f / this.columnWidth);
                h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
                for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j])
            }, d.prototype._getContainerSize = function() {
                this.maxY = Math.max.apply(Math, this.colYs);
                var a = {
                    height: this.maxY
                };
                return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a
            }, d.prototype._getContainerFitWidth = function() {
                for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) a++;
                return (this.cols - a) * this.columnWidth - this.gutter
            }, d.prototype.needsResizeLayout = function() {
                var a = this.containerWidth;
                return this.getContainerWidth(), a !== this.containerWidth
            }, d
        }
        var c = Array.prototype.indexOf ? function(a, b) {
            return a.indexOf(b)
        } : function(a, b) {
            for (var c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                if (e === b) return c
            }
            return -1
        };
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size")) : a.Masonry = b(a.Outlayer, a.getSize)
    }(window);
(function(factory) {
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    "use strict";
    var LEFT = "left",
        RIGHT = "right",
        UP = "up",
        DOWN = "down",
        IN = "in",
        OUT = "out",
        NONE = "none",
        AUTO = "auto",
        SWIPE = "swipe",
        PINCH = "pinch",
        TAP = "tap",
        DOUBLE_TAP = "doubletap",
        LONG_TAP = "longtap",
        HOLD = "hold",
        HORIZONTAL = "horizontal",
        VERTICAL = "vertical",
        ALL_FINGERS = "all",
        DOUBLE_TAP_THRESHOLD = 10,
        PHASE_START = "start",
        PHASE_MOVE = "move",
        PHASE_END = "end",
        PHASE_CANCEL = "cancel",
        SUPPORTS_TOUCH = 'ontouchstart' in window,
        SUPPORTS_POINTER_IE10 = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled,
        SUPPORTS_POINTER = window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
        PLUGIN_NS = 'TouchSwipe';
    var defaults = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: "label, button, input, select, textarea, a, .noSwipe"
    };
    $.fn.swipe = function(method) {
        var $this = $(this),
            plugin = $this.data(PLUGIN_NS);
        if (plugin && typeof method === 'string') {
            if (plugin[method]) {
                return plugin[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.swipe');
            }
        } else if (!plugin && (typeof method === 'object' || !method)) {
            return init.apply(this, arguments);
        }
        return $this;
    };
    $.fn.swipe.defaults = defaults;
    $.fn.swipe.phases = {
        PHASE_START: PHASE_START,
        PHASE_MOVE: PHASE_MOVE,
        PHASE_END: PHASE_END,
        PHASE_CANCEL: PHASE_CANCEL
    };
    $.fn.swipe.directions = {
        LEFT: LEFT,
        RIGHT: RIGHT,
        UP: UP,
        DOWN: DOWN,
        IN: IN,
        OUT: OUT
    };
    $.fn.swipe.pageScroll = {
        NONE: NONE,
        HORIZONTAL: HORIZONTAL,
        VERTICAL: VERTICAL,
        AUTO: AUTO
    };
    $.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        ALL: ALL_FINGERS
    };

    function init(options) {
        if (options && (options.allowPageScroll === undefined && (options.swipe !== undefined || options.swipeStatus !== undefined))) {
            options.allowPageScroll = NONE;
        }
        if (options.click !== undefined && options.tap === undefined) {
            options.tap = options.click;
        }
        if (!options) {
            options = {};
        }
        options = $.extend({}, $.fn.swipe.defaults, options);
        return this.each(function() {
            var $this = $(this);
            var plugin = $this.data(PLUGIN_NS);
            if (!plugin) {
                plugin = new TouchSwipe(this, options);
                $this.data(PLUGIN_NS, plugin);
            }
        });
    }

    function TouchSwipe(element, options) {
        var useTouchEvents = (SUPPORTS_TOUCH || SUPPORTS_POINTER || !options.fallbackToMouseEvents),
            START_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerDown' : 'pointerdown') : 'touchstart') : 'mousedown',
            MOVE_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerMove' : 'pointermove') : 'touchmove') : 'mousemove',
            END_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerUp' : 'pointerup') : 'touchend') : 'mouseup',
            LEAVE_EV = useTouchEvents ? null : 'mouseleave',
            CANCEL_EV = (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerCancel' : 'pointercancel') : 'touchcancel');
        var distance = 0,
            direction = null,
            duration = 0,
            startTouchesDistance = 0,
            endTouchesDistance = 0,
            pinchZoom = 1,
            pinchDistance = 0,
            pinchDirection = 0,
            maximumsMap = null;
        var $element = $(element);
        var phase = "start";
        var fingerCount = 0;
        var fingerData = null;
        var startTime = 0,
            endTime = 0,
            previousTouchEndTime = 0,
            previousTouchFingerCount = 0,
            doubleTapStartTime = 0;
        var singleTapTimeout = null,
            holdTimeout = null;
        try {
            $element.bind(START_EV, touchStart);
            $element.bind(CANCEL_EV, touchCancel);
        } catch (e) {
            $.error('events not supported ' + START_EV + ',' + CANCEL_EV + ' on jQuery.swipe');
        }
        this.enable = function() {
            $element.bind(START_EV, touchStart);
            $element.bind(CANCEL_EV, touchCancel);
            return $element;
        };
        this.disable = function() {
            removeListeners();
            return $element;
        };
        this.destroy = function() {
            removeListeners();
            $element.data(PLUGIN_NS, null);
            return $element;
        };
        this.option = function(property, value) {
            if (options[property] !== undefined) {
                if (value === undefined) {
                    return options[property];
                } else {
                    options[property] = value;
                }
            } else {
                $.error('Option ' + property + ' does not exist on jQuery.swipe.options');
            }
            return null;
        }

        function touchStart(jqEvent) {
            if (getTouchInProgress())
                return;
            if ($(jqEvent.target).closest(options.excludedElements, $element).length > 0)
                return;
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            var ret, evt = SUPPORTS_TOUCH ? event.touches[0] : event;
            phase = PHASE_START;
            if (SUPPORTS_TOUCH) {
                fingerCount = event.touches.length;
            } else {
                jqEvent.preventDefault();
            }
            distance = 0;
            direction = null;
            pinchDirection = null;
            duration = 0;
            startTouchesDistance = 0;
            endTouchesDistance = 0;
            pinchZoom = 1;
            pinchDistance = 0;
            fingerData = createAllFingerData();
            maximumsMap = createMaximumsData();
            cancelMultiFingerRelease();
            if (!SUPPORTS_TOUCH || (fingerCount === options.fingers || options.fingers === ALL_FINGERS) || hasPinches()) {
                createFingerData(0, evt);
                startTime = getTimeStamp();
                if (fingerCount == 2) {
                    createFingerData(1, event.touches[1]);
                    startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
                }
                if (options.swipeStatus || options.pinchStatus) {
                    ret = triggerHandler(event, phase);
                }
            } else {
                ret = false;
            }
            if (ret === false) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
                return ret;
            } else {
                if (options.hold) {
                    holdTimeout = setTimeout($.proxy(function() {
                        $element.trigger('hold', [event.target]);
                        if (options.hold) {
                            ret = options.hold.call($element, event, event.target);
                        }
                    }, this), options.longTapThreshold);
                }
                setTouchInProgress(true);
            }
            return null;
        };

        function touchMove(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            if (phase === PHASE_END || phase === PHASE_CANCEL || inMultiFingerRelease())
                return;
            var ret, evt = SUPPORTS_TOUCH ? event.touches[0] : event;
            var currentFinger = updateFingerData(evt);
            endTime = getTimeStamp();
            if (SUPPORTS_TOUCH) {
                fingerCount = event.touches.length;
            }
            if (options.hold)
                clearTimeout(holdTimeout);
            phase = PHASE_MOVE;
            if (fingerCount == 2) {
                if (startTouchesDistance == 0) {
                    createFingerData(1, event.touches[1]);
                    startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
                } else {
                    updateFingerData(event.touches[1]);
                    endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end);
                    pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end);
                }
                pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance);
                pinchDistance = Math.abs(startTouchesDistance - endTouchesDistance);
            }
            if ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !SUPPORTS_TOUCH || hasPinches()) {
                direction = calculateDirection(currentFinger.start, currentFinger.end);
                validateDefaultEvent(jqEvent, direction);
                distance = calculateDistance(currentFinger.start, currentFinger.end);
                duration = calculateDuration();
                setMaxDistance(direction, distance);
                if (options.swipeStatus || options.pinchStatus) {
                    ret = triggerHandler(event, phase);
                }
                if (!options.triggerOnTouchEnd || options.triggerOnTouchLeave) {
                    var inBounds = true;
                    if (options.triggerOnTouchLeave) {
                        var bounds = getbounds(this);
                        inBounds = isInBounds(currentFinger.end, bounds);
                    }
                    if (!options.triggerOnTouchEnd && inBounds) {
                        phase = getNextPhase(PHASE_MOVE);
                    } else if (options.triggerOnTouchLeave && !inBounds) {
                        phase = getNextPhase(PHASE_END);
                    }
                    if (phase == PHASE_CANCEL || phase == PHASE_END) {
                        triggerHandler(event, phase);
                    }
                }
            } else {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            }
            if (ret === false) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            }
        }

        function touchEnd(jqEvent) {
            var event = jqEvent.originalEvent;
            if (SUPPORTS_TOUCH) {
                if (event.touches.length > 0) {
                    startMultiFingerRelease();
                    return true;
                }
            }
            if (inMultiFingerRelease()) {
                fingerCount = previousTouchFingerCount;
            }
            endTime = getTimeStamp();
            duration = calculateDuration();
            if (didSwipeBackToCancel() || !validateSwipeDistance()) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            } else if (options.triggerOnTouchEnd || (options.triggerOnTouchEnd == false && phase === PHASE_MOVE)) {
                jqEvent.preventDefault();
                phase = PHASE_END;
                triggerHandler(event, phase);
            } else if (!options.triggerOnTouchEnd && hasTap()) {
                phase = PHASE_END;
                triggerHandlerForGesture(event, phase, TAP);
            } else if (phase === PHASE_MOVE) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            }
            setTouchInProgress(false);
            return null;
        }

        function touchCancel() {
            fingerCount = 0;
            endTime = 0;
            startTime = 0;
            startTouchesDistance = 0;
            endTouchesDistance = 0;
            pinchZoom = 1;
            cancelMultiFingerRelease();
            setTouchInProgress(false);
        }

        function touchLeave(jqEvent) {
            var event = jqEvent.originalEvent;
            if (options.triggerOnTouchLeave) {
                phase = getNextPhase(PHASE_END);
                triggerHandler(event, phase);
            }
        }

        function removeListeners() {
            $element.unbind(START_EV, touchStart);
            $element.unbind(CANCEL_EV, touchCancel);
            $element.unbind(MOVE_EV, touchMove);
            $element.unbind(END_EV, touchEnd);
            if (LEAVE_EV) {
                $element.unbind(LEAVE_EV, touchLeave);
            }
            setTouchInProgress(false);
        }

        function getNextPhase(currentPhase) {
            var nextPhase = currentPhase;
            var validTime = validateSwipeTime();
            var validDistance = validateSwipeDistance();
            var didCancel = didSwipeBackToCancel();
            if (!validTime || didCancel) {
                nextPhase = PHASE_CANCEL;
            } else if (validDistance && currentPhase == PHASE_MOVE && (!options.triggerOnTouchEnd || options.triggerOnTouchLeave)) {
                nextPhase = PHASE_END;
            } else if (!validDistance && currentPhase == PHASE_END && options.triggerOnTouchLeave) {
                nextPhase = PHASE_CANCEL;
            }
            return nextPhase;
        }

        function triggerHandler(event, phase) {
            var ret = undefined;
            if (didSwipe() || hasSwipes()) {
                ret = triggerHandlerForGesture(event, phase, SWIPE);
            } else if ((didPinch() || hasPinches()) && ret !== false) {
                ret = triggerHandlerForGesture(event, phase, PINCH);
            }
            if (didDoubleTap() && ret !== false) {
                ret = triggerHandlerForGesture(event, phase, DOUBLE_TAP);
            } else if (didLongTap() && ret !== false) {
                ret = triggerHandlerForGesture(event, phase, LONG_TAP);
            } else if (didTap() && ret !== false) {
                ret = triggerHandlerForGesture(event, phase, TAP);
            }
            if (phase === PHASE_CANCEL) {
                touchCancel(event);
            }
            if (phase === PHASE_END) {
                if (SUPPORTS_TOUCH) {
                    if (event.touches.length == 0) {
                        touchCancel(event);
                    }
                } else {
                    touchCancel(event);
                }
            }
            return ret;
        }

        function triggerHandlerForGesture(event, phase, gesture) {
            var ret = undefined;
            if (gesture == SWIPE) {
                $element.trigger('swipeStatus', [phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData]);
                if (options.swipeStatus) {
                    ret = options.swipeStatus.call($element, event, phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData);
                    if (ret === false) return false;
                }
                if (phase == PHASE_END && validateSwipe()) {
                    $element.trigger('swipe', [direction, distance, duration, fingerCount, fingerData]);
                    if (options.swipe) {
                        ret = options.swipe.call($element, event, direction, distance, duration, fingerCount, fingerData);
                        if (ret === false) return false;
                    }
                    switch (direction) {
                        case LEFT:
                            $element.trigger('swipeLeft', [direction, distance, duration, fingerCount, fingerData]);
                            if (options.swipeLeft) {
                                ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount, fingerData);
                            }
                            break;
                        case RIGHT:
                            $element.trigger('swipeRight', [direction, distance, duration, fingerCount, fingerData]);
                            if (options.swipeRight) {
                                ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount, fingerData);
                            }
                            break;
                        case UP:
                            $element.trigger('swipeUp', [direction, distance, duration, fingerCount, fingerData]);
                            if (options.swipeUp) {
                                ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount, fingerData);
                            }
                            break;
                        case DOWN:
                            $element.trigger('swipeDown', [direction, distance, duration, fingerCount, fingerData]);
                            if (options.swipeDown) {
                                ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount, fingerData);
                            }
                            break;
                    }
                }
            }
            if (gesture == PINCH) {
                $element.trigger('pinchStatus', [phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);
                if (options.pinchStatus) {
                    ret = options.pinchStatus.call($element, event, phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData);
                    if (ret === false) return false;
                }
                if (phase == PHASE_END && validatePinch()) {
                    switch (pinchDirection) {
                        case IN:
                            $element.trigger('pinchIn', [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);
                            if (options.pinchIn) {
                                ret = options.pinchIn.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData);
                            }
                            break;
                        case OUT:
                            $element.trigger('pinchOut', [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);
                            if (options.pinchOut) {
                                ret = options.pinchOut.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData);
                            }
                            break;
                    }
                }
            }
            if (gesture == TAP) {
                if (phase === PHASE_CANCEL || phase === PHASE_END) {
                    clearTimeout(singleTapTimeout);
                    clearTimeout(holdTimeout);
                    if (hasDoubleTap() && !inDoubleTap()) {
                        doubleTapStartTime = getTimeStamp();
                        singleTapTimeout = setTimeout($.proxy(function() {
                            doubleTapStartTime = null;
                            $element.trigger('tap', [event.target]);
                            if (options.tap) {
                                ret = options.tap.call($element, event, event.target);
                            }
                        }, this), options.doubleTapThreshold);
                    } else {
                        doubleTapStartTime = null;
                        $element.trigger('tap', [event.target]);
                        if (options.tap) {
                            ret = options.tap.call($element, event, event.target);
                        }
                    }
                }
            } else if (gesture == DOUBLE_TAP) {
                if (phase === PHASE_CANCEL || phase === PHASE_END) {
                    clearTimeout(singleTapTimeout);
                    doubleTapStartTime = null;
                    $element.trigger('doubletap', [event.target]);
                    if (options.doubleTap) {
                        ret = options.doubleTap.call($element, event, event.target);
                    }
                }
            } else if (gesture == LONG_TAP) {
                if (phase === PHASE_CANCEL || phase === PHASE_END) {
                    clearTimeout(singleTapTimeout);
                    doubleTapStartTime = null;
                    $element.trigger('longtap', [event.target]);
                    if (options.longTap) {
                        ret = options.longTap.call($element, event, event.target);
                    }
                }
            }
            return ret;
        }

        function validateSwipeDistance() {
            var valid = true;
            if (options.threshold !== null) {
                valid = distance >= options.threshold;
            }
            return valid;
        }

        function didSwipeBackToCancel() {
            var cancelled = false;
            if (options.cancelThreshold !== null && direction !== null) {
                cancelled = (getMaxDistance(direction) - distance) >= options.cancelThreshold;
            }
            return cancelled;
        }

        function validatePinchDistance() {
            if (options.pinchThreshold !== null) {
                return pinchDistance >= options.pinchThreshold;
            }
            return true;
        }

        function validateSwipeTime() {
            var result;
            if (options.maxTimeThreshold) {
                if (duration >= options.maxTimeThreshold) {
                    result = false;
                } else {
                    result = true;
                }
            } else {
                result = true;
            }
            return result;
        }

        function validateDefaultEvent(jqEvent, direction) {
            if (options.allowPageScroll === NONE || hasPinches()) {
                jqEvent.preventDefault();
            } else {
                var auto = options.allowPageScroll === AUTO;
                switch (direction) {
                    case LEFT:
                        if ((options.swipeLeft && auto) || (!auto && options.allowPageScroll != HORIZONTAL)) {
                            jqEvent.preventDefault();
                        }
                        break;
                    case RIGHT:
                        if ((options.swipeRight && auto) || (!auto && options.allowPageScroll != HORIZONTAL)) {
                            jqEvent.preventDefault();
                        }
                        break;
                    case UP:
                        if ((options.swipeUp && auto) || (!auto && options.allowPageScroll != VERTICAL)) {
                            jqEvent.preventDefault();
                        }
                        break;
                    case DOWN:
                        if ((options.swipeDown && auto) || (!auto && options.allowPageScroll != VERTICAL)) {
                            jqEvent.preventDefault();
                        }
                        break;
                }
            }
        }

        function validatePinch() {
            var hasCorrectFingerCount = validateFingers();
            var hasEndPoint = validateEndPoint();
            var hasCorrectDistance = validatePinchDistance();
            return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance;
        }

        function hasPinches() {
            return !!(options.pinchStatus || options.pinchIn || options.pinchOut);
        }

        function didPinch() {
            return !!(validatePinch() && hasPinches());
        }

        function validateSwipe() {
            var hasValidTime = validateSwipeTime();
            var hasValidDistance = validateSwipeDistance();
            var hasCorrectFingerCount = validateFingers();
            var hasEndPoint = validateEndPoint();
            var didCancel = didSwipeBackToCancel();
            var valid = !didCancel && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime;
            return valid;
        }

        function hasSwipes() {
            return !!(options.swipe || options.swipeStatus || options.swipeLeft || options.swipeRight || options.swipeUp || options.swipeDown);
        }

        function didSwipe() {
            return !!(validateSwipe() && hasSwipes());
        }

        function validateFingers() {
            return ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !SUPPORTS_TOUCH);
        }

        function validateEndPoint() {
            return fingerData[0].end.x !== 0;
        }

        function hasTap() {
            return !!(options.tap);
        }

        function hasDoubleTap() {
            return !!(options.doubleTap);
        }

        function hasLongTap() {
            return !!(options.longTap);
        }

        function validateDoubleTap() {
            if (doubleTapStartTime == null) {
                return false;
            }
            var now = getTimeStamp();
            return (hasDoubleTap() && ((now - doubleTapStartTime) <= options.doubleTapThreshold));
        }

        function inDoubleTap() {
            return validateDoubleTap();
        }

        function validateTap() {
            return ((fingerCount === 1 || !SUPPORTS_TOUCH) && (isNaN(distance) || distance < options.threshold));
        }

        function validateLongTap() {
            return ((duration > options.longTapThreshold) && (distance < DOUBLE_TAP_THRESHOLD));
        }

        function didTap() {
            return !!(validateTap() && hasTap());
        }

        function didDoubleTap() {
            return !!(validateDoubleTap() && hasDoubleTap());
        }

        function didLongTap() {
            return !!(validateLongTap() && hasLongTap());
        }

        function startMultiFingerRelease() {
            previousTouchEndTime = getTimeStamp();
            previousTouchFingerCount = event.touches.length + 1;
        }

        function cancelMultiFingerRelease() {
            previousTouchEndTime = 0;
            previousTouchFingerCount = 0;
        }

        function inMultiFingerRelease() {
            var withinThreshold = false;
            if (previousTouchEndTime) {
                var diff = getTimeStamp() - previousTouchEndTime
                if (diff <= options.fingerReleaseThreshold) {
                    withinThreshold = true;
                }
            }
            return withinThreshold;
        }

        function getTouchInProgress() {
            return !!($element.data(PLUGIN_NS + '_intouch') === true);
        }

        function setTouchInProgress(val) {
            if (val === true) {
                $element.bind(MOVE_EV, touchMove);
                $element.bind(END_EV, touchEnd);
                if (LEAVE_EV) {
                    $element.bind(LEAVE_EV, touchLeave);
                }
            } else {
                $element.unbind(MOVE_EV, touchMove, false);
                $element.unbind(END_EV, touchEnd, false);
                if (LEAVE_EV) {
                    $element.unbind(LEAVE_EV, touchLeave, false);
                }
            }
            $element.data(PLUGIN_NS + '_intouch', val === true);
        }

        function createFingerData(index, evt) {
            var id = evt.identifier !== undefined ? evt.identifier : 0;
            fingerData[index].identifier = id;
            fingerData[index].start.x = fingerData[index].end.x = evt.pageX || evt.clientX;
            fingerData[index].start.y = fingerData[index].end.y = evt.pageY || evt.clientY;
            return fingerData[index];
        }

        function updateFingerData(evt) {
            var id = evt.identifier !== undefined ? evt.identifier : 0;
            var f = getFingerData(id);
            f.end.x = evt.pageX || evt.clientX;
            f.end.y = evt.pageY || evt.clientY;
            return f;
        }

        function getFingerData(id) {
            for (var i = 0; i < fingerData.length; i++) {
                if (fingerData[i].identifier == id) {
                    return fingerData[i];
                }
            }
        }

        function createAllFingerData() {
            var fingerData = [];
            for (var i = 0; i <= 5; i++) {
                fingerData.push({
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    },
                    identifier: 0
                });
            }
            return fingerData;
        }

        function setMaxDistance(direction, distance) {
            distance = Math.max(distance, getMaxDistance(direction));
            maximumsMap[direction].distance = distance;
        }

        function getMaxDistance(direction) {
            if (maximumsMap[direction]) return maximumsMap[direction].distance;
            return undefined;
        }

        function createMaximumsData() {
            var maxData = {};
            maxData[LEFT] = createMaximumVO(LEFT);
            maxData[RIGHT] = createMaximumVO(RIGHT);
            maxData[UP] = createMaximumVO(UP);
            maxData[DOWN] = createMaximumVO(DOWN);
            return maxData;
        }

        function createMaximumVO(dir) {
            return {
                direction: dir,
                distance: 0
            }
        }

        function calculateDuration() {
            return endTime - startTime;
        }

        function calculateTouchesDistance(startPoint, endPoint) {
            var diffX = Math.abs(startPoint.x - endPoint.x);
            var diffY = Math.abs(startPoint.y - endPoint.y);
            return Math.round(Math.sqrt(diffX * diffX + diffY * diffY));
        }

        function calculatePinchZoom(startDistance, endDistance) {
            var percent = (endDistance / startDistance) * 1;
            return percent.toFixed(2);
        }

        function calculatePinchDirection() {
            if (pinchZoom < 1) {
                return OUT;
            } else {
                return IN;
            }
        }

        function calculateDistance(startPoint, endPoint) {
            return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)));
        }

        function calculateAngle(startPoint, endPoint) {
            var x = startPoint.x - endPoint.x;
            var y = endPoint.y - startPoint.y;
            var r = Math.atan2(y, x);
            var angle = Math.round(r * 180 / Math.PI);
            if (angle < 0) {
                angle = 360 - Math.abs(angle);
            }
            return angle;
        }

        function calculateDirection(startPoint, endPoint) {
            var angle = calculateAngle(startPoint, endPoint);
            if ((angle <= 45) && (angle >= 0)) {
                return LEFT;
            } else if ((angle <= 360) && (angle >= 315)) {
                return LEFT;
            } else if ((angle >= 135) && (angle <= 225)) {
                return RIGHT;
            } else if ((angle > 45) && (angle < 135)) {
                return DOWN;
            } else {
                return UP;
            }
        }

        function getTimeStamp() {
            var now = new Date();
            return now.getTime();
        }

        function getbounds(el) {
            el = $(el);
            var offset = el.offset();
            var bounds = {
                left: offset.left,
                right: offset.left + el.outerWidth(),
                top: offset.top,
                bottom: offset.top + el.outerHeight()
            }
            return bounds;
        }

        function isInBounds(point, bounds) {
            return (point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom);
        };
    }
}));
(function() {
    "use strict";

    function e() {}

    function t(e, t) {
        for (var n = e.length; n--;)
            if (e[n].listener === t) return n;
        return -1
    }

    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else t = i[e] || (i[e] = []);
        return t
    }, i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
        return n
    }, i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e),
            o = "object" == typeof n;
        for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : {
            listener: n,
            once: !1
        });
        return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
        return this.getListeners(e), this
    }, i.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
        return this
    }, i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener : this.addListener,
            s = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--;) o.call(this, t, n[i]);
        else
            for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    }, i.removeEvent = function(e) {
        var t, n = typeof e,
            i = this._getEvents();
        if ("string" === n) delete i[e];
        else if ("object" === n)
            for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--;) n = s[r][i], n.once === !0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
        return this._events || (this._events = {})
    }, "function" == typeof define && define.amd ? define(function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}).call(this),
    function(e) {
        "use strict";
        var t = document.documentElement,
            n = function() {};
        t.addEventListener ? n = function(e, t, n) {
            e.addEventListener(t, n, !1)
        } : t.attachEvent && (n = function(t, n, i) {
            t[n + i] = i.handleEvent ? function() {
                var t = e.event;
                t.target = t.target || t.srcElement, i.handleEvent.call(i, t)
            } : function() {
                var n = e.event;
                n.target = n.target || n.srcElement, i.call(t, n)
            }, t.attachEvent("on" + n, t[n + i])
        });
        var i = function() {};
        t.removeEventListener ? i = function(e, t, n) {
            e.removeEventListener(t, n, !1)
        } : t.detachEvent && (i = function(e, t, n) {
            e.detachEvent("on" + t, e[t + n]);
            try {
                delete e[t + n]
            } catch (i) {
                e[t + n] = void 0
            }
        });
        var r = {
            bind: n,
            unbind: i
        };
        "function" == typeof define && define.amd ? define(r) : e.eventie = r
    }(this),
    function(e) {
        "use strict";

        function t(e, t) {
            for (var n in t) e[n] = t[n];
            return e
        }

        function n(e) {
            return "[object Array]" === c.call(e)
        }

        function i(e) {
            var t = [];
            if (n(e)) t = e;
            else if ("number" == typeof e.length)
                for (var i = 0, r = e.length; r > i; i++) t.push(e[i]);
            else t.push(e);
            return t
        }

        function r(e, n) {
            function r(e, n, s) {
                if (!(this instanceof r)) return new r(e, n);
                "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = i(e), this.options = t({}, this.options), "function" == typeof n ? s = n : t(this.options, n), s && this.on("always", s), this.getImages(), o && (this.jqDeferred = new o.Deferred);
                var a = this;
                setTimeout(function() {
                    a.check()
                })
            }

            function c(e) {
                this.img = e
            }
            r.prototype = new e, r.prototype.options = {}, r.prototype.getImages = function() {
                this.images = [];
                for (var e = 0, t = this.elements.length; t > e; e++) {
                    var n = this.elements[e];
                    "IMG" === n.nodeName && this.addImage(n);
                    for (var i = n.querySelectorAll("img"), r = 0, o = i.length; o > r; r++) {
                        var s = i[r];
                        this.addImage(s)
                    }
                }
            }, r.prototype.addImage = function(e) {
                var t = new c(e);
                this.images.push(t)
            }, r.prototype.check = function() {
                function e(e, r) {
                    return t.options.debug && a && s.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
                }
                var t = this,
                    n = 0,
                    i = this.images.length;
                if (this.hasAnyBroken = !1, !i) return this.complete(), void 0;
                for (var r = 0; i > r; r++) {
                    var o = this.images[r];
                    o.on("confirm", e), o.check()
                }
            }, r.prototype.progress = function(e) {
                this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
                var t = this;
                setTimeout(function() {
                    t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify(t, e)
                })
            }, r.prototype.complete = function() {
                var e = this.hasAnyBroken ? "fail" : "done";
                this.isComplete = !0;
                var t = this;
                setTimeout(function() {
                    if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                        var n = t.hasAnyBroken ? "reject" : "resolve";
                        t.jqDeferred[n](t)
                    }
                })
            }, o && (o.fn.imagesLoaded = function(e, t) {
                var n = new r(this, e, t);
                return n.jqDeferred.promise(o(this))
            });
            var f = {};
            return c.prototype = new e, c.prototype.check = function() {
                var e = f[this.img.src];
                if (e) return this.useCached(e), void 0;
                if (f[this.img.src] = this, this.img.complete && void 0 !== this.img.naturalWidth) return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0;
                var t = this.proxyImage = new Image;
                n.bind(t, "load", this), n.bind(t, "error", this), t.src = this.img.src
            }, c.prototype.useCached = function(e) {
                if (e.isConfirmed) this.confirm(e.isLoaded, "cached was confirmed");
                else {
                    var t = this;
                    e.on("confirm", function(e) {
                        return t.confirm(e.isLoaded, "cache emitted confirmed"), !0
                    })
                }
            }, c.prototype.confirm = function(e, t) {
                this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
            }, c.prototype.handleEvent = function(e) {
                var t = "on" + e.type;
                this[t] && this[t](e)
            }, c.prototype.onload = function() {
                this.confirm(!0, "onload"), this.unbindProxyEvents()
            }, c.prototype.onerror = function() {
                this.confirm(!1, "onerror"), this.unbindProxyEvents()
            }, c.prototype.unbindProxyEvents = function() {
                n.unbind(this.proxyImage, "load", this), n.unbind(this.proxyImage, "error", this)
            }, r
        }
        var o = e.jQuery,
            s = e.console,
            a = s !== void 0,
            c = Object.prototype.toString;
        "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], r) : e.imagesLoaded = r(e.EventEmitter, e.eventie)
    }(window);
var rsnBrowser = new Object();
rsnBrowser.detect = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    var platform = new Object();
    platform.os = new Object();
    platform.browser = new Object();
    if (ua.indexOf("mac os x") != -1) {
        platform.os.name = "osx";
    } else if (ua.indexOf("windows") != -1) {
        platform.os.name = "windows";
    } else if (ua.indexOf("linux") != -1) {
        platform.os.name = "linux";
    }
    if (ua.indexOf('webkit') != -1) {
        platform.browser.engine = "webkit";
    } else if (ua.indexOf('gecko') != -1) {
        platform.browser.engine = "gecko";
    } else if (ua.indexOf('msie') != -1) {
        platform.browser.engine = "msie";
    }
    var browser = ua.match(/(opera|chrome|safari|firefox|trident|applewebkit)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (browser) {
        if (browser[1] && browser[1] == "trident") {
            platform.browser.name = "msie";
        } else if (browser[1]) {
            platform.browser.name = browser[1];
        } else {
            platform.browser.name = "unknown";
        }
        if (browser[2]) {
            platform.browser.version = browser[2];
        } else {
            platform.browser.version = "unknown";
        }
        if (platform.browser.name == "safari") platform.browser.version = ua.match(/version\/?\s*(\.?\d+(\.\d+)*)/i)[1];
    }
    return platform;
};
rsnBrowser.compareVersions = function(v1, v2) {
    var v1parts = v1.split('.');
    var v2parts = v2.split('.');
    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) return true;
        if (v1parts[i] == v2parts[i]) {
            continue;
        } else if (v1parts[i] > v2parts[i]) {
            return true;
        } else {
            return false;
        }
    }
    if (v1parts.length != v2parts.length) return false;
    return true;
};
var lightbox = new Object();
var ios = navigator.userAgent.match(/(iphone|ipod|ipad)/i) ? true : false;
lightbox.start = function() {
    $('.thumbs:not(.group .thumbs)').on('click', 'a', function(e) {
        var $this = $(this);
        if (!$this.hasClass('custom')) {
            e.preventDefault();
            $('<div id="overlay"></div>').appendTo('body');
            setTimeout(function() {
                $('#overlay').addClass('show');
            }, 1);
            var image = $this.attr('href');
            var title = $this.children('h4').text();
            var description = $this.children('div').html();
            var alt = $this.attr('title');
            var dimensions = $this.find('img').data('dimensions');
            lightbox.show(image, title, description, alt, dimensions);
            if (image.match('flickr')) $('#overlay').addClass('flickr');
        }
    });
    lightbox.bookmark();
    $(document).on('click', '#overlay, #overlay .image', function(event) {
        if (!$(event.target).is('.rsn_share a') && !$(event.target).is('.info, .info *') && !$(event.target).is('input')) {
            $('#overlay').removeClass('show');
            setTimeout(function() {
                $('#overlay').remove();
            }, 250);
            window.location.hash = "none";
            return false;
        }
    });
    $(document).on('click', '#overlay a.next.paging', function(event) {
        log('NEXT');
        lightbox.next('next');
        return false;
    });
    $(document).on('click', '#overlay a.back.paging', function(event) {
        lightbox.next('back');
        return false;
    });
    $('body').keydown(function(e) {
        if (e.which === 37) {
            lightbox.next('back');
        } else if (e.which === 39) {
            lightbox.next('next');
        }
    });
    $(window).resize(function() {
        lightbox.resize();
        $('#overlay .image').show();
    });
};
lightbox.bookmark = function() {
    if (window.location.hash) {
        var find = window.location.hash.replace('#', '');
        $('body').find('a[href$="' + find + '.jpg"]').each(function() {
            $(this).click();
        });
    }
};
lightbox.next = function(direction) {
    if ($('#overlay img').attr('src')) {
        var currentImage = $('#overlay img:not(.image)').attr('src');
        var $current = $('a[href$="' + currentImage + '"]').closest('li');
        var $new = (direction === "back" ? $current.prev() : $current.next());
        if ($new.length === 0) {
            return false;
        }
        var image = $new.children('a').attr('href');
        var title = $new.find('h4').html();
        var description = $new.find('div').html();
        var alt = $new.find('img').attr('alt');
        var dimensions = $new.find('img').data('dimensions');
        lightbox.show(image, title, description, alt, dimensions);
    }
    return false;
};
lightbox.show = function(image, title, description, alt, dimensions) {
    var dimensions = dimensions.split('x');
    var image = image.replace(/^#/, '');
    $('#overlay').html('<div class="image"></div><a class="paging back" href="#back">Back</a><a class="paging next" href="#next">Next</a>');
    var hash = image.split('/').pop().replace('.jpg', '');
    window.location.hash = hash;
    imgLoader = new Image();
    imgLoader.onload = function(data) {
        log('==== dimensions ====');
        log(dimensions);
        if (typeof dimensions != "undefined" && dimensions != "") {
            imageWidth = dimensions[0];
            imageHeight = dimensions[1];
        } else {
            imageWidth = imgLoader.width;
            imageHeight = imgLoader.height;
        }
        $('#overlay .image').append('<img src="' + image + '" alt="' + alt + '">');
        $('#overlay .image img').attr({
            'data-width': imageWidth,
            'data-height': imageHeight
        });
        if (imageHeight > imageWidth) {
            $('#overlay img').addClass('portrait');
        } else {
            $('#overlay img').addClass('landscape');
        }
        if (title || description) {
            $('#overlay > div').append('<div class="info show"></div>');
            if (title) $('#overlay .info').append('<h4>' + title + '</h4>');
            if (description) $('#overlay .info').append('<p>' + description + '</p>');
            $('#overlay .info').append('<a href="#" class="close">Close</a>');
            $('#overlay .close').click(function(event) {
                event.preventDefault();
                $(this).closest('.info').removeClass('show');
            });
        }
        rsn.imageTagalongs();
        setTimeout(function() {
            lightbox.resize();
            $('#overlay .image').addClass('show');
        }, 100);
        var $nextImageElement = $('a[href$="' + image + '"]').parent().next().children('a');
        if ($nextImageElement.length > 0) {
            var nextImageSrc = $('a[href$="' + image + '"]').parent().next().children('a').attr('href').replace(/^#/, '');
            nextImage = new Image();
            nextImage.src = nextImageSrc;
        }
    };
    imgLoader.src = image;
    lightbox.hidePaging(image);
};
lightbox.resize = function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var originalImageWidth = $('#overlay .image > img').data('width');
    var originalImageHeight = $('#overlay .image > img').data('height');
    var overlayPadding = parseInt($('#overlay > div').css('padding-top')) + parseInt($('#overlay > div').css('padding-bottom'));
    if (originalImageHeight + overlayPadding > windowHeight) {
        log('Resizing to fit vertically');
        var newImageHeight = windowHeight - overlayPadding;
        var ratio = newImageHeight / originalImageHeight;
        var newImageWidth = originalImageWidth * ratio;
    } else {
        var newImageHeight = originalImageHeight;
        var newImageWidth = originalImageWidth;
    }
    if (newImageWidth + overlayPadding > windowWidth) {
        log('Resizing to fit horizontal');
        var newImageWidth = windowWidth - overlayPadding;
        var ratio = newImageWidth / originalImageWidth;
        var newImageHeight = originalImageHeight * ratio;
    }
    var overlayHeight = newImageHeight + overlayPadding;
    var marginTop = (windowHeight - overlayHeight) / 2;
    var overlayWidth = newImageWidth + overlayPadding;
    var marginLeft = (windowWidth - overlayWidth) / 2;
    $('#overlay .image > img').css({
        'width': newImageWidth + 'px',
        'height': newImageHeight + 'px'
    });
    $('#overlay .image').css({
        'margin-left': marginLeft + 'px',
        'margin-top': marginTop + 'px'
    });
};
lightbox.hidePaging = function(image) {
    var $current = $('a[href$="' + image + '"]').closest('li');
    if ($current.next().length === 0) {
        $('#overlay a.next').addClass('invisible');
    } else {
        $('#overlay a.next').removeClass('invisible');
    }
    if ($current.prev().length === 0) {
        $('#overlay a.back').addClass('invisible');
    } else {
        $('#overlay a.back').removeClass('invisible');
    }
};
var rsn = new Object();
rsn.usingDownloadBlocker = false;
rsn.usingShareButton = false;

function log(message) {
    if (typeof develop != "undefined" && window.console && window.console.log) {
        console.log(message);
    }
}
rsn.findFullSizeImages = function() {
    return $('img[src*="_image_"], img[src*="_slide_"]:last-child, ul.images img, #overlay img').not('.body img, .html img, .blocker, form img, footer img');
};
rsn.browserDetect = function() {
    platform = rsnBrowser.detect();
    $('body').addClass(platform.browser.engine);
    log(platform);
    if (navigator.userAgent.match(/like Mac OS X/i)) {
        $('body').addClass('ios');
    }
};
rsn.ios = function() {};
rsn.email = function() {
    $('a[rel="mail"]').each(function() {
        var email = $(this).attr('href').split('#');
        var email = email[0] + "@" + email[1] + "." + email[2];
        if ($(this).attr('href') == $(this).text()) $(this).text(email);
        $(this).attr('href', 'mailto:' + email);
    });
};
rsn.links = function() {
    $('.body a').each(function() {
        var href = $(this).attr('href');
        var domain = document.domain.replace(/^www\./, '');
        if (typeof(href) != "undefined" && !href.match('http://' + domain) && !href.match('http://www.' + domain) && !href.match(/^\//)) {
            $(this).attr('target', '_blank').attr('rel', 'external');
        }
    });
    $(document).on('click', 'a[href="#top"]', function() {
        window.scrollTo(0, 0);
        return false;
    });
};
(function($) {
    $.fn.getImageSizeWhileLoading = function(parameters) {
        parameters = parameters || {};
        var defaults = {
            findDimension: 'width',
            assignTo: 'self'
        };
        parameters = $.extend(defaults, parameters);
        return this.each(function() {
            $(this).find('img').each(function() {
                var $image = $(this);
                var $target = (parameters.assignTo === "self" ? $image : $image.closest(parameters.assignTo));
                if ($image.data('dimensions') && $image.data('dimensions').match(/^\d+x\d+$/)) {
                    var aspectRatio = $image.data('dimensions').split('x');
                    var aspectRatio = aspectRatio[0] / aspectRatio[1];
                } else {
                    var aspectRatio = $image.attr('width') / $image.attr('height');
                }
                if (parameters.findDimension === "width") {
                    var newHeight = parseInt($image.css('height'));
                    var newWidth = Math.round(newHeight * aspectRatio);
                } else {
                    var newWidth = parseInt($image.css('width'));
                    var newHeight = Math.round(newWidth / aspectRatio);
                }
                $target.css({
                    width: newWidth + 'px',
                    height: newHeight + 'px'
                });
            });
        });
    };
})(jQuery);
rsn.home = new Object();
rsn.home.setup = function() {
    if (platform.browser.name == "msie") var ie = true;
    if ($('#container.bleed').length > 0) var bleed = true;
    var src = $('#billboard > .img:first-child').attr('src');
    log('loading ' + src);
    var img = new Image;
    img.onload = function() {
        if (bleed) {
            log('full bleed');
            if (typeof window.crop_align === "undefined") crop_align = "top center";
            $('#billboard > .img').fullBleed({
                align: crop_align,
                className: 'img'
            });
        } else if ($('#billboard .img').length > 1) {
            log('constrained slideshow');
            var height = parseInt($('#billboard > .img:first-child').height());
            $('#billboard').css('height', height + 'px');
            if ($('#container').hasClass('nobleed') && $('#container').hasClass('left') || $('#container').hasClass('layout-header-wide') && $('#container').hasClass('nobleed')) {
                var width = parseInt($('#billboard > .img:first-child').width());
                var height = parseInt($('#billboard > .img:first-child').height());
                $('#billboard').css('width', width + 'px');
                $('.layout-header-wide #billboard').css('height', height + 'px');
            }
        } else {
            log('single image');
        }
        setTimeout(function() {
            $('#billboard').removeClass('loading');
            if ($('#billboard > .img').length > 1) {
                rsn.home.slideshow();
            } else {
                $('#billboard').removeClass('slideshow');
            }
        }, 1);
    };
    img.src = src;
};
rsn.home.slideshow = function() {
    log('starting slideshow');
    if (platform.browser.name == "msie") var ie = true;
    if (!ie) {
        $('#billboard > .img:first-child').addClass('active');
    } else {
        $('#billboard > .img:first-child').animate({
            'opacity': 1
        }, slideshowSpeed, function() {
            $('#billboard > .img:first-child').addClass('active');
        });
    }
    var slideshowDelay = (typeof window.slideshowDelay != "undefined" ? window.slideshowDelay * 1000 : 4500);
    var slideshowSpeed = 1000;
    var slideshow = setInterval(function() {
        var $last = $('#billboard .active');
        var $next = ($last.next('.img').length > 0 ? $last.next() : $('#billboard > .img:first-child'));
        if ($('#container').hasClass('nobleed')) {
            var newHeight = $next.height();
            $('#billboard').css('height', newHeight + 'px');
            log('Resizing billboard to match next slide');
        }
        if (!ie) {
            $next.addClass('active');
        } else {
            $next.animate({
                'opacity': 1
            }, slideshowSpeed, function() {
                $next.addClass('active');
            });
        }
        setTimeout(function() {
            if (!ie) {
                $last.removeClass('active');
            } else {
                $last.animate({
                    'opacity': 0
                }, slideshowSpeed, function() {
                    $last.removeClass('active');
                });
            }
        }, slideshowSpeed);
    }, slideshowDelay);
};
rsn.grid = function() {
    if ($('.centered div.grid li, div.archive:not(.list) li').length > 0) {
        var size = $('div.thumbs li:first-child').width();
        $('div.thumbs li > a').css('height', size);
        $('.center .archive:not(.grid) .thumbs li:nth-child(6n+1)').addClass('clear');
    }
    $('#content .grid img, #content .archive img').each(function() {
        var $this = $(this);
        var image = $(this).attr('src');
        var imgLoader = new Image();
        imgLoader.onload = function(data) {
            if (imgLoader.height > imgLoader.width) $this.addClass('portrait');
            $this.addClass('show');
        }
        imgLoader.src = image;
    });
};
rsn.carousel = new Object();
rsn.carousel.resize = function() {
    var scrollbarHeight = 15;
    var contentWidth = parseInt($('#content').width());
    var contentHeight = parseInt($(window).height());
    var filmStripHeight = parseInt($('.thumbs').height() + scrollbarHeight);
    if ($('.layout-header-wide').length > 0) {
        log('Resizing carousel layout for "header wide" layout');
        var windowHeight = (platform.browser.name == "msie" ? document.documentElement.clientHeight : window.innerHeight);
        var headerHeight = $('header').height();
        var footerHeight = $('footer').outerHeight();
        var contentPadding = parseInt($('#content').css('padding-top')) + parseInt($('#content').css('padding-bottom'));
        var contentHeight = windowHeight - headerHeight - footerHeight - contentPadding;
        var stageHeight = contentHeight - filmStripHeight;
    } else {
        log('Resizing carousel layout for "sidebar" layout');
        var stageHeight = contentHeight - filmStripHeight;
    }
    $('div.carousel').css({
        height: contentHeight + 'px'
    });
    $('div.carousel .images').css({
        height: stageHeight + 'px'
    });
    $('div.carousel .images li').css({
        'line-height': stageHeight + 'px'
    });
};
rsn.carousel.centered = function() {
    var contentWidth = parseInt($('#content').width());
    var carouselHeight = Math.round((4 * contentWidth) / 6);
    if (carouselHeight > image_max_height) var carouselHeight = image_max_height;
    $('.carousel .images').css('height', carouselHeight + 'px');
    $('.carousel .images li').css('line-height', carouselHeight + 'px');
    $('.thumbs').insertAfter('.images').addClass('opaque');
    if ($('.images > li').length > 1) {
        if ($('.images').data('timeout')) {
            var timeout = $('.images').data('timeout');
        } else {
            var timeout = 0;
        }
        $('.images').after('<a class="paging back" href="#back">Back</a><a class="paging next" href="#next">Next</a>').cycle({
            fx: 'fade',
            next: 'a.next',
            prev: 'a.back',
            speed: 400,
            timeout: timeout,
            pager: '.thumbs',
            activePagerClass: 'selected',
            pagerAnchorBuilder: function(id, slide) {
                var thumb = $(slide).find('img').attr('id').replace('image-', 'thumb-');
                return $('#' + thumb).closest('li');
            },
            before: function() {
                $('.thumbs').stop();
                setTimeout(function() {
                    var position = $('.thumbs .selected').position();
                    if (position) {
                        var scroll = $('.thumbs').scrollLeft();
                        var thumbWidth = $('.thumbs .selected').width();
                        var windowWidth = $('.thumbs').width();
                        var left = (position.left + scroll) - (windowWidth / 2) + thumbWidth / 2;
                        $('.thumbs').animate({
                            scrollLeft: left
                        }, 500);
                    }
                }, 10);
            }
        });
    } else {
        $('.thumbs').hide();
    }
    $('.images').addClass('opaque');
    $('.carousel').hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    });
    $('body').keydown(function(e) {
        if (e.which == 37) {
            $('a.back').click();
            return false;
        } else if (e.which == 39) {
            $('a.next').click();
            return false;
        }
    });
};
rsn.carousel.multi = function() {
    rsn.carousel.resize();
    $(window).resize(rsn.carousel.resize);
    if ($('.images > li').length > 1) {
        $('.images').after('<a class="paging back" href="#back">Back</a><a class="paging next" href="#next">Next</a>');
        if ($('.images').data('timeout')) {
            var timeout = $('.images').data('timeout');
        } else {
            var timeout = 0;
        }
        $('.images').cycle({
            fx: 'fade',
            next: 'a.next',
            prev: 'a.back',
            speed: 400,
            timeout: timeout,
            pager: '.thumbs',
            activePagerClass: 'selected',
            pagerAnchorBuilder: function(id, slide) {
                var thumb = $(slide).find('img').attr('id').replace('image-', 'thumb-');
                return $('#' + thumb).closest('li');
            },
            before: function() {
                $('.thumbs').stop();
                setTimeout(function() {
                    var position = $('.thumbs .selected').position();
                    if (position) {
                        var scroll = $('.thumbs').scrollLeft();
                        var thumbWidth = $('.thumbs .selected').width();
                        var windowWidth = $('.thumbs').width();
                        var left = (position.left + scroll) - (windowWidth / 2) + thumbWidth / 2;
                        $('.thumbs').animate({
                            scrollLeft: left
                        }, 500);
                    }
                }, 10);
            }
        });
    } else {
        $('.thumbs').hide();
    }
    $('.carousel').addClass('show');
    $('.carousel').hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    });
    $('body').keydown(function(e) {
        if (e.which == 37) {
            $('a.back').click();
            return false;
        } else if (e.which == 39) {
            $('a.next').click();
            return false;
        }
    });
};
rsn.sideScroll = new Object();
rsn.sideScroll.availableSpace = function() {
    var windowHeight = (platform.browser.name == "msie" ? document.documentElement.clientHeight : $('html')[0].clientHeight);
    var headerHeight = $('header').height();
    var footerHeight = $('footer:visible').outerHeight();
    var contentPadding = parseInt($('#content').css('padding-top')) + parseInt($('#content').css('padding-bottom'));
    var itemMarginTop = parseInt($('.images > li:first-child').css('margin-top'));
    var itemMarginBottom = parseInt($('.images > li:first-child').css('margin-bottom'));
    var itemMargin = itemMarginTop + itemMarginBottom;
    var usedSpace = headerHeight + footerHeight + contentPadding + itemMargin;
    var availableSpace = windowHeight - usedSpace;
    log('windowHeight: ' + windowHeight);
    log('headerHeight: ' + headerHeight);
    log('footerHeight: ' + footerHeight);
    log('contentPadding: ' + contentPadding);
    log('availableSpace: ' + availableSpace);
    return availableSpace;
};
rsn.sideScroll.resize = function() {
    var windowWidth = (platform.browser.name == "msie" ? document.body.clientWidth : window.innerWidth);
    var marginTop = parseInt($('.images > li:first-child').css('margin-top'));
    var marginBottom = parseInt($('.images > li:first-child').css('margin-bottom'));
    if ($('.layout-header-wide').length > 0) {
        log('Resizing sidescroll layout for "header wide" layout');
        var imagesHeight = rsn.sideScroll.availableSpace();
        $('.sidescroll .images').css({
            'line-height': imagesHeight + 'px',
            'height': imagesHeight + 'px'
        });
    } else {
        log('Resizing sidescroll layout for "sidebar" layout');
        var windowHeight = (platform.browser.name == "msie" ? document.documentElement.clientHeight : $('html')[0].clientHeight);
        var sidebarWidth = $('header').width();
        var contentWidth = windowWidth - sidebarWidth;
        var imagesHeight = windowHeight;
        log('imagesHeight:' + imagesHeight);
        $('.sidescroll .images').css({
            'height': imagesHeight + 'px',
            'line-height': windowHeight - 30 + 'px'
        });
        if (marginTop > 0 || marginBottom > 0) {
            log('adjusting heights for top/bottom margin thats been set');
            var maxHeight = windowHeight - marginTop - marginBottom;
            $('.images > li').css({
                'max-height': maxHeight + 'px'
            });
        }
    }
    log(platform);
    if (platform.browser.engine == "gecko" || platform.browser.name == "msie") {
        log('Resizing for Firefox/IE');
        var maxHeight = parseInt(imagesHeight * .96);
        $('.images img:not(.blocker)').css('max-height', maxHeight + 'px');
    }
    $('.sidescroll').addClass('show');
};
rsn.uniformHeight = function(commonHeight) {
    if (typeof commonHeight == "undefined") var commonHeight = 675;
    if ($('.centered .sidescroll').length > 0) {
        $('.centered .sidescroll img').css({
            'max-height': commonHeight + 'px'
        });
    } else {
        rsn.uniformHeight.maxHeight = function() {
            var windowHeight = parseInt($('html')[0].clientHeight);
            var marginTop = parseInt($('.images > li:first-child').css('margin-top'));
            if ($('.layout-header-wide').length > 0) {
                var limit = rsn.sideScroll.availableSpace();
            } else {
                var limit = windowHeight - marginTop;
            }
            if (limit > commonHeight) {
                var maxHeight = commonHeight;
            } else {
                var maxHeight = limit;
            }
            $('.sidescroll img').css({
                'max-height': maxHeight + 'px',
                'max-width': 'none'
            });
        };
        $(document).ready(function() {
            $('.sidescroll li').css({
                'max-width': 'none'
            });
            rsn.uniformHeight.maxHeight();
            $(window).resize(rsn.uniformHeight.maxHeight);
        });
    }
};
rsn.sideScroll.sidebar = function() {
    rsn.sideScroll.resize();
    if (!$('body').hasClass('ios')) $(window).resize(rsn.sideScroll.resize);
    $('#content').css('visibility', 'visible');
    if ($('.sidescroll').length > 0) {
        $('body').append('<div id="scrollcatcher"></div>');
        var scrollModifier = (navigator.appVersion.indexOf("Mac") != -1 ? 25 : 75);
        log('scrollSpeed: ' + scrollModifier);
        $('html,body').mousewheel(function(event, delta, deltaX, deltaY) {
            log('scroll');
            if (deltaY > 0 && deltaY > deltaX || deltaY < 0 && deltaY < deltaX) {
                var speed = deltaY * scrollModifier;
                if (speed > 200) var speed = 200;
                if (speed < -200) var speed = -200;
                if (platform.browser.name == "msie") {
                    var position = document.documentElement.scrollLeft + -speed;
                    document.documentElement.scrollLeft = position;
                } else if (platform.browser.engine == "gecko") {
                    var position = $(document).scrollLeft() + -speed;
                    window.scrollTo(position, 0);
                } else {
                    var position = $(this).scrollLeft() + -speed;
                    $(this)[0].scrollLeft = position;
                }
                return false;
            }
        });
        $('.left .images li').hover(function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        });
        $(document).keydown(function(e) {
            var sidebarWidth = parseInt($('header').css('width'));
            var windowWidth = parseInt($(window).width());
            var contentWidth = windowWidth - sidebarWidth;
            var padding = 20;
            if (e.which == 37) {
                log('left');
                $('html, body').stop();
                var scrollLeft = $(window).scrollLeft();
                $($('.images > li').get().reverse()).each(function() {
                    var offset = parseInt($(this).offset().left - scrollLeft);
                    var rightEdge = offset + parseInt($(this).width());
                    var limit = sidebarWidth + contentWidth / 2;
                    if (rightEdge < limit - padding) {
                        var imageWidth = parseInt($(this).width());
                        var scrollTo = parseInt(scrollLeft + offset - sidebarWidth - contentWidth / 2 + imageWidth / 2);
                        log(scrollTo);
                        $('html, body').animate({
                            scrollLeft: scrollTo
                        }, 750);
                        return false;
                    }
                });
                return false;
            } else if (e.which == 39) {
                $('html, body').stop();
                var scrollLeft = $(window).scrollLeft();
                $('.images > li').each(function() {
                    var offset = parseInt($(this).offset().left - scrollLeft);
                    var limit = sidebarWidth + contentWidth / 2;
                    if (offset > limit + padding) {
                        var imageWidth = parseInt($(this).width());
                        var scrollTo = parseInt(scrollLeft + offset - sidebarWidth - contentWidth / 2 + imageWidth / 2);
                        log(scrollTo);
                        $('html, body').animate({
                            scrollLeft: scrollTo
                        }, 750);
                        return false;
                    }
                });
                return false;
            }
        });
        $(document).on('click', '.images img', function(e) {
            e.preventDefault();
            var e = $.Event('keydown');
            e.which = 39;
            $(document).trigger(e);
        });
        var $sidebar = $('header');
        var $footer = $('footer');
        var sidebarWidth = $sidebar.width();
        $('.left.ios:has(.sidescroll)').swipe({
            swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
                if (direction == "left") {
                    $sidebar.css({
                        left: -sidebarWidth + 'px'
                    });
                    $footer.css({
                        left: -sidebarWidth + 'px'
                    });
                } else if (direction == "right") {
                    var zoomLevel = document.height / window.innerHeight;
                    if (zoomLevel < 1.3) {
                        $sidebar.css({
                            left: 0
                        });
                        $footer.css({
                            left: 0
                        });
                    }
                }
            },
            threshold: 10,
            allowPageScroll: 'horizontal',
            cancelThreshold: 10000
        });
    }
};
rsn.sideScroll.headerWide = function() {
    $('header').css('position', 'fixed');
    $('footer').css('position', 'fixed');
    rsn.sideScroll.resize();
    if (!$('body').hasClass('ios')) {
        $(window).resize(rsn.sideScroll.resize);
    }
    $('#content').css('visibility', 'visible');
    $('body').append('<div id="scrollcatcher"></div>');
    var scrollModifier = (navigator.appVersion.indexOf("Mac") != -1 ? 25 : 100);
    $('html,body').mousewheel(function(event, delta, deltaX, deltaY) {
        log('scroll');
        if (deltaY > 0 && deltaY > deltaX || deltaY < 0 && deltaY < deltaX) {
            var speed = deltaY * scrollModifier;
            if (speed > 200) var speed = 200;
            if (speed < -200) var speed = -200;
            if (platform.browser.name == "msie") {
                var position = document.documentElement.scrollLeft + -speed;
                document.documentElement.scrollLeft = position;
            } else if (platform.browser.engine == "gecko") {
                var position = $(document).scrollLeft() + -speed;
                window.scrollTo(position, 0);
            } else {
                var position = $(this).scrollLeft() + -speed;
                $(this)[0].scrollLeft = position;
            }
            return false;
        }
    });
    $('.layout-header-wide .images li').hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    });
    $(document).keydown(function(e) {
        var sidebarWidth = parseInt($('header').css('width'));
        var windowWidth = parseInt($(window).width());
        var contentWidth = windowWidth - sidebarWidth;
        var padding = 20;
        if (e.which == 37) {
            log('left');
            $('html, body').stop();
            var scrollLeft = $(window).scrollLeft();
            $($('.images > li').get().reverse()).each(function() {
                var offset = parseInt($(this).offset().left - scrollLeft);
                var rightEdge = offset + parseInt($(this).width());
                var limit = sidebarWidth + contentWidth / 2;
                if (rightEdge < limit - padding) {
                    var imageWidth = parseInt($(this).width());
                    var scrollTo = parseInt(scrollLeft + offset - sidebarWidth - contentWidth / 2 + imageWidth / 2);
                    log(scrollTo);
                    $('html, body').animate({
                        scrollLeft: scrollTo
                    }, 750);
                    return false;
                }
            });
            return false;
        } else if (e.which == 39) {
            $('html, body').stop();
            var scrollLeft = $(window).scrollLeft();
            $('.images > li').each(function() {
                var offset = parseInt($(this).offset().left - scrollLeft);
                var limit = sidebarWidth + contentWidth / 2;
                if (offset > limit + padding) {
                    var imageWidth = parseInt($(this).width());
                    var scrollTo = parseInt(scrollLeft + offset - sidebarWidth - contentWidth / 2 + imageWidth / 2);
                    log(scrollTo);
                    $('html, body').animate({
                        scrollLeft: scrollTo
                    }, 750);
                    return false;
                }
            });
            return false;
        }
    });
    $(document).on('click', '.images img', function(e) {
        e.preventDefault();
        var e = $.Event('keydown');
        e.which = 39;
        $(document).trigger(e);
    });
};
rsn.sideScroll.header = function() {
    var scrollModifier = (navigator.appVersion.indexOf('Mac') != -1 ? 25 : 70);
    $('.sidescroll .images').mousewheel(function(event, delta, deltaX, deltaY) {
        if (deltaY > 0 && deltaY > deltaX || deltaY < 0 && deltaY < deltaX) {
            var speed = deltaY * scrollModifier;
            var position = $(this).scrollLeft() + -speed;
            $(this)[0].scrollLeft = position;
            return false;
        }
    });
    $('.sidescroll').addClass('show');
    $('.sidescroll .images li').hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    });
};
rsn.tiles = function() {
    var $container = $('.tile > .thumbs');
    var $first = $container.children(':first').children('a');
    var maxWidth = parseInt($first.css('width'));
    var margin = parseInt($first.css('margin-right'));
    var maxColumn = maxWidth + margin;

    function layout() {
        if (typeof(autosave) != "undefined") clearTimeout(autosave);
        autosave = setTimeout(function() {
            log('calculating tiles layout');
            var safetyPadding = 0;
            var containerWidth = $container.width();
            var columns = containerWidth / maxColumn;
            var newColumnCount = Math.ceil(columns);
            log(newColumnCount + ' columns');
            var newColumnWidth = Math.floor((containerWidth / newColumnCount)) - safetyPadding;
            var newImageWidth = newColumnWidth - margin;
            var masonryOptions = {
                itemSelector: 'li',
                transitionDuration: '0s',
                isResizeBound: false,
                columnWidth: newColumnWidth
            };
            $container.find('a').css({
                width: newImageWidth + 'px'
            });
            $container.getImageSizeWhileLoading({
                findDimension: 'height',
                assignTo: 'a'
            });
            $container.masonry(masonryOptions);
            $container.addClass('loaded');
        }, 1);
    }
    layout();
    $(window).resize(layout);
    $container.find('img').each(function() {
        var $this = $(this);
        var image = $(this).attr('src');
        var imgLoader = new Image();
        imgLoader.onload = function(data) {
            $this.addClass('loaded');
        }
        imgLoader.src = image;
    });
    if (!$('.tile').hasClass('collage')) lightbox.start();
    $(window).load(function() {
        layout();
        $('.tile.flickr').addClass('loaded');
    });
};
rsn.markup = function() {};
rsn.computedStyles = function() {
    if ($('.page-cover.centered.bleed footer').length > 0) {
        var width = parseInt($('#content').width());
        var outerWidth = parseInt($('#content').outerWidth());
        var padding = parseInt((outerWidth - width) / 2);
        var marginLeft = outerWidth / -2;
        $('.bleed footer').css({
            'width': width + 'px',
            'margin-left': marginLeft + 'px',
            'padding-left': padding + 'px',
            'padding-right': padding + 'px'
        });
        $('.bleed footer').addClass('show');
    }
    var footerColor = $('footer p').css('color');
    $('.credit path').css({
        fill: footerColor
    });
    if ($('body.left').length > 0) {
        var sidebarWidth = parseInt($('header').css('width'));
        var padding = parseInt($('footer').css('padding-left')) + parseInt($('footer').css('padding-right'));
        var footerWidth = sidebarWidth - padding;
        $('footer').css({
            width: footerWidth + 'px'
        }).addClass('show');
    }
    if ($('body.left').length > 0) {
        if (!$('nav').is(':visible')) $('nav').show();
        $('header h1 a').data({
            top: parseInt($('header h1 a').position().top)
        });
        $('nav').data({
            top: parseInt($('nav').position().top)
        });
        $('footer').data({
            height: parseInt($('footer').height())
        });
        rsn.computedStyles.prototype.responsiveSidebar();
        $(window).resize(rsn.computedStyles.prototype.responsiveSidebar);
    }
    if ($('body.left').length > 0 && $('.textpage').length > 0 || $('.layout-header-wide').length > 0 && $('.textpage').length > 0) {
        function responsiveTextPage() {
            var width = $('.textpage').width();
            if (width < 700) {
                $('.text-left').addClass('text-centered').addClass('text-left-disabled').removeClass('text-left');
                $('.text-right').addClass('text-centered').addClass('text-right-disabled').removeClass('text-right');
            } else {
                $('.text-left-disabled').removeClass('text-centered').removeClass('text-left-disabled').addClass('text-left');
                $('.text-right-disabled').removeClass('text-centered').removeClass('text-right-disabled').addClass('text-right');
            }
        }
        responsiveTextPage();
        $(window).resize(responsiveTextPage);
    }
    var $group = $('.layout-header-wide div.group:not(.tile), .layout-header-wide div.archive:not(.tile)');
    if ($group.length > 0) {
        function centerGroup($group) {
            var groupWidth = $group.width();
            var items = $group.children('.thumbs').children('li').length;
            var itemColumns = Math.floor(groupWidth / itemWidth);
            if (items < itemColumns) var itemColumns = items;
            var spaceUsed = itemWidth * itemColumns;
            $group.children('.thumbs').css({
                width: spaceUsed + 'px'
            });
        }
        $group.children('.thumbs').css({
            float: 'none',
            margin: '0 auto'
        });
        var itemWidth = $group.children('.thumbs').children('li:first-child').outerWidth(true);
        centerGroup($group, itemWidth);
        $group.addClass('opaque');
        $(window).resize(function() {
            centerGroup($group, itemWidth)
        });
    }
    $('div.archive').addClass('opaque');
};
rsn.computedStyles.prototype.responsiveSidebar = function() {
    var $logo = $('header h1 a');
    var $nav = $('nav');
    var $footer = $('footer');
    var logoTop = $logo.data('top');
    var navTop = $nav.data('top');
    var navHeight = $nav[0].scrollHeight;
    var footerHeight = $footer.data('height');
    var windowHeight = $(window).height();
    var availableNavSpace = windowHeight - navTop - footerHeight;
    if (navHeight > availableNavSpace) {
        $nav.addClass('scroll').css({
            height: availableNavSpace + 'px'
        });
    } else {
        $nav.removeClass('scroll').css({
            height: 'auto'
        });
    }
};
rsn.pages = function() {
    $(window).scroll(function() {
        if (typeof(loadNextPage) != "undefined") {
            clearTimeout(loadNextPage);
        }
        loadNextPage = setTimeout(function() {
            if ($(window).height() + $(window).scrollTop() >= $(document).height() - 600) {
                rsn.nextPage();
            }
        }, 250);
    });
};
rsn.nextPage = function() {
    var currentPage = $('.paged').attr('class').split(' ').pop().replace('page', '') * 1;
    var nextPage = currentPage + 1;
    $('.paged').removeClass('page' + currentPage).addClass('page' + nextPage);
    var url = "/" + tag + "?page=" + nextPage;
    $('<div id="temporary"></div>').appendTo('body').load(url + ' .paged > *', function() {
        $(this).children().each(function() {
            $(this).appendTo('.paged');
        });
        $(this).remove();
    });
};
rsn.forms = function() {
    var action = "/actions" + $(this).attr('action');
    $(this).attr('action', action);
};
rsn.peek = function() {
    $('a').each(function() {
        var href = $(this).attr('href') + "?peek=true";
        $(this).attr('href', href);
    });
};
rsn.indexpage = function(page) {
    if ($('div.group').length < 1 && $('div.archive').length < 1) {
        var page = page.replace('/', '').toLowerCase();
        $('#page-' + page).addClass('index');
        $('.index .grid').addClass('archive').removeClass('grid');
        $('.index .thumbs > li > a').each(function() {
            var href = $(this).find('div').text();
            $(this).attr('href', href);
        });
    }
};
$.expr[':'].icontains = function(obj, index, meta, stack) {
    return (obj.textContent || obj.innerText || jQuery(obj).text() || '').toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
};
rsn.dropdown = function() {
    if ($('nav .accordion').length > 0 && $('nav .dropdown').length > 0) {
        log('New drop down menus in use');
    } else {
        log('running oldschool drop down menu hack');
        $('nav').hide()
        if ($('#container').hasClass('left')) {
            $('nav').addClass('accordion');
            var menuType = "accordion";
        } else {
            $('nav').addClass('dropdown2');
            var menuType = "dropdown2";
        }
        $('nav a[href^="#"]').each(function() {
            $this = $(this);
            var category = $(this).attr('href').replace('#', '');
            $(this).parent().append('<ul></ul>');
            $('nav a:icontains("' + category + ': ")').each(function() {
                var label = $(this).text().split(':')[1].toString();
                var label = $.trim(label);
                $(this).text(label);
                $(this).parent().appendTo($this.siblings('ul'));
            });
        });
        $('nav').show();
        $('nav ul ul').each(function() {
            $(this).show();
            $(this).css('height', $(this).height());
            $(this).hide();
        });
        $('nav > ul > li:has("ul") > a').click(function() {
            if (menuType == "accordion") {
                var $menu = $(this).siblings('ul');
                $menu.stop();
                if ($menu.hasClass('expanded')) {
                    $menu.removeClass('expanded');
                    $menu.slideUp('fast');
                } else {
                    $menu.addClass('expanded');
                    $menu.slideDown('fast');
                }
            }
            return false;
        });
        if (menuType == "accordion") $('nav ul ul .selected').closest('ul').addClass('expanded').show();
    }
};
rsn.dropdown2 = function() {
    $('nav .menu > a').click(function() {
        return false;
    });
    if ($('nav').hasClass('accordion')) {
        var menuType = "accordion";
    } else if ($('nav').hasClass('dropdown')) {
        var menuType = "dropdown";
    }
    $('nav .accordion > a').click(function() {
        var $menu = $(this).siblings('ul');
        if (!$menu.hasClass('expanded')) {
            $menu.parent().siblings().children('ul.expanded').animate({
                opacity: 0
            }, 150, function() {
                $(this).slideUp('fast');
                $(this).removeClass('expanded');
            });
            $menu.slideDown('fast', function() {
                $menu.animate({
                    opacity: 1
                }, 150);
            });
            $menu.addClass('expanded');
        } else {
            $menu.animate({
                opacity: 0
            }, 150, function() {
                $(this).slideUp('fast');
                $(this).removeClass('expanded');
            });
        }
        return false;
    });
    $('nav .accordion .selected').closest('ul').css({
        opacity: 1
    }).addClass('expanded').show();
};
rsn.imageTagalongs = function() {
    if (rsn.usingDownloadBlocker) rsn.blocker();
    if (rsn.usingShareButton) rsn.shareImage();
};
rsn.blocker = function() {
    rsn.usingDownloadBlocker = true;
    rsn.findFullSizeImages().after('<img class="blocker" src="/images/blank.png" alt="" style="position:absolute;top:0;left:0;width:100%;height:100%;max-height:100%;">');
};
rsn.shareImage = function() {
    rsn.usingShareButton = true;
    rsn.findFullSizeImages().each(function() {
        var $this = $(this);
        var url = window.location.href;
        var image = $this.prop('src');
        var thumbnail = "";
        var description = $this.prop('alt');
        var properties = $.param({
            'u': url
        });
        var facebook = "https://www.facebook.com/sharer/sharer.php?" + properties;
        var properties = encodeURIComponent(description + "\n" + url + "\n" + image);
        var twitter = "//twitter.com/home?status=" + properties;
        var properties = $.param({
            url: url,
            media: image,
            description: description
        });
        var pinterest = "//www.pinterest.com/pin/create/button/?" + properties;
        $this.parent().append('<span class="rsn_share">\
    <a target="_blank" class="facebook" href="' + facebook + '" title="Share image on Facebook">Facebook</a>\
    <a target="_blank" class="twitter" href="' + twitter + '" title="Share image on Twitter">Twitter</a>\
    <a target="_blank" class="pinterest" href="' + pinterest + '" title="Pin image on Pinterest">Pinterest</a>\
   </span>');
    });
};
rsn.customFonts = function() {
    if (typeof custom_fonts != "undefined") {
        $.each(custom_fonts, function() {
            if (this.source != "") {
                $('head').append(this.source);
            }
        });
    }
};
rsn.wrapText = function(pages) {
    if (typeof pages == "undefined") {
        var pages = "body";
    } else {
        var pages = pages.split(',');
        $.each(pages, function(i) {
            pages[i] = "#page-" + pages[i].replace(/\s+/g, '');
        });
        var pages = pages.join(',');
    }
    $(pages).each(function() {
        $('#sidebar img').prependTo('#main .body').addClass('right');
        $('#main').addClass('wide');
        $('#sidebar').remove();
    });
};
rsn.confirmation = function() {
    $('#confirmation .close').click(function(e) {
        e.preventDefault();
        $('#confirmation').fadeOut('fast');
    });
};
rsn.analytics = function() {
    var host = window.location.hostname.replace(/^www\./, '');
}
rsn.fullScreenVideo = function(videos) {
    var video = videos[Math.floor(Math.random() * videos.length)];
    $('#billboard').html(video);
    var $video = $('#billboard iframe');
    var $window = $(window);
    $video.css({
        position: "absolute"
    });

    function resizeFullscreenVideo() {
        var windowSize = {
            width: $window.width(),
            height: $window.height()
        };
        var aspectRatioVideo = $video.width() / $video.height();
        var aspectRatioWindow = windowSize.width / windowSize.height;
        if (aspectRatioWindow > aspectRatioVideo) {
            var newWidth = windowSize.width;
            var newHeight = newWidth / aspectRatioVideo;
            var newTop = (newHeight - windowSize.height) / -2;
            var newLeft = 0;
        } else {
            var newHeight = windowSize.height;
            var newWidth = newHeight * aspectRatioVideo;
            var newTop = 0;
            var newLeft = (newWidth - windowSize.width) / -2;
        }
        $video.css({
            width: newWidth + "px",
            height: newHeight + "px",
            left: newLeft + "px",
            top: newTop + "px"
        });
    }
    resizeFullscreenVideo();
    $(window).resize(resizeFullscreenVideo);
};
$(document).ready(function() {
    try {
        rsn.browserDetect();
        rsn.markup();
        if ($('nav ul ul').length > 0) rsn.dropdown2();
        rsn.ios();
        if ($('#billboard').length > 0) rsn.home.setup();
        if ($('#content .grid').not('.collage').length > 0) lightbox.start();
        rsn.email();
        rsn.links();
        if ($('#container.left div.sidescroll').length > 0) rsn.sideScroll.sidebar();
        if ($('#container.centered div.sidescroll').length > 0) rsn.sideScroll.header();
        if ($('.layout-header-wide div.sidescroll').length > 0) rsn.sideScroll.headerWide();
        if ($('.centered div.carousel').length > 0) rsn.carousel.centered();
        if ($('.left div.carousel').length > 0) rsn.carousel.multi();
        if ($('.layout-header-wide div.carousel').length > 0) rsn.carousel.multi();
        if ($('div.tile').length > 0) rsn.tiles();
        rsn.computedStyles();
        if ($('.paged').length > 0) rsn.pages();
        $('.contact_form').each(rsn.forms);
        rsn.grid();
        rsn.customFonts();
        if (typeof peek != "undefined") rsn.peek();
        rsn.analytics();
        if ($('#confirmation').length > 0) rsn.confirmation();
    } catch (error) {
        alert(error);
    }
});

