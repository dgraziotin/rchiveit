function share() {

    $('#share').empty();

    if ($(window).width() < MIN_WIDTH_FOR_SHARE_WIDGET)
        return;

    var hash = getHashFromLocationBar();
    var permalink = 'http://rchive.it';

    if (hash) {

        permalink = window.location.origin + '/#' + hash.replace(/\s+/g, '+');
        var journalName = $('h1#journal-name').text();

        document.title = 'How can I self-archive my ' + journalName + ' #research article? ' + ' #openaccess';

    } else {

        document.title = 'How can I self-archive my #research article? #openaccess #openscience';
    }

    $('#share').share({
        networks: ['twitter', 'facebook', 'googleplus', 'linkedin', 'reddit', 'tumblr', 'pinterest', 'stumbleupon', 'email'],
        orientation: 'vertical',
        affix: 'left center',
        urlToShare: permalink,
    });

}