controller = {
    actions: {
        list: function() {
            return AirView(this.get());
        },
        details: function(id) {
            return AirView(this.get(id)[0]);
        },
        get: function(id) {
            var news = TiStorage().use('jab').collection('News');
            // if we don't have anything in our database, load in the default data.
            if (news.find().length == 0) {
                var defaultNews = AirModel('defaultNewsList').query.results.item;
                for (var i = 0, l = defaultNews.length; i < l; i++) {
                    defaultNews[i].id = i;
                    defaultNews[i].description = defaultNews[i].description.replace(/K2Feed/gi,'item');
                    news.create(defaultNews[i]);
                }
            }
            return news.find(id == undefined ? undefined : { id: id });
        },
        update: function(callback) {

            var n = new Date();
            var timestamp = '' + n.getUTCFullYear() + toTwoDigits(n.getUTCMonth() + 1) + toTwoDigits(n.getUTCDate()) + toTwoDigits(n.getUTCHours());
            var query = 'SELECT * FROM feed WHERE url="http://jandbeyond.org/blog.feed?export=json?t=' + timestamp + '"';

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
                        items[i].description = items[i].description.replace(/K2Feed/gi,'item');
                        news.create(items[i]);
                    }
                    callback(news.find());
                }
            });
        }
    }
};