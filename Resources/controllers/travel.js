controller = {
    actions: {
        list: function() {
            return AirView();
        },
        update: function(callback) {

            var n = new Date();
            var timestamp = '' + n.getUTCFullYear() + toTwoDigits(n.getUTCMonth() + 1) + toTwoDigits(n.getUTCDate()) + toTwoDigits(n.getUTCHours());
            var query = 'SELECT title, description FROM feed WHERE url="http://jandbeyond.org/information.feed?export=json?t=' + timestamp + '" and guid="http://jandbeyond.org/information/Travelling.html"';

            Ti.Yahoo.yql(query, function(response) {
                if (!response.success) {
                    callback({ error: response.message });
                }
                else {
                    var data = response.data;
                    var news = TiStorage().use('jab').collection('News');
                    news.clear();
                    var items = data.item;
                    for (var i = 0, l = items.length; i < l; i++) {
                        items[i].id = i;
                        news.create(items[i]);
                    }
                    callback(news.find());
                }
            });

        }
    }
};