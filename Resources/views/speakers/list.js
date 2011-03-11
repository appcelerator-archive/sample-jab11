view = function(model) {
    return AirView('notImplemented');
    
    var win = new View({ id: 'SpeakersWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: '2011 Speakers'
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
            AirAction({
                controller: 'speakers',
                action: 'update',
                callback: function(response) {
                    if (response.error) {
                        callback();
                        AirView('notification', response.error);
                        error(response.error);
                    }
                    else {
                        callback(response);
                    }
                }
            });
        }
    });
    table.top = 45;
    win.add(table);
    return win;
};