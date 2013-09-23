$(document).ready(function() {
    if ($(window).width() >= 1068) {
    $('#share').share({
        networks: ['twitter','facebook','googleplus','linkedin','reddit','tumblr','pinterest','stumbleupon','email'],
        orientation: 'vertical',
        urlToShare: 'http://rchive.it',
        affix: 'left center'
    });
    }

    jQuery('span.email').each(function(i) {
        var text = jQuery(this).text();
        var address = text.replace(' AT ', '@').replace(' DOT ', '.').replace(' DOT ', '.');
        jQuery(this).text(address);
    });

    $('body').on('click', 'div.journal', function() {
        if ($.active)
            return;
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
        scroll_to($(this).attr('href'));
        ev.preventDefault();
    }); 

    $("#query").focus();

    $('form#sherparomeo').submit(function(ev) {
        clean_results();
        ev.preventDefault();
        $('button#look').click();
    });

    $('button#look').click(function() {
        var journal_name = encodeURI($.trim($('#query').val()));
        if (!journal_name || $.active)
            return;
        $('div.pre-pre-results').css('visibility','visible');
        please_wait(true);
        hide_messages();
        clean_results();
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
                scroll_to('#examples',2000);
                return;
            } else if (results_count == 1) {
                $('div.row.row-journals').remove();
                show_result(json);
                scroll_to('#examples',2000);
                return;
            } else {
                show_results(json);
                scroll_to('#examples',2000);
            }
        });
    });

    $('button.tryout').click(function(){
        if ($.active)
            return;
        $('#query').val($(this).text());
        $('button#look').click();
    });

});
