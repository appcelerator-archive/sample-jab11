view = function(model) {
    var win = new View({ id: 'NewsWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: 'Latest News'
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
                controller: 'news',
                action: 'updateNews',
                callback: function(response) {
                    if (response.error) {
                        callback();
                        alert(response.error);
                    }
                    else {
                        var news = TiStorage().use('jab11').collection('News');
                        news.clear();
                        var items = response.query.results.item;
                        for (var i = 0, l = items.length; i < l; i++) {
                            items[i].id = i;
                            news.create(items[i]);
                        }
                        callback(news.find());
                    }
                }
            });
        }
    });
    table.top = 45;
    win.add(table);
    return win;
};