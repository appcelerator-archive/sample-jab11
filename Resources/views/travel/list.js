view = function(model) {
    var view = new View({ id: 'TravelWindow', className: 'Window' });
    view.add(AirView('titleBar', {
        left: AirView('button', { view: view, type: 'Home' }),
        center: 'Travel',
        right: AirView('button', {
            type: 'Refresh',
            callback: function() {
                return AirView('notImplemented');
            }
        })
    }));
    var details = AirView('shared/details', {
        title: model.title,
        subtitle: model.pubDate,
        bodyHTML: model.description
    });
    details.top = 45;
    view.add(details);
    return view;
};