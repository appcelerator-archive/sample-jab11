/**
 * Create the days until view.
 * @param model A dictionary with a conferenceDate and icons
 */
view = function(model) {
    var view = new View({ className: 'DaysUntil' });
    var daysUntil = Math.floor((model.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    view.add(new Label({ className: 'DaysUntilNumber', text: daysUntil.toString() }));
    view.add(new Label({ className: 'DaysUntilLabel', text: 'Days Until...' }));
    return view;
};