function restrictionIconCSSClass(rule) {
    if (rule == "can")
        return "icon-smile";
    if (rule == "cannot")
        return "icon-frown";
    if (rule == "restricted")
        return "icon-meh";
    if (rule == "unclear")
        return "icon-question";
    return "icon-exclamation";
}

function showPermission(eprint, permission) {
    $('div#journal-allows > div#' + eprint + ' > h1').attr("class", restrictionIconCSSClass(permission));
    $('div#journal-allows > div#' + eprint + ' > h1').show();
    $('div#journal-allows > div#' + eprint + ' > h4.permission.' + permission).show();
    $('div#journal-allows > div#' + eprint + ' > p').show();
    $('div#journal-allows > div#' + eprint).show();
}

function showPublisherConditions(conditions) {
    var conditionsHTML = '';
    for (var condition in conditions) {
        var conditionHTML = '<h4>' + conditions[condition] + '</h4>';
        conditionsHTML += conditionHTML;
    }
    $('div.conditions').append(conditionsHTML);
    $('div.additional-info').show();
}

function showFurtherInfoLinks(copyrightlinks) {
    for (var link in copyrightlinks) {
        $('div.journal-copyright-links').append('<h4><a href="' + copyrightlinks[link].URL + '">' + copyrightlinks[link].text + '</a></h4>');
    }
    $('div#journal-more-rights').show();

}

function showDisclaimer() {
    $('div#journal-disclaimer').show();
}

function showInfo(conditions, copyrightlinks) {
    showPublisherConditions(conditions);
    showFurtherInfoLinks(copyrightlinks);
    showDisclaimer();
}

function showResult(json) {
    cleanResults();
    try {
        var journalName;
        var journalPublisher;
        var journalISSN;
        var copyrightLinkURL;

        if (typeof json.journals.journal == 'undefined') {
            journalName = journalPublisher = journalISSN = json.publishers.publisher.name;
            $('#journal-name').text(journalName);
            $('#journal-publisher').text('Publisher\'s default policies.');
            $('#journal-issn').text('Individual journals\' rights may be different.');
            copyrightLinkURL = 'http://www.sherpa.ac.uk/romeo/pub/' + json.publishers.publisher.id + '/';
        } else {

            var journal = json.journals.journal;
            journalName = journal.jtitle;
            journalPublisher = journal.romeopub;
            journalISSN = journal.issn;

            $('#journal-name').text(journalName);
            $('#journal-publisher').text('Publisher: ' + journalPublisher);
            $('#journal-issn').text('ISSN: ' + journalISSN);

            copyrightLinkURL = 'http://www.sherpa.ac.uk/romeo/issn/' + journalISSN + '/';
        }


        var publisher = json.publishers.publisher;

        var preprint = publisher.preprints.prearchiving;
        var postprint = publisher.postprints.postarchiving;
        var pdfarchiving = publisher.pdfversion.pdfarchiving;

        showPermission('preprint', preprint);
        showPermission('postprint', postprint);
        showPermission('pdfarchiving', pdfarchiving);

        var conditions = json.publishers.publisher.conditions.condition;
        var copyrightlinks = json.publishers.publisher.copyrightlinks.copyrightlink;

        var journalSherpaRomeoLink = {
            text: 'SHERPA/RoMEO entry',
            URL: copyrightLinkURL
        };

        if (!$.isArray(copyrightlinks)) {
            copyrightlinks = [copyrightlinks];
        }
        copyrightlinks.unshift(journalSherpaRomeoLink);
        showInfo(conditions, copyrightlinks);

        $('#journal-headers').show();
        $('#journal-allows').show();
        $('#results').fadeIn();
    } catch (TypeError) {
        cleanResults();
        showMessage('Although this record exists in SHERPA/RoMEO, it has not been evaluated yet. Please try again in a few weeks.', 'danger');
    }
}