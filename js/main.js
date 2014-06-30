var SCROLL_TIME = 2000;
var MIN_WIDTH_FOR_SHARE_WIDGET = 1068;

$(document).ready(function() {

    var hash = getHashFromLocationBar();

    if (hash && !isInternalLink(hash)) {
        if (isValidISSN(hash)) {

            $('#query').val(hash);
            $('select#search-by-what').val('by-issn');

            setTimeout(function() {
                query(hash, 'by-issn');
            }, 10);


        } else if (isPublisherDisambiguer(hash)) {

            var disambiguer = publisherDisambiguer(hash);

            setTimeout(function() {
                query(disambiguer, 'by-id');
            }, 10);


        } else {

            $('#query').val(hash);
            $('select#search-by-what').val('by-publisher');

            setTimeout(function() {
                query(hash, 'by-publisher');
            }, 10);

        }

    }


    $(window).load(function() {

        $(window).hashchange(function() {

            var hash = getHashFromLocationBar();
            if (hash) {
                window.location.href = window.location.origin + '/#' + getHashFromLocationBar().replace(/\s+/g, '+');
            } else {
                window.location.href = window.location.origin;
            }
            window.location.reload();
        });

    });

    $('body').on('click', 'div.journal', function() {
        if ($.active)
            return;


        var disambiguer = encodeURI($.trim($(this).children("span").html()));

        var isISSN = isValidISSN(disambiguer);
        if (isISSN) {

            window.location.hash = disambiguer;
            return;

        } else {

            var name = $(this).children("h3").text().toLowerCase();
            var hash = name + '-' + disambiguer;

            window.location.hash = hash;
            return;

        }
    });


    $('a.scroll').click(function(ev) {
        scrollTo($(this).attr('href'));
        ev.preventDefault();
    });

    $("#query").focus();

    $('form#sherpa-romeo').submit(function(ev) {
        cleanResults();
        ev.preventDefault();
        $('button#search').click();
    });


    $('button#search').click(function() {

        var searchValue = encodeURI($.trim($('#query').val()));
        var searchByWhat = encodeURI($.trim($('#search-by-what').val()));

        if (!searchValue || !searchByWhat || $.active)
            return;

        if (!isValidISSN(searchValue) && searchByWhat == 'by-issn') {
            $('#search-by-what').val('by-journal');
            searchByWhat = 'by-journal';
        }

        query(searchValue, searchByWhat);

    });

    $('button.try-out').click(function() {
        if ($.active)
            return;
        $('#query').val($(this).text());
        $('#search-by-what').val('by-journal');
        $('button#search').click();
    });

    $('body').bind('beforeunload', function() {
        $('form').reset();
    });

    $('body').on('click', 'input#permalink', function() {
        this.select();
    });


    jQuery('span.email').each(function() {
        var emailNoSpam = jQuery(this).text();
        var emailAddress = emailNoSpam.replace(' AT ', '@').replace(' DOT ', '.').replace(' DOT ', '.');
        jQuery(this).text(emailAddress);
    });

});
