function hide_messages(){
    $('div.alert').fadeOut();
}

function clean_results(){
    $('div.row.row-journals').remove();
    $('.mayhide').hide();
    $('.mayempty').text('');
}