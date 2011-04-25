view = function(model) {
    var win = new View({ id: 'SponsorsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: 'Sponsors'
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