view = function(model) {
    var win = new View({ id: 'JOSCARsView', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        title: 'JOSCARS'
    }));
    var scroll = new ScrollView({ id: 'JOSCARsScroll' });
    win.add(scroll);
    scroll.add(new ImageView({ id: 'JOSCARsBannerImage' }));
    scroll.add(new Label({ id: 'JOSCARsSubtitle' }));

    var textFields = [];

    for (var i = 0, l = model.length; i < l; i++) {
        scroll.add(new Label({ text: model[i].title, className: 'JOSCARsCategory' }));
        var community = new TextField({ className: 'JOSCARsText' });
        scroll.add(community);
        textFields.push(community);
    }

    var submit = new Button({ id: 'JOSCARsSubmit' });
    scroll.add(submit);

    $(submit).click(function() {
        var atLeastOneFilledOut = false;

        for (var j = 0, k = textFields.length; j < k; j++) {
            if (textFields[j].value.trim().length) {
                atLeastOneFilledOut = true;
                break;
            }
        }

        if (atLeastOneFilledOut) {
            // TODO: hit web service
            return AirView('notImplemented');
        }
        else {
            AirView('notification', 'Oops! Please nominate at least one site!');
        }
    });

    return win;
};