controller = {
    actions: {
        list: function() {
            var db = TiStorage().use('jab');
            var posts = db.collection('SocialPosts').find();
            var settings = db.collection('SocialSettings');
            for (var i = 0, l = posts.length; i < l; i++) {
                posts[i].targetURL = { controller: 'social', action: 'details', id: posts[i].id, navigatorOptions: { animate: 'tabSlide' } };
            }
            return AirView({
                lastUpdated: settings.findOne({ name: 'LastUpdated' }),
                items: posts
            });
        },
        addComment: function() {
            return AirView();
        },
        details: function(id) {
            var db = TiStorage().use('jab');
            var posts = db.collection('SocialPosts');
            return AirView(posts.findOne(id));
        },
        update: function(callback) {
            this.updateTwitter(callback);
        },
        updateFacebook: function(callback) {
            callback([]);
        },
        updateTwitter: function(callback) {
            var db = TiStorage().use('jab');
            var posts = db.collection('SocialPosts');
            var settings = db.collection('SocialSettings');

            var maxID = settings.findOne({ name: 'MaxID' }) || settings.create({ name: 'MaxID', value: 0 }).findOne({ name: 'MaxID' });

            var xhr = new HTTPClient();

            xhr.onload = function() {
                try {
                    var response = JSON.parse(this.responseData);
                    if (response) {
                        var items = response.results;
                        for (var i = 0, l = items.length; i < l; i++) {
                            posts.create({
                                imageURL: items[i].profile_image_url,
                                who: items[i].from_user,
                                text: items[i].text,
                                source: 'Twitter',
                                sourceID: items[i].id,
                                url: 'http://twitter.com/#!/' + items[i].from_user + '/status/' + items[i].id,
                                when: items[i].created_at
                            });
                        }
                        maxID.value = response.max_id_str;
                        settings.update(maxID.id, maxID);
                        callback(posts.find());
                    } else if (response.error) {
                        callback(response);
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
            xhr.open('GET', 'http://search.twitter.com/search.json?q=%23jab11%20OR%20@jandbeyond%20OR%20from%3Ajandbeyond&page=1&since_id=' + maxID.value);
            xhr.send();
        }
    }
};