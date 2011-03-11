controller = {
    actions: {
        addComment: function() {
            return AirView();
        },
        comments: function() {
            return AirView();
        },
        details: function() {
            return AirView(this.get(id)[0]);
        },
        list: function() {
            return AirView('notImplemented');

            return AirView(this.get());
        },
        rate: function() {
            return AirView();
        },
        sessions: function() {
            return AirView();
        },
        get: function(id) {
            var items = TiStorage().use('jab').collection('Speakers');
            // if we don't have anything in our database, load in the default data.
            if (items.find().length == 0) {
                var defaultItems = AirModel('defaultSpeakers').query.results.item;
                for (var i = 0, l = defaultItems.length; i < l; i++) {
                    items.create(defaultItems[i]);
                }
            }
            return items.find(id == undefined ? undefined : { id: id })
        },
        update: function(callback) {
            var xhr = new HTTPClient();

            xhr.onload = function() {
                try {
                    var response = JSON.parse(this.responseData);
                    if (response) {
                        var items = TiStorage().use('jab').collection('Speakers');
                        items.clear();
                        var items = response.query.results.item;
                        for (var i = 0, l = items.length; i < l; i++) {
                            items.create(items[i]);
                        }
                        callback(items.find());
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