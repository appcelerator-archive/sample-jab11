view = function(model) {
    var win = new View({ id: 'NewsDetailsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Back' }),
        center: 'Latest News'
    }));
    var details = AirView('shared/details', {
        title: model.title,
        subtitle: model.pubDate,
        bodyHTML: model.description
    });
    details.top = 45;
    win.add(details);
    return win;
};