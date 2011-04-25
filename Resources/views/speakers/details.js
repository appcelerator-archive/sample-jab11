view = function(model) {

    var win = new View({ id: 'SpeakerDetailsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Back' }),
        center: model.UserName
    }));

    var visible, views = { Sessions: null, Bio: null };

    var emailDialog = new EmailDialog();
    if (model.EmailAddress) {
        emailDialog.subject = 'Hi ' + model.UserName + '!';
        emailDialog.toRecipients = [ '"' + model.UserName + '" <' + model.EmailAddress + '>' ];
    }

    var secondBar = AirView('titleBar', {
        style: 'LighterGrey',
        left: AirView('segmentedPicker', {
            selectMultiple: false,
            allowNoneSelected: false,
            onSelect: function(evt) {
                var toShow = views[evt.source.text.text];
                if (toShow != visible) {
                    win.remove(visible);
                    win.add(visible = toShow);
                }
            },
            options: [
                new Label({ text: 'Sessions', className: 'SegmentedPickerText', selected: true }),
                new Label({ text: 'Bio', className: 'SegmentedPickerText', selected: false })
            ]
        }),
        right: (model.EmailAddress && emailDialog.isSupported()) ? AirView('button', {
            type: 'Email',
            callback: function() {
                emailDialog.open();
            }
        }) : null
    });
    secondBar.top = 42;
    win.add(secondBar);

    /*
     Create the "sessions" view.
     */
    function getSessions() {
        return AirView('program/myScheduleRows', {
            data: AirAction({ controller: 'program', action: 'getForSpeaker', userLink: model.UserLink }) || [],
            emptyTitle: 'No sessions for this speaker!',
            emptySubtitle: 'This speaker\'s sessions haven\'t been added yet.'
        });
    }

    function updateSessions(callback) {
        views.Sessions.updateRows({ rows: getSessions() });
        callback();
    }

    views.Sessions = AirView('table', {
        update: updateSessions,
        rows: getSessions()
    });
    views.Sessions.top = 86;

    /*
     Create the "bio" view.
     */
    var title = new View();
    if (model.ThumbnailURL) {
        title.add(title.image = new ImageView({ image: model.ThumbnailURL, className: 'SpeakerDetailsImage' }));
        cacheRemoteURL(title.image, model.ThumbnailURL);
        title.add(new ImageView({ className: 'SpeakerDetailsWithThumbnail' }));
    }
    else {
        title.add(new ImageView({ className: 'SpeakerDetailsNoThumbnail' }));
    }
    title.add(new Label({ text: model.UserName, className: 'SpeakerDetailsName' }));
    var noBioMessage = 'We don\'t have a biography for this speaker.';
    views.Bio = AirView('shared/details', {
        title: title,
        bodyHTML: model.BiographyHTML || noBioMessage,
        className: 'Speaker'
    });
    views.Bio.top = 86;

    // and start off with "sessions" visible
    win.add(visible = views.Sessions);

    return win;
};