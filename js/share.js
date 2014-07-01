function share() {

    $('div.share42init').remove();

    if ($(window).width() < MIN_WIDTH_FOR_SHARE_WIDGET)
        return;

    var hash = getHashFromLocationBar();
    var permalink = 'http://rchive.it';

    if (hash) {

        permalink = window.location.origin + '/#' + hash.replace(/\s+/g, '+');
        var journalName = $('h1#journal-name').text();

        document.title = 'Q: How to self-archive ' + journalName + ' #research articles to make them #openaccess? A: ';

        $('<div class="share42init" '
          + 'data-top1="408" '
          + 'data-top2="60" '
          + 'data-margin="5" ' 
          + 'data-path="/bower_components/share42/" '
          + 'data-icons-file="icons.png" '
          + 'data-url="' + permalink +  '" '
          + 'data-title="' + document.title + '"> '
          + 'data-description="' + document.title + '"> '
          + '</div>').insertAfter('div.container');


    } else {

        document.title = 'How can I self-archive my #research article? #openaccess #openscience';
        
        $('<div class="share42init" '
          + 'data-top1="408" '
          + 'data-top2="60" '
          + 'data-margin="5" ' 
          + 'data-path="/bower_components/share42/" '
          + 'data-icons-file="icons.png" '
          + 'data-title="' + document.title + '"> '
          + 'data-description="' + document.title + '"> '
          + '</div>').insertAfter('div.container');
    }


    setTimeout(function() {
        jQuery.getScript('http://rchive.site/bower_components/share42/share42.js');
    }, 10);


}

