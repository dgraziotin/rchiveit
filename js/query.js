function handleResults(searchValue, searchByWhat, json) {

    var resultsCount = (!json) ? 0 : json.header.numhits;

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

        if (searchByWhat == 'by-journal') {
            var journal = json.journals.journal;
            journalISSN = journal.issn;
            window.location.hash = journalISSN;
            return;
        }

        $('div.row.row-journals').remove();
        showResult(json);
        $('#query').val($('#query').val().replace(/\+/g, " "));

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

}


function query(searchValue, searchByWhat) {

    $('div.pre-pre-results').css('visibility', 'visible');
    pleaseWait(true);
    hideAllMessages();
    cleanResults();

    hideAllMessages();
    $.get("/api.php", {
        searchValue: searchValue,
        searchByWhat: searchByWhat
    }, function(data) {
        pleaseWait(false);
        var json = $.xml2json(data);
        handleResults(searchValue, searchByWhat, json);

        share();
    });
}
