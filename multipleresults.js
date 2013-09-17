function show_results(json) {

    var results_count = json.header.numhits;

    //TODO: think a clever way
    if (results_count > 12) {
        results_count = 12;
    }

    col_size = 3;

    $('div.row.row-journals').remove();
    
    clean_results();

    var journals = shuffle(json.journals.journal);

    show_message('Multiple results found. Here are some of them. Select the appropriate one below (if any). <br/>' +
        'Otherwise, please disambiguate by either giving the full name or by inputting the ISSN number', 'info');

    $('#results').append('<div class="row row-journals"></div>');

    for (var i = 0; i < results_count; i++) {
        var journal_name = journals[i].jtitle;
        var journal_publisher = journals[i].romeopub;
        var journal_issn = journals[i].issn;

        if (i == 4 || i == 8 || i == 12) {
            $('<div class="row row-journals"></div>').insertAfter('div#results>div.row.row-journals:last-child');
        }

        $('div#results>div.row.row-journals:last-child').append('<div class="journal col-md-' + col_size + '" id=' + journal_issn + '>' +
            '<h3>' + journal_name + '</h3>' +
            '<h4>' + journal_publisher + '</h4></div>');
    }

    boxes = $('div.row-journals');
    var maxHeight = Math.max.apply(
        Math, boxes.map(function() {
            return $(this).height();
        }).get()
    );
    boxes.height(maxHeight);

    $('.row-journals').show();
    $('#results').fadeIn();
    return;
}
