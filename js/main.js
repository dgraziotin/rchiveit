var SCROLL_TIME = 2000;
var MIN_WIDTH_FOR_SHARE_WIDGET = 1068;

$(document).ready(function () {

    if ($(window).width() >= MIN_WIDTH_FOR_SHARE_WIDGET) {
        $('#share').share({
            networks: ['twitter', 'facebook', 'googleplus', 'linkedin', 'reddit', 'tumblr', 'pinterest', 'stumbleupon', 'email'],
            orientation: 'vertical',
            urlToShare: 'http://rchive.it',
            affix: 'left center',
        });
    }

    $(window).load(function() {
        $(window).hashchange( function(){

            // http://stackoverflow.com/questions/3008696/after-all-document-ready-have-run-is-there-and-event-for-that
            var ISSNFromURL = ISSNFromLocationBar();
            if (ISSNFromURL){
                $('#query').val(ISSNFromURL);
                $('select#search-by-what').val('by-issn');
                $('button#search').click();

            }else{
                
                var hash = getHashFromLocationBar();
                if (!isInternalLink(hash)){
                    $('#query').val(hash);
                    $('select#search-by-what').val('by-publisher');
                    $('button#search').click();
                }

            }

        });
        $(window).hashchange();
    });

    jQuery('span.email').each(function () {
        var emailNoSpam = jQuery(this).text();
        var emailAddress = emailNoSpam.replace(' AT ', '@').replace(' DOT ', '.').replace(' DOT ', '.');
        jQuery(this).text(emailAddress);
    });

    $('body').on('click', 'div.journal', function () {
        if ($.active)
            return;

        pleaseWait(true);
        cleanResults();

        var disambiguer = encodeURI($.trim($(this).children("span").html()));

        var isISSN = isValidISSN(disambiguer);
        if (isISSN) {
            hideAllMessages();
            $.get("/api.php", {
                searchValue: disambiguer,
                searchByWhat: 'by-issn'
            }, function (data) {
                pleaseWait(false);
                var json = $.xml2json(data);
                showResult(json);
            });
        } else {
            hideAllMessages();
            $.get("/api.php", {
                searchValue: disambiguer,
                searchByWhat: 'by-id'
            }, function (data) {
                pleaseWait(false);
                var json = $.xml2json(data);
                showResult(json);
            });
        }
    });

    $('a.scroll').click(function (ev) {
        scrollTo($(this).attr('href'));
        ev.preventDefault();
    });

    $("#query").focus();

    $('form#sherpa-romeo').submit(function (ev) {
        cleanResults();
        ev.preventDefault();
        $('button#search').click();
    });

    $('button#search').click(function () {

        var searchValue = encodeURI($.trim($('#query').val()));
        var searchByWhat = encodeURI($.trim($('#search-by-what').val()));

        if (!searchValue || !searchByWhat || $.active)
            return;

        if (!isValidISSN(searchValue) && searchByWhat == 'by-issn'){
            $('#search-by-what').val('by-journal');
            searchByWhat = 'by-journal';
        }


        $('div.pre-pre-results').css('visibility', 'visible');
        pleaseWait(true);
        hideAllMessages();
        cleanResults();

        
        $.get("/api.php", {
            searchValue: searchValue,
            searchByWhat: searchByWhat
        }, function (data) {
            pleaseWait(false);
            var json = $.xml2json(data);
            var resultsCount = json.header.numhits;

            if (resultsCount == 0) {
                $('div.row.row-journals').remove();
                $('#results').append('<div class="row"></div>');
                var message = 'No results found.';
                switch (searchByWhat) {
                    case 'by-issn':
                        message = 'No results found. Please double-check the ISSN number (1234-5678).<br/>' +
                            'Consider searching by publication name or publisher name';
                        break;
                    case 'by-id':
                        message = 'No results found. This case should not happen. Please contact the developer.';
                        break;
                    case 'by-journal':
                        message = 'No results found. Please double-check the publication name. <br/>' +
                            'Consider searching by publisher name or ISSN number (1234-5678)';
                        break;
                    case 'by-publisher':
                        message = 'No results found. Please double-check the publisher name. <br/>' +
                            'Consider searching by publication name or ISSN number (1234-5678)';
                        break;
                    default:
                        message = 'No results found.';
                }

                showMessage(message, 'info');

                return;
            } else if (resultsCount == 1) {

                $('div.row.row-journals').remove();
                showResult(json);

                return;
            } else {
                var message = 'No results found.';
                switch (searchByWhat) {
                    case 'by-issn':
                        showResult(json);
                        return;
                        break;
                    case 'by-id':
                        message = 'No results found. This case should not happen. Please contact the developer.';
                        break;
                    case 'by-journal':
                        message = 'Multiple results found. Here are some of them. <br/>' +
                            '<strong>Not what you were looking for?</strong> Consider searching again: ' +
                            '<ol><li>By ISSN number</li>' +
                            '<li>By publisher name</li></ol>';
                        break;
                    case 'by-publisher':
                        message = 'Multiple results found. Here are some of them. <br/>' +
                            '<strong>Not what you were looking for?</strong> Consider searching again: ' +
                            '<ol><li>By ISSN number</li>' +
                            '<li>By publication name</li></ol>';
                        break;
                    default:
                        message = 'No results found.';
                }

                showMessage(message, 'info');
                showResults(json);
            }
        });
    });

    $('button.try-out').click(function () {
        if ($.active)
            return;
        $('#query').val($(this).text());
        $('#search-by-what').val('by-journal');
        $('button#search').click();
    });

    $('body').bind('beforeunload', function () {
        $('form').reset();
    });

    $('body').on('click', 'input#permalink', function(){this.select();});


});
