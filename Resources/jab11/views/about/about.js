view = function(model) {
    var win = new Window({ id: 'AboutWindow' });
    var sponsorsButton = new Button({ id: 'SponsorsButton' });
    $(sponsorsButton).click(function() {
        TiAir.openURL({ action: 'sponsors', controller: 'about' });
    });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: 'About',
        right: sponsorsButton
    }));
    var details = AirView('details', {
        title: model.title,
        subtitle: model.subtitle,
        bodyHTML: model.bodyHTML
    });
    details.top = 45;
    win.add(details);
    return win;
};