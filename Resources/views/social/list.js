view = function(model) {
    var view = new View({ id: 'SocialWindow', className: 'Window' });

    var refreshButton = AirView('button', { type: 'Refresh', callback: function() {
        table.update();
    }});
    var rightView;
    if (!Ti.Android) {
        rightView = new View({ layout: 'horizontal', width: 90, height: 'auto' });
        // temporarily disable the "add comment" feature on Android
        // there are some OAuth issues preventing Facebook and Twitter from authorizing... :(
        rightView.add(AirView('button', { type: 'AddComment', callback: function(evt) {
            TiAir.openURL({
                controller: 'social', action: 'addComment',
                navigatorOptions: { animate: 'pop' }
            }, evt);
        }}));
        rightView.add(refreshButton);
    }
    else {
        rightView = refreshButton;
    }

    view.add(AirView('titleBar', {
        left: AirView('button', { view: view, type: 'Home' }),
        center: 'Social',
        right: rightView
    }));

    var rows = [];

    var iconStore = Ti.Filesystem.applicationDataDirectory + '/SocialIcons';
    var dir = Ti.Filesystem.getFile(iconStore);
    if (!dir.exists()) {
        dir.createDirectory();
    }

    function grabRowFromItem(item) {
        var row = new TableViewRow({
            className: 'SocialRow Row',
            item: item,
            targetURL: { controller: 'social', action: 'details', id: item.id, navigatorOptions: { animate: 'tabSlide' } }
        });

        if (item.imageURL) {
            row.add(row.socialImage = new ImageView({ className: 'SocialRowImage' }));
            cacheRemoteURL(row.socialImage, item.imageURL);
        }

        row.add(new ImageView({ className: 'SocialIcon SocialIcon' + item.source }));
        row.add(new Label({ text: item.who, className: 'SocialRowTitle RowTitle' }));
        row.add(row.whenLabel = new Label({ text: toTimeElapsed(item.when), className: 'SocialRowWhen' }));
        row.add(new Label({ text: item.text, className: 'SocialRowSubtitle RowSubtitle' }));
        return row;
    }

    function processRows(data) {
        for (var i = 0, l = data.length; i < l; i++) {
            rows.push(grabRowFromItem(data[i]));
        }
        return rows;
    }

    function insertAndUpdate(data) {
        // spin through the existing rows and update their timestamps
        for (var i = 0, l = rows.length; i < l; i++) {
            rows[i].whenLabel.text = toTimeElapsed(rows[i].item.when);
            rows[i].whenLabel.width = 'auto';
        }
        // and insert the new rows we have downloaded
        // note how we do this in reverse order!
        if (rows.length == 0) {
            for (var j = 0, k = data.length; j < k; j++) {
                rows.push(grabRowFromItem(data[j]));
            }
            table.updateRows({ rows: rows });
        }
        else {
            for (var m = data.length - 1; m >= 0; m--) {
                var row = grabRowFromItem(data[m]);
                table.insertRowBefore(0, row);
                rows.unshift(row);
            }
        }
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
                        insertAndUpdate(response);
                        callback();
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


    return view;
};