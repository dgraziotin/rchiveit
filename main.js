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

function please_wait(active) {
    if (active) {
        $('<div class="spinning well-lg text-center"><i class="icon-spinner icon-spin icon-4x"></i></div>').appendTo('div.panel-body.pre-results').fadeIn();
        //$('<div class="spinning" style="width:100%;text-align:center"><h3 class="icon-spinner icon-spin icon-large" style="float:left;margin-right:15px"></h3>' +
        //    '<h3>Please wait..fetching results</h3></div>').appendTo('div.panel-body.pre-results');
    } else {
        $('div.spinning').fadeOut().remove();
    }
}

function scrollTo(id){
    $('body, html').animate({ scrollTop: $(id).offset().top}, 2000);    
}


$(document).ready(function() {

    $('body').on('click', 'div.journal', function() {
        please_wait(true);
        clean_results();
        var issn = this.id;
        hide_messages();
        $.get("/api.php", {
            issn: issn
        }, function(data) {
            please_wait(false);
            var json = $.xml2json(data);
            show_result(json);
        });
    });

    $('a.scroll').click(function(ev){
        scrollTo($(this).attr('href'));
        ev.preventDefault();
    }); 

    $("#query").focus();

    $('form#sherparomeo').submit(function(ev) {
        ev.preventDefault();
        $('button#look').click();
    });

    $('button#look').click(function() {
        var journal_name = encodeURI($.trim($('#query').val()));
        if (!journal_name || $.active)
            return;
        please_wait(true);
        hide_messages();
        $.get("/api.php", {
            journalname: journal_name
        }, function(data) {
            please_wait(false);
            var json = $.xml2json(data);
            var col_size = 1;
            var results_count = json.header.numhits;

            if (results_count == 0) {
                $('div.row.row-journals').remove();
                $('#results').append('<div class="row"></div>');
                show_message('No results found.');
                return;
            } else if (results_count == 1) {
                $('div.row.row-journals').remove();
                show_result(json);
                return;
            } else {
                show_results(json);
            }
        });
    });

    $('span.label').click(function(){
        $('#query').val($(this).text());
        $('button#look').click();
    });
});
