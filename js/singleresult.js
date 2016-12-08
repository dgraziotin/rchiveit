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

function showPermission(eprint, archiving, restrictions) {
    $('div#journal-allows > div#' + eprint + ' > h1').attr("class", restrictionIconCSSClass(archiving));
    $('div#journal-allows > div#' + eprint + ' > h1').show();
    $('div#journal-allows > div#' + eprint + ' > h4.permission.' + archiving).show();
    if (restrictions) {
        var restrictions_html = '';
        if ($.isArray(restrictions)) {
            jQuery.each(restrictions, function(i, val) {
                if (val)
                    restrictions_html += '<li>' + val + '</li>'
            });
        } else {
            if (restrictions)
                restrictions_html = '<li>' + restrictions + '</li>';
        }
        if (restrictions_html)
            $('div#journal-allows > div#' + eprint + ' > div.permission.' + archiving).show().html('<h4>Subject to the following restrictions</h4><ul class="restrictions">' + restrictions_html + '</ul>');
    }
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
    var link;
    for (link in copyrightlinks) {
        $('div.journal-copyright-links').append('<h4><a href="' + copyrightlinks[link].copyrightlinkurl + '">' + copyrightlinks[link].copyrightlinktext + '</a></h4>');
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

            var hash = getHashFromLocationBar();

            if (isPublisherDisambiguer(hash)) {
                var disambiguer = publisherDisambiguer(hash);
                var cleanPublisherName = journalPublisher.replace(/\s+/g, '+').toLowerCase();
                var permalink = window.location.origin + '/#' + cleanPublisherName + '-' + disambiguer;
                $('#journal-permalink').html('Permalink to this entry: <input type="text" id="permalink" class="form-control" style="width:70%;display:inline" value="' + permalink + '" readonly="readonly">');
            } else {
                var cleanPublisherName = journalPublisher.replace(/\s+/g, '+').toLowerCase();
                var permalink = window.location.origin + '/#' + cleanPublisherName;
                $('#journal-permalink').html('Permalink to this entry: <input type="text" id="permalink" class="form-control" style="width:70%;display:inline" value="' + permalink + '" readonly="readonly">');
            }

        } else {

            var journal = json.journals.journal;
            journalName = journal.jtitle;
            journalPublisher = journal.romeopub;
            journalISSN = journal.issn;

            $('#journal-name').text(journalName);
            $('#journal-publisher').text('Publisher: ' + journalPublisher);
            $('#journal-issn').text('ISSN: ' + journalISSN);
            var permalink = window.location.origin + '/#' + journalISSN;

            $('#journal-permalink').html('Permalink to this entry: <input type="text" id="permalink" class="form-control" style="width:70%;display:inline" value="' + permalink + '" readonly="readonly">');
            copyrightLinkURL = 'http://www.sherpa.ac.uk/romeo/issn/' + journalISSN + '/';
        }

        if ($.isArray(json.publishers.publisher)) {
            json.publishers.publisher = json.publishers.publisher[0];
        }

        var publisher = json.publishers.publisher;

        var preprint = publisher.preprints.prearchiving;
        var preprint_restrictions = publisher.preprints.prerestrictions.prerestriction || null;

        var postprint = publisher.postprints.postarchiving;
        var postprint_restrictions = publisher.postprints.postrestrictions.postrestriction || null;

        var pdfarchiving = publisher.pdfversion.pdfarchiving;
        var pdfarchiving_restrictions = publisher.pdfversion.pdfrestrictions.pdfrestriction || null;


        showPermission('preprint', preprint, preprint_restrictions);
        showPermission('postprint', postprint, postprint_restrictions);
        showPermission('pdfarchiving', pdfarchiving, pdfarchiving_restrictions);

        var conditions = json.publishers.publisher.conditions.condition;
        var copyrightlinks = json.publishers.publisher.copyrightlinks.copyrightlink;

        var journalSherpaRomeoLink = {
            copyrightlinktext: 'SHERPA/RoMEO entry',
            copyrightlinkurl: copyrightLinkURL
        };

        if (!$.isArray(copyrightlinks)) {
            copyrightlinks = [copyrightlinks];
        }

        copyrightlinks.unshift(journalSherpaRomeoLink);
        showInfo(conditions, copyrightlinks);

        $('#journal-headers').show();
        $('#journal-allows').show();
        $('#results').fadeIn();

    } catch (error) {
        console.log(error);
        cleanResults();
        showMessage('Although this record exists in SHERPA/RoMEO, it has not been evaluated yet. Please try again in a few weeks.', 'danger');
    }
}
