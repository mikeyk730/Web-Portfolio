function linear_partition (t, e) {
    var n, i, r, o;
    for (i = t.length, r = [], n = 0; i > n;) {
	o = Math.ceil((i - n) / e--);
	r.push(t.slice(n, n += o));
    }
    return r;
}

function renderGrid(el) 
{
    el = $(el);
    var photo_elements = el.find(".photo");
    var group_width = el.closest(".inline-album").width();
    var target_height = Math.round($(window).height() / (1.618 * 1.618));
    var total_target_width = 0;
    photo_elements.map(function (i,e) {
        total_target_width += parseFloat($(e).attr("data-aspect-ratio")) * target_height;
    });
    var target_row_width = Math.round(total_target_width / group_width);    
    var partition = linear_partition(photo_elements, target_row_width);
    var row_number = 1;
    var row_widths = [];

    $.each(partition, function (i,n) {
        var ratio = 0
        n.map(function (i,current) {
	    ratio += parseFloat($(current).attr("data-aspect-ratio"));
        });
	var row_width = 0; 
	var row_index = 0; 
	n.each(function (i,element) {
	    element = $(element);
	    element.attr("data-row-index", row_index);
	    element.attr("data-row-number", row_number);
	    element.attr("data-last-in-row", row_index == n.length - 1);
	    row_index++;

	    var original_w = parseInt(element.attr("data-original-width"));
	    var original_h = parseInt(element.attr("data-original-height"));
	    var original_ratio = original_w / original_h;

	    var new_width = parseInt(group_width / ratio * original_ratio) - 1;
	    var new_height = parseInt(group_width / ratio);
	    element.width(new_width).height(new_height);
	    row_width += new_width;

            //TODO
	   /* var img = element.find("img");
	    var url = getPhotoUrl(element, img, new_width);
	    if(url){
		img.attr('src', url);
	    }*/
        });
	row_widths[row_number] = row_width;
	row_number++;
    });
    var E; 
    var min = Number.POSITIVE_INFINITY;
    var below_min = false;
    $.each(row_widths, function (i,t) {
        if (t < min) {
	    min = t; 
	    below_min = true;
	}
    });
    if (below_min){
	row_number = 1;
	$.each(partition, function (i,t) {
            E = row_widths[row_number] - min;
	    if (E > 0){ 
		t.last().width(t.last().width() - E);
	    }
	    row_number++;
	});
    }
}

function handleResize() {
    $("#post-container header").css({
	height: $(window).height() + "px"
    });
    $('.inline-album').each(function(i,e){ renderGrid(e)} );
}

$(function() {
    $(window).resize(function () {
        handleResize();
    });
    handleResize();

    $('#post-cover h1,#post-cover h2').click(function(){
        var pos = $('#content').position();
        var top = pos ? pos.top : 300;
        scrollTo(0, top-100);
    });

    $(window).scroll(function () {
	var t = $(this).scrollTop();
	$(".author-meta").css("opacity", +(9 >= t));
	$(".cover-hotspot").css("opacity", +(t >= 10))
    });
});
