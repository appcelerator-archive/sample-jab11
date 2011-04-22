view = function(model) {
    var view = new View({ id: 'SocialWindow', className: 'Window' });

    var rightView = new View({ layout: 'horizontal', width: 'auto', height: 'auto' });
    rightView.add(AirView('button', { type: 'AddComment', callback: function(evt) {
        TiAir.openURL({
            controller: 'social', action: 'addComment',
            navigatorOptions: { animate: 'pop' }
        }, evt);
    }}));
    rightView.add(AirView('button', { type: 'Refresh', callback: function() {
        table.update();
    }}));

    view.add(AirView('titleBar', {
        left: AirView('button', { view: view, type: 'Home' }),
        center: 'Social',
        right: rightView
    }));

    function processRows(data) {
        var rows = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];

            var row = new TableViewRow({
                className: 'SocialRow Row',
                targetURL: { controller: 'social', action: 'details', id: item.id, navigatorOptions: { animate: 'tabSlide' } }
            });

            row.add(new ImageView({ className: 'SocialRowImage', image: item.imageURL }));
            row.add(new ImageView({ className: 'SocialIcon SocialIcon' + item.source }));
            row.add(new Label({ text: item.who, className: 'SocialRowTitle RowTitle' }));
            row.add(new Label({ text: toTimeElapsed(item.when), className: 'SocialRowWhen' }));
            row.add(new Label({ text: item.text, className: 'SocialRowSubtitle RowSubtitle' }));

            rows.push(row);
        }
        return rows;
    }

    var table = AirView('table', {
        rows: processRows(model.items),
        update: function(callback) {
            AirView('notification', { text: 'Updating...', id: 'Social' });
            AirAction({
                controller: 'social',
                action: 'update',
                callback: function(response) {
                    if (response.error) {
                        callback();
                        AirView('notification', { text: response.error, id: 'Social' });
                        error(response.error);
                    }
                    else {
                        AirView('notification', { text: 'Last Updated: Just Now', id: 'Social' });
                        callback({ rows: processRows(response) });
                    }
                }
            });
        }
    });
    table.top = 45;
    view.add(table);

    if (model.items.length == 0) {
        table.update();
    }


    AirView('getPhoto', {
        event: { media: Ti.Filesystem.getFile('content/images/icon.png') },
        callback: function(evt) {
            alert(evt);
        }
    });


    return view;
};