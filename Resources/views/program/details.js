view = function(model) {
    var win = new View({ id: 'ProgramDetailsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Back' }),
        center: '2011 Speakers'
    }));
    var details = AirView('shared/details', {
        title: model.Title,
        subtitle: model.UserName,
        bodyHTML: (model.Details && model.Details.description)
                || 'The details for this particular talk have not been downloaded yet. Please go back to the list and hit the Refresh button in the top right.'
    });
    details.top = 45;
    win.add(details);
    return win;
};