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

            processQueue(to.pop());
        },
        postToFacebook: function(message, callback) {

            AirView('notification', 'Posting to Facebook...');

            var facebook = require('facebook');
            facebook.appid = String(constants.FacebookAppID);
            facebook.permissions = ['publish_stream'];
            facebook.authorize();

            /** IMAGE POST - Uncomment to try out **/
            // var img = Ti.UI.createImageView({
            // 	image: 'icontest.png'
            // });
            //
            // Ti.Facebook.request('photos.upload', { picture: img.toBlob() },function(e) {
            //    if (e.success) {
            //      alert('success!');
            //    }
            //    else {
            //      alert(e.error);
            //    }
            // });

            var data = {
                message: message,
                link: constants.Website
            };
            facebook.requestWithGraphPath('me/feed', data, 'POST', function (evt) {
                if (evt.success) {
                    AirView('notification', 'Posted to Facebook!');
                    callback(evt);
                } else {
                    if (evt.error) {
                        AirView('notification', 'Oops! Facebook says: ' + evt.error);
                        callback(evt);
                    } else {
                        AirView('notification', 'Facebook didn\'t respond properly.');
                        callback(evt);
                    }
                }
            });
        },
        postToTwitter: function(message, callback) {
            AirView('notification', 'Posting to Twitter...');

            var oAuthAdapter = new OAuthAdapter(
                    constants.TwitterConsumerSecret,
                    constants.TwitterConsumerKey,
                    'HMAC-SHA1');

            // load the access token for the service (if previously saved)
            oAuthAdapter.loadAccessToken('twitter');

            // consume a service API - in this case the status update by Twitter
            oAuthAdapter.send(
                    'https://api.twitter.com/1/statuses/update.json',
                    [
                        ['status', message]
                    ],
                    'Twitter',
                    function() {
                        AirView('notification', 'Posted to Twitter!');
                        callback();
                    },
                    function(err) {
                        AirView('notification', 'Oops! Twitter says: ' + err);
                        callback({ error: err });
                    });

            // if the client is not authorized, ask for authorization. the previous tweet will be sent automatically after authorization
            if (!oAuthAdapter.isAuthorized()) {
                // this function will be called as soon as the application is authorized
                var receivePin = function() {
                    // get the access token with the provided pin/oauth_verifier
                    oAuthAdapter.getAccessToken('https://api.twitter.com/oauth/access_token');
                    // save the access token
                    oAuthAdapter.saveAccessToken('twitter');
                };

                // show the authorization UI and call back the receive PIN function
                oAuthAdapter.showAuthorizeUI('https://api.twitter.com/oauth/authorize?'
                        + oAuthAdapter.getRequestToken('https://api.twitter.com/oauth/request_token'), receivePin);
            }
        },
        update: function(callback) {

            var db = TiStorage().use('jab');
            var posts = db.collection('SocialPosts');
            var settings = db.collection('SocialSettings');

            var queue = [ this.updateTwitter, this.updateFacebook ];

            var newPosts = [];

            (function processQueue() {
                var updateFunction = queue.pop();
                if (updateFunction) {
                    updateFunction(processQueue, db, posts, settings);
                }
                else {
                    posts.sort({ when: 1 });
                    newPosts.sort(function(a,b) {
                        if (a.when != b.when)
                        {
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
                        var response = JSON.parse(this.responseData);
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
            xhr.open('GET', constants.FacebookUpdateURL + '?since=' + lastUpdate.value);
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
                        var response = JSON.parse(this.responseData);
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
                                warn(newPost);
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
            xhr.open('GET', constants.TwitterUpdateURL + '&page=1&since_id=' + maxID.value + '#' + new Date().getTime());
            xhr.send();
        }
    }
};