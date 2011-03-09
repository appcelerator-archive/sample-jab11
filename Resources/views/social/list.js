view = function(model) {
    var view = new View({ id: 'SocialWindow', className: 'Window' });

    var rightView = new View({ layout: 'horizontal', width: 'auto', height: 'auto' });
    rightView.add(AirView('addCommentButton', function() {
        return AirView('notImplemented');
    }));
    rightView.add(AirView('refreshButton', function() {
        table.update(function() {
            alert('Updated!');
        });
    }));

    view.add(AirView('titleBar', {
        left: AirView('homeButton', view),
        title: 'Social',
        right: rightView
    }));

    function processRows(data) {
        var rows = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];

            var row = new TableViewRow({
                className: 'SocialRow Row',
                targetURL: { controller: 'social', action: 'details', id: i, navigatorOptions: { animate: 'tabSlide' } }
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
            AirAction({
                controller: 'social',
                action: 'update',
                callback: function(response) {
                    if (response.error) {
                        callback();
                        alert(response.error);
                    }
                    else {
                        callback(response);
                    }
                }
            });
        }
    });
    table.top = 45;
    view.add(table);

    return view;
};