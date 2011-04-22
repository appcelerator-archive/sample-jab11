view = function(model) {

    var image = model.event.media;


    var oAuthAdapter = new OAuthAdapter(
            constants.TwitterConsumerSecret,
            constants.TwitterConsumerKey,
            'HMAC-SHA1');
    oAuthAdapter.loadAccessToken('twitter');

    oAuthAdapter.send(
            'http://api.twitpic.com/2/upload.json',
            [
                ['key', constants.TwitPicKey],
                ['message', '#jab11'],
                ['media', image]
            ],
            'Twitter',
            function() {
                AirView('notification', 'Posted to TwitPic!');
                //callback();
            },
            function(err) {
                AirView('notification', 'Oops! TwitPic says: ' + err);
                //callback({ error: err });
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

    function uploadImage() {
        var window = new Window({ id: 'Notification', bottom: 10, height: 60 });
        var view = new View({ id: 'NotificationView', height: 60, layout: 'vertical' });
        window.add(view);
        window.open();

        var ani = new Animation({ id: 'NotificationOutAnimation' });

        function closeWindow() {
            window.close(ani);
        }

        $(window).click(closeWindow);

        view.add(new Label({ id: 'NotificationLabel', text: 'Uploading to TwitPic...', top: 10 }));
        var progress = new ProgressBar({
            width: 200, height: 20,
            top: 5,
            min: 0, max: 1, value: 0
        });
        view.add(progress);
        progress.show();

        var xhr = new HTTPClient({
            timeout: 20000,
            onerror: function(e) {
                Ti.UI.createAlertDialog({title:'Error', message:e.error}).show();
                info('IN ERROR ' + e.error);

                //window.close();
            },
            onload: function(e) {
                info(this.responseData);
                //http://twitpic.com/show/mini/<image-id>
                //window.close();
            },
            onsendstream: function(e) {
                progress.value = e.progress;
                info('ONSENDSTREAM - PROGRESS: ' + e.progress);
            }
        });
        /*xhr.open('POST', 'http://api.twitpic.com/2/upload.json');
         xhr.send(xhrargs = {
         media: image,
         message: '#jab11',
         key: constants.TwitPicKey,
         consumer_token: constants.TwitterConsumerKey,
         consumer_secret: constants.TwitterConsumerSecret,
         oauth_token: oAuthAdapter.getOAuthToken(),
         oauth_secret: oAuthAdapter.getOAuthTokenSecret()
         });
         */
    }
};