view = function(model) {
    var view = new View({ id: 'SocialDetailsView', className: 'Window' });
    view.add(AirView('titleBar', {
        left: AirView('backButton', view),
        title: 'Details'
    }));

    var parser = new HTMLParser(model.text);
    parser.linkifyURLs();
    parser.linkifyHashTags();
    parser.linkifyMentions();
    var html = parser.getHTML();

    var details = AirView('shared/details', {
        title: model.who,
        subtitle: toTimeElapsed(model.when),
        bodyHTML: html
    });
    details.top = 45;
    view.add(details);
    return view;
};