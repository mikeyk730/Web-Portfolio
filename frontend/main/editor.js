$('#album-file').change(function() {
    $('#w0').submit();
});

$( "#sortable" ).disableSelection();
$( "#sortable" ).sortable({
    update: function(event, ui) {
        var order = $( "#sortable" ).sortable( "toArray" );
        $.ajax({
            type: "POST",
            url: $('#sortable').attr('data-reorder-url'),
            data: {'order': order}
        });
    }
});

$('.action.remove').click(function(e){
    e.preventDefault();
    var li = $(this).closest('li');
    var id = li.attr('id');
    if(id && confirm('Do you want to delete this image?')){
        $.ajax({
            type: "POST",
            url: $('#sortable').attr('data-delete-url') + '/' + id,
            success: function(){ li.remove(); }
        });
    }
});

$('.action.hide').click(function(e){
    e.preventDefault();
    var li = $(this).closest('li');
    var id = li.attr('id');
    var hidden = li.hasClass('hidden');
    $.ajax({
        type: "POST",
        url: $('#sortable').attr('data-edit-url') + '/' + id,
        data: { 'Photo': {
            'hide_on_pc': hidden ? 0 : 1, 
            'hide_on_mobile': hidden ? 0 : 1,
        } },
        success: function(){ 
            hidden ? li.removeClass('hidden') : li.addClass('hidden');
        }
    });
});

$('label.layout').click(function(e){
    e.preventDefault();
    var input = $(this).find('input');
    var type = input.attr('value');
    $.ajax({
        type: "POST",
        url: $('fieldset').attr('data-edit-url'),
        data: { 'Album': {
            'type': type
        } }
    });
});
