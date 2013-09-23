function show_results(json) {

    var results_count = json.header.numhits;

    //TODO: think a clever way
    if (results_count > 12) {
        results_count = 12;
    }

    col_size = 3;

    $('div.row.row-journals').remove();
    clean_results();

    var journals;
    if (typeof json.journals.journal == 'undefined')
        journals = shuffle(json.publishers.publisher);
    else
        journals = shuffle(json.journals.journal);

    show_message('Multiple results found. Here are some of them. Select the appropriate one below (if any)', 'info');

    for (var i = 0; i < results_count; i++) {
        var journal_name;
        var journal_publisher;
        var journal_issn;

        if (typeof journals[i].jtitle == 'undefined'){
            journal_name = journal_publisher = journals[i].name;
            if (journals[i].alias != '')
                journal_publisher = journals[i].alias;
            journal_issn = journals[i].id;

        }else{
            journal_name = journals[i].jtitle;
            journal_publisher = journals[i].romeopub;
            journal_issn =  journals[i].issn;   
        }
        

        if (i == 0){
            $('#results').append('<div class="row row-journals"></div>');
        }

        if (i == 4 || i == 8 || i == 12) {
            $('<div class="row row-journals"></div>').insertAfter('div#results>div.row.row-journals:last-child');
        }

        $('div#results>div.row.row-journals:last-child').append('<div class="journal col-md-' + col_size + '" id=' + journal_issn + '>' +
            '<h3>' + journal_name + '</h3>' +
            '<h4>' + journal_publisher + '</h4><span style="display:none">'+ journal_issn +'</span></div>');
    }

    $('.row-journals').show();
    $('#results').fadeIn();
    return;
}
