view = function(model) {
    var win = new Window({ id: 'NewsWindow' });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: 'Latest News'
    }));
    var rows = [];
    for (var i = 0, l = model.query.results.item.length; i < l; i++) {
        var item = model.query.results.item[i];
        rows.push(AirView('row', {
            title: item.title,
            subtitle: item.pubDate,
            targetURL: { controller: 'news', action: 'details', index: i }
        }));
    }
    var table = AirView('table', {
        rows: rows,
        getRows: function(callback) {
            // TODO: load from internet
            setTimeout(function() {
                callback(rows);
            }, 3000);
        }
    });
    table.top = 45;
    win.add(table);
    return win;
};