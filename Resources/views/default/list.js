/**
 * Create the default list view.
 * @param model A dictionary with a conferenceDate and icons
 */
view = function(model) {
    // create views for each of our icons
    for (var i = 0, l = model.icons.length; i < l; i++) {
        model.icons[i].view = new Button(model.icons[i]);
    }
    // now create the main view; in this case, a window!
    var view = new View({ id: 'DefaultView' });
    view.add(AirView('daysUntil', model.conferenceDate));
    view.add(AirView('gridWithDetails', {
        data: model.icons,
        id: 'DefaultGrid'
    }));
    return view;
};