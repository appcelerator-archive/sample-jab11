view = function(model) {
    var win = new View({ id: 'AboutWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: 'Settings'
    }));

    // facebook
    Ti.Facebook.appid = String(constants.FacebookAppID);
    Ti.Facebook.permissions = ['publish_stream'];
    win.add(new LoginButton({ id: 'FacebookButton' }));

    // twitter
    var oAuthAdapter = new OAuthAdapter(constants.TwitterConsumerSecret, constants.TwitterConsumerKey, 'HMAC-SHA1');
    oAuthAdapter.loadAccessToken('twitter');
    var isAuthorized = oAuthAdapter.isAuthorized();
    var twitter = new Button({ id: 'TwitterButton', title: '      ' + (isAuthorized ? 'Logout' : 'Login') });
    twitter.add(new ImageView({ left: 10, className: 'SocialIconTwitter' }));
    win.add(twitter);
    $(twitter).click(function() {
        if (isAuthorized) {
            oAuthAdapter.clearAccessToken('twitter');
            isAuthorized = false;
            twitter.title = '      Login';
        }
        else {
            oAuthAdapter.showAuthorizeUI(
                    'https://api.twitter.com/oauth/authorize?' + oAuthAdapter.getRequestToken('https://api.twitter.com/oauth/request_token'),
                    function() {
                        oAuthAdapter.getAccessToken('https://api.twitter.com/oauth/access_token');
                        oAuthAdapter.saveAccessToken('twitter');
                        isAuthorized = true;
                        twitter.title = '      Logout';
                    });
        }
    });

    return win;
};