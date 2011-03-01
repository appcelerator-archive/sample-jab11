view = function(model) {
    var win = new Window({ id: 'VenueMapWindow' });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: 'Venue Map'
    }));
    return win;
};