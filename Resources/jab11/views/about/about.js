/**
 * Create the default list view.
 * @param model A dictionary with a conferenceDate and icons
 */
view = function(model) {
    var win = new Window({ id: 'AboutWindow' });
    win.add(AirView('details', model));
    return win;
};