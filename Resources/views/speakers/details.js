view = function(model) {

    var win = new View({ id: 'SpeakerDetailsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Back' }),
        center: '2011 Speakers'
    }));

    var secondBar = AirView('titleBar', {
        style: 'LighterGrey',
        center: AirView('segmentedPicker', {
            selectMultiple: false,
            allowNoneSelected: false,
            onSelect: function(evt) {
                // TODO: switch visible
            },
            options: [
                new Label({ text: 'Sessions', className: 'SegmentedPickerText', selected: true }),
                new Label({ text: 'Bio', className: 'SegmentedPickerText', selected: false })
            ]
        })
    });
    secondBar.top = 42;
    win.add(secondBar);

    var noBioMessage = 'We don\'t have a biography for this speaker.';

    var html = '<div class="mobileAppHeader">' + model.UserName + '</div>'
            + (model.BiographyHTML || noBioMessage);

    var details = AirView('shared/details', {
        title: 'TODO',
        subtitle: 'TODO',
        bodyHTML: html
    });
    details.top = 86;

    win.add(details);
    return win;
};