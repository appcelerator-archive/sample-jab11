view = function(model) {
    var win = new View({ id: 'NewsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        title: 'Latest News',
        right: AirView('button', { type: 'Refresh', callback: function() {
            table.update();
        }})
    }));
    function processRows(data) {
        var rows = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            rows.push(AirView('row', {
                title: item.title,
                subtitle: item.pubDate,
                targetURL: { controller: 'news', action: 'details', id: i, navigatorOptions: { animate: 'tabSlide' } }
            }));
        }
        return rows;
    }

    var table = AirView('table', {
        rows: processRows(model),
        update: function(callback) {
            AirView('notification', 'Updating...');
            AirAction({
                controller: 'news',
                action: 'update',
                callback: function(response) {
                    if (response.error) {
                        callback();
                        AirView('notification', response.error);
                        error(response.error);
                    }
                    else {
                        callback(response);
                        AirView('notification', 'Last Updated: Just Now');
                    }
                }
            });
        }
    });
    table.top = 45;
    win.add(table);
    return win;
};