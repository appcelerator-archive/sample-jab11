view = function(model) {
    var win = new View({ id: 'ProgramDetailsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Back' }),
        center: '2011 Speakers'
    }));
    var details = AirView('shared/details', {
        title: model.Title,
        subtitle: model.UserName,
        bodyHTML: model.TitleLink
    });
    details.top = 45;
    win.add(details);
    return win;
};