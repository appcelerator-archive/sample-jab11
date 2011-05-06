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
            return AirView({ text: constants.DefaultComment });
        },
        getPhoto: function(event, callback) {
            return AirView({ event: event, callback: callback });
        },
        details: function(id) {
            var db = TiStorage().use('jab');
            var posts = db.collection('SocialPosts');
            return AirView(posts.findOne(id));
        },
        post: function(to, message, callback) {
            function processQueue(postTo) {
                controller.actions['postTo' + postTo](message, function(response) {
                    if (response && response.error) {
                        callback(response);
                    }
                    else if (to.length) {
                        processQueue(to.pop());
                    }
                    else {
                        callback({ success: true });
                    }
                });
            }

            processQueue(to.shift());
        },
        postToFacebook: function(message, callback) {

            AirView('notification', { text: 'Posting to Facebook...', id: 'PostToFacebook' });

            Ti.Facebook.appid = String(constants.FacebookAppID);
            Ti.Facebook.permissions = ['publish_stream'];
            Ti.Facebook.authorize();

            var data = {
                message: message,
                link: constants.Website
            };
            Ti.Facebook.requestWithGraphPath('me/feed', data, 'POST', function (evt) {
                if (evt.success) {
                    AirView('notification', { text: 'Posted to Facebook!', id: 'PostToFacebook' });
                    callback(evt);
                } else {
                    if (evt.error) {
                        AirView('notification', { text: 'Oops! Facebook says: ' + evt.error, id: 'PostToFacebook' });
                        callback(evt);
                    } else {
                        AirView('notification', { text: 'Facebook didn\'t respond properly.', id: 'PostToFacebook' });
                        callback(evt);
                    }
                }
            });
        },
        postToTwitter: function(message, callback) {
            AirView('notification', { text: 'Posting to Twitter...', id: 'PostToTwitter' });

            oauthWrapper.sendToTwitter({
                message: message,
                success: function() {
                    AirView('notification', { text: 'Posted to Twitter!', id: 'PostToTwitter' });
                    callback();
                },
                error: function(err) {
                    AirView('notification', { text: 'Oops! Twitter says: ' + err, id: 'PostToTwitter' });
                    callback({ error: err });
                }
            });
        },
        update: function(callback) {

            var db = TiStorage().use('jab');
            var posts = db.collection('SocialPosts');
            var settings = db.collection('SocialSettings');

            var queue = [ this.updateTwitter, this.updateFacebook ];

            var newPosts = [];

            (function processQueue(data) {
                var updateFunction = queue.pop();
                if (data) {
                    newPosts = newPosts.concat(data);
                }
                if (updateFunction) {
                    updateFunction(processQueue, db, posts, settings);
                }
                else {
                    posts.sort({ when: 1 });
                    newPosts.sort(function(a, b) {
                        if (a.when != b.when) {
                            return (a.when < b.when) ? 1 : -1;
                        }
                        return 0;
                    });
                    callback(newPosts);
                }
            })();

        },
        updateFacebook: function(callback, db, posts, settings) {
            db = db || TiStorage().use('jab');
            posts = posts || db.collection('SocialPosts');
            settings = settings || db.collection('SocialSettings');

            var lastUpdate = settings.findOne({ name: 'LastFBUpdate' }) || settings.create({ name: 'LastFBUpdate', value: 0 }).findOne({ name: 'LastFBUpdate' });

            var newPosts = [];
            var xhr = new HTTPClient({
                onload: function() {
                    try {
                        var response = JSON.parse(this.responseText);
                        if (response) {
                            var items = response.data;
                            for (var i = 0, l = items.length; i < l; i++) {
                                var newPost = {
                                    imageURL: items[i].picture,
                                    who: items[i].from.name,
                                    text: items[i].message,
                                    source: 'Facebook',
                                    sourceID: items[i].id,
                                    url: items[i].link,
                                    when: parseISODate(items[i].created_time.split('+')[0]).getTime()
                                };
                                posts.create(newPost);
                                newPosts.push(newPost);
                            }
                            lastUpdate.value = parseInt(new Date().getTime() / 1000);
                            settings.update(lastUpdate.id, lastUpdate);
                            callback(newPosts);
                        } else if (response.error) {
                            callback(response);
                        } else {
                            callback({ error: 'The server is temporarily unavailable; please check your internet connection, and try again.' });
                        }
                    }
                    catch(err) {
                        callback({ error: err });
                    }
                },
                onerror: function(e) {
                    callback({ error: e });
                }
            });
            xhr.open('GET', constants.FacebookUpdateURL + '?since=' + ((lastUpdate && lastUpdate.value) || 0));
            xhr.send();
        },
        updateTwitter: function(callback, db, posts, settings) {
            db = db || TiStorage().use('jab');
            posts = posts || db.collection('SocialPosts');
            settings = settings || db.collection('SocialSettings');

            var maxID = settings.findOne({ name: 'MaxID' }) || settings.create({ name: 'MaxID', value: 0 }).findOne({ name: 'MaxID' });

            var newPosts = [];

            var xhr = new HTTPClient({
                onload: function() {
                    try {
                        var response = JSON.parse(this.responseText);
                        if (response) {
                            var items = response.results;
                            for (var i = 0, l = items.length; i < l; i++) {
                                var newPost = {
                                    imageURL: items[i].profile_image_url,
                                    who: items[i].from_user,
                                    text: items[i].text,
                                    source: 'Twitter',
                                    sourceID: items[i].id,
                                    url: 'http://twitter.com/#!/' + items[i].from_user + '/status/' + items[i].id,
                                    when: new Date(items[i].created_at).getTime()
                                };
                                posts.create(newPost);
                                newPosts.push(newPost);
                            }
                            maxID.value = response.max_id_str;
                            settings.update(maxID.id, maxID);
                            callback(newPosts);
                        } else if (response.error) {
                            callback(response);
                        } else {
                            callback({ error: 'The server is temporarily unavailable; please check your internet connection, and try again.' });
                        }
                    }
                    catch(err) {
                        callback({ error: err });
                    }
                },
                onerror: function(e) {
                    callback({ error: e });
                }
            });
            xhr.open('GET', constants.TwitterUpdateURL + '&page=1&since_id=' + ((maxID && maxID.value) || 0) + '#' + new Date().getTime());
            xhr.send();
        }
    }
};