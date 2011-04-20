view = function(model) {

    var win = new View({ id: 'ProgramDetailsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Back' }),
        center: '2011 Speakers'
    }));

    var notFoundMessage = 'The details for this particular talk have not been downloaded yet. Please go back to the list and hit the Refresh button in the top right.';
    var html = '<div class="mobileAppHeader">' + model.Title + '</div>'
            + '<div class="mobileAppSubtitle">Speaker: ' + model.UserName + '</div>'
            + ((model.Details && model.Details.description) || notFoundMessage);

    var date;
    switch (model.Day) {
        case 'Friday':
            date = 'Friday, 6th May 2011';
            break;
        case 'Saturday':
            date = 'Saturday, 7th May 2011';
            break;
        case 'Sunday':
            date = 'Sunday, 8th May 2011';
            break;
    }

    var details = AirView('shared/details', {
        title: model.Start + ' - ' + model.End,
        subtitle: date,
        bodyHTML: html
    });
    details.top = 45;


    var calendarButton = new Button({
        id: 'AddToCalendarButton',
        isOn: AirAction({ controller: 'program', action: 'isInMySchedule', gripPos: model.GripPos }) || false
    });

    function syncButtonUI() {
        $(calendarButton).applyStyle('Button', { className: 'AddToCalendarButton' + (calendarButton.isOn ? 'On' : 'Off') });
    }

    syncButtonUI();
    $(calendarButton).click(function() {
        calendarButton.isOn = !calendarButton.isOn;
        AirAction({
            controller: 'program', action: 'setMySchedule',
            gripPos: model.GripPos,
            val: calendarButton.isOn ? model : null
        });

        syncButtonUI();
    });
    details.add(calendarButton);

    win.add(details);
    return win;
};