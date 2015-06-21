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
        url: $('#layout-controls').attr('data-edit-url'),
        data: { 'Album': {
            'type': type
        } }
    });
});

function editDetails(id)
{
    var t = $("#title").val();
    var d = $("#description").val();

    $.ajax({
        type: "POST",
        url: $('#sortable').attr('data-edit-url') + '/' + id,
        data: { 'Photo': {
            'title': t,
            'description': d
        } },
        success: function(){ 
            var img = $('#'+id+' img');
            img.attr('data-title', t);
            img.attr('data-description', d);
            dialog.dialog("close");
        }
    });
}

var dialog = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 650,
    modal: true,
    buttons: {
        "Save": function() { 
            editDetails(dialog.photo_id); 
        },
        Cancel: function() {
            dialog.dialog("close");
        }
    },
    close: function() {
        form[0].reset();
    }
});
var form = dialog.find("form");


$('.action.details').click(function(e){
    e.preventDefault();
    var li = $(this).closest('li');
    var img = li.find('img');
    var id = li.attr('id');
    dialog.photo_id = id;
    dialog.img = img;
    $("#title").val(img.attr('data-title'));
    $("#description").val(img.attr('data-description'));
    dialog.dialog("open");
});
