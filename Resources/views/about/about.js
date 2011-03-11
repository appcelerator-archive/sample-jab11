view = function(model) {
    var win = new View({ id: 'AboutWindow', className: 'Window' });
    var sponsorsButton = new Button({ id: 'SponsorsButton' });
    $(sponsorsButton).click(function() {
        TiAir.openURL({ action: 'sponsors', controller: 'about' });
    });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
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