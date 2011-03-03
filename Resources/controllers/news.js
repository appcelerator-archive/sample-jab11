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
                    news.create(defaultNews[i]);
                }
            }
            return news.find(id == undefined ? undefined : { id: id })
        },
        update: function(callback) {
            var xhr = new HTTPClient();

            xhr.onload = function() {
                try {
                    var response = JSON.parse(this.responseData);
                    if (response) {
                        var news = TiStorage().use('jab').collection('News');
                        news.clear();
                        var items = response.query.results.item;
                        for (var i = 0, l = items.length; i < l; i++) {
                            items[i].id = i;
                            news.create(items[i]);
                        }
                        callback(news.find());
                    } else {
                        callback({ error: 'The server is temporarily unavailable; please check your internet connection, and try again.' });
                    }
                }
                catch(err) {
                    callback({ error: err });
                }
            };
            xhr.onerror = function(e) {
                callback({ error: e });
            };
            // open the client
            function pad(num) {
                return num < 10 ? '0' + String(num) : num;
            }
            var n = new Date();
            var timestamp = '' + n.getUTCFullYear() + pad(n.getUTCMonth()+1) + pad(n.getUTCDate()) + pad(n.getUTCHours());
            xhr.open('GET', 'http://query.yahooapis.com/v1/public/yql?q=SELECT+*+FROM+feed+WHERE+url%3D%22http://jandbeyond.org/blog.feed%3Fexport%3Djson%3Ft%3D' + timestamp + '%22&format=json&callback=');
            xhr.send();
        }
    }
};