function restriction_icon(rule){
    if (rule == "can")
        return "icon-smile";
    if (rule == "cannot")
        return "icon-frown";
    if (rule == "restricted")
        return "icon-meh";
    if (rule == "unclear")
        return "icon-question";
    
    return "icon-exclamation";
};

function show_permission(eprint, permission){
    $('div#journalallows > div#'+eprint+' > h1').attr("class", restriction_icon(permission));
    $('div#journalallows > div#'+eprint+' > h1').show();
    $('div#journalallows > div#'+eprint+' > h4.permission.'+permission).show();
    $('div#journalallows > div#'+eprint+' > p').show();
    $('div#journalallows > div#'+eprint).show();
}

function show_conditions(conditions){
    var conditions_html = '';
    for (condition in conditions){
        var condition_html = '<h4>'+conditions[condition]+'</h4>';
        conditions_html += condition_html;
    }
    $('div.conditions').append(conditions_html);
    $('div.additionalinfo').show();
}

function show_copyrightlinks(copyrightlinks){
    for (link in copyrightlinks){
        $('div.journalcopyrightlinks').append('<h4><a href="'+ copyrightlinks[link].copyrightlinkurl +'">'+ copyrightlinks[link].copyrightlinktext +'</a></h4>');    
    }
    $('div#journalmorerights').show();

}

function show_disclaimer(){
    $('div#journaldisclaimer').show();
}

function show_info(conditions, copyrightlinks){
    show_conditions(conditions);
    show_copyrightlinks(copyrightlinks);
    show_disclaimer();
}

function show_result(json){
    clean_results();
    try{
        var journal_name;
        var journal_publisher;
        var journal_issn;
        var copyrightlinkurl;

        if (typeof json.journals.journal == 'undefined'){
            journal_name = journal_publisher = journal_issn = json.publishers.publisher.name;
            $('#journalname').text(journal_name);
            $('#journalpublisher').text('Publisher\'s default policies.');
            $('#journalissn').text('Individual journals\' rights may be different.');
            copyrightlinkurl = 'http://www.sherpa.ac.uk/romeo/pub/'+ json.publishers.publisher.id +'/';
        }else{
            var journal = json.journals.journal;
            var journal_name = journal.jtitle;
            var journal_publisher = journal.romeopub;
            var journal_issn = journal.issn;

            $('#journalname').text(journal_name);
            $('#journalpublisher').text('Publisher: ' + journal_publisher);
            $('#journalissn').text('ISSN: ' + journal_issn);

            copyrightlinkurl = 'http://www.sherpa.ac.uk/romeo/issn/'+ journal_issn +'/';
        }



        var publisher = json.publishers.publisher;

        var preprint = publisher.preprints.prearchiving;
        var postprint = publisher.postprints.postarchiving;
        var pdfarchiving = publisher.pdfversion.pdfarchiving;

        show_permission('preprint',preprint);
        show_permission('postprint',postprint);
        show_permission('pdfarchiving',pdfarchiving);

        var conditions = json.publishers.publisher.conditions.condition;
        var copyrightlinks = json.publishers.publisher.copyrightlinks.copyrightlink

        var journal_sherparomeo = {
            copyrightlinktext : 'SHERPA/RoMEO entry',
            copyrightlinkurl : copyrightlinkurl
        };

        if(!$.isArray(copyrightlinks)){
            copyrightlinks = [copyrightlinks];
        }
        copyrightlinks.unshift(journal_sherparomeo);
        show_info(conditions, copyrightlinks);

        $('#journalheaders').show();
        $('#journalallows').show();
        $('#results').fadeIn();
    }catch(TypeError){
        clean_results();
        show_message('Although this record exists in SHERPA/RoMEO, it has not been evaluated yet. Please try again in a few weeks.','danger');
    }
}