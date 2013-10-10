function showResults(json) {
    
    var resultsCount = json.header.numhits;

    //TODO: think a clever way
    if (resultsCount > 12) {
        resultsCount = 12;
    }

    var colSize = 3;

    $('div.row.row-journals').remove();
    cleanResults();

    var journals;
    if (typeof json.journals.journal == 'undefined')
        journals = shuffle(json.publishers.publisher);
    else
        journals = shuffle(json.journals.journal);

    for (var i = 0; i < resultsCount; i++) {
        var journalName;
        var journalPublisher;
        var journalISSN;

        if (typeof journals[i].jtitle == 'undefined') {
            journalName = journalPublisher = journals[i].name;
            if (journals[i].alias != '')
                journalPublisher = journals[i].alias;
            journalISSN = journals[i].id;

        } else {
            journalName = journals[i].jtitle;
            journalPublisher = journals[i].romeopub;
            journalISSN = journals[i].issn;
        }


        if (i == 0) {
            $('#results').append('<div class="row row-journals"></div>');
        }

        if (i == 4 || i == 8 || i == 12) {
            $('<div class="row row-journals"></div>').insertAfter('div#results>div.row.row-journals:last-child');
        }

        $('div#results>div.row.row-journals:last-child').append('<div class="journal col-md-' + colSize + '" id=' + journalISSN + '>' +
            '<h3>' + journalName + '</h3>' +
            '<h4>' + journalPublisher + '</h4><span style="display:none">' + journalISSN + '</span></div>');
    }

    $('.row-journals').show();
    $('#results').fadeIn();
    return;
}
