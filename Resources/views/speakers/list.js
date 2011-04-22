view = function(model) {
    var view = new View({ id: 'SpeakersWindow', className: 'Window' });
    view.add(AirView('titleBar', {
        left: AirView('button', { view: view, type: 'Home' }),
        center: '2011 Speakers',
        right: AirView('button', { type: 'Refresh', callback: function() {
            table.update();
        }})
    }));
    function processRows(data) {
        var rows = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            rows.push(AirView('row', {
                title: item.UserName,
                targetURL: { controller: 'speakers', action: 'details', id: item.id, navigatorOptions: { animate: 'tabSlide' } }
            }));
        }
        return rows;
    }

    var table = AirView('table', {
        rows: processRows(model),
        update: function(callback) {
            AirView('notification', { text: 'Updating...', id: 'Speakers' });
            AirAction({
                controller: 'speakers',
                action: 'update',
                callback: function(response) {
                    if (response.error) {
                        callback();
                        AirView('notification', { text: response.error, id: 'Speakers' });
                        error(response.error);
                    }
                    else {
                        callback(response);
                        AirView('notification', { text: 'Last Updated: Just Now', id: 'Speakers' });
                    }
                }
            });
        }
    });
    table.top = 45;
    view.add(table);
    return view;
};