//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function show_message(message, type) {
    if (!type) {
        type = 'info';
    }
    $('<div class="alert alert-' + type + '">' + message + '</div>').css('display', 'none').prependTo('div.panel-body.pre-results').fadeIn();
}

function hide_messages(){
    $('div.alert').fadeOut().remove();
}

function clean_results(){
    $('div.row.row-journals').remove();
    $('.mayhide').hide();
    $('.mayempty').text('');
}

function please_wait(active) {
    if (active) {
        $('<div class="spinning well-lg text-center"><i class="icon-spinner icon-spin icon-4x"></i></div>').appendTo('div.panel-body.pre-results').fadeIn();
    } else {
        $('div.spinning').fadeOut().remove();
    }
}

function scroll_to(id){
    $('body, html').animate({ scrollTop: $(id).offset().top}, 1500);    
}
