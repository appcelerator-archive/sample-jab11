view = function(model) {
    var win = new View({ id: 'JOSCARsView', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: 'JOSCARS'
    }));
    var scroll = new ScrollView({ id: 'JOSCARsScroll' });
    win.add(scroll);
    scroll.add(new ImageView({ id: 'JOSCARsBannerImage' }));
    scroll.add(new Label({ id: 'JOSCARsSubtitle' }));

    var textFields = [];

    for (var g = 0, gl = model.length; g < gl; g++) {
        var categories = model[g].categories;
        scroll.add(new Label({ text: model[g].group, className: 'JOSCARsGroup' }));
        for (var c = 0, cl = categories.length; c < cl; c++) {
            scroll.add(new Label({ text: categories[c].title, className: 'JOSCARsCategory' }));
            var category = new TextField({ className: 'JOSCARsText', id: categories[c].id });
            scroll.add(category);
            textFields.push(category);
        }
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
            AirView('notification', 'Please enter at least one nomination!');
        }
    });

    return win;
};