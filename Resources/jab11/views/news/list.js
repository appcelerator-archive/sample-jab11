view = function(model) {
    var win = new View({ id: 'NewsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: 'Latest News'
    }));
    var rows = [];
    for (var i = 0, l = model.length; i < l; i++) {
        var item = model[i];
        rows.push(AirView('row', {
            title: item.title,
            subtitle: item.pubDate,
            targetURL: { controller: 'news', action: 'details', id: i, navigatorOptions: { animate: 'tabSlide' } }
        }));
    }
    var table = AirView('table', {
        rows: rows,
        update: function(callback) {
            // TODO: load from internet
            setTimeout(function() {
                callback({ rows: rows });
            }, 3000);
        }
    });
    table.top = 45;
    win.add(table);
    return win;
};