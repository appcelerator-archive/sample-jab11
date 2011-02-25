/**
 * Create the default list view.
 * @param model A dictionary with a conferenceDate and icons
 */
view = function(model) {
    // create views for each of our icons
    for (var i = 0, l = model.icons.length; i < l; i++) {
        model.icons[i].view = AirView('button', model.icons[i]);
    }
    // now create the main view; in this case, a window!
    var win = new Window({ id: 'DefaultWindow' });
    win.add(AirView('daysUntil', model.conferenceDate));
    win.add(AirView('gridWithDetails', {
        data: model.icons,
        id: 'DefaultGrid'
    }));
    return win;
};