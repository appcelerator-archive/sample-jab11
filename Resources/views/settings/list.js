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
    var twitter = new Button({ id: 'TwitterButton', title: '       ' + (oauthWrapper.isAuthorized() ? 'Logout' : 'Login') });
    twitter.add(new ImageView({ left: 10, className: 'SocialIconTwitter' }));
    win.add(twitter);
    $(twitter).click(function() {
        if (oauthWrapper.isAuthorized()) {
            oauthWrapper.deAuthorize();
            twitter.title = '      Login';
        }
        else {
            oauthWrapper.authorize(function() {
                twitter.title = '      Logout';
            });
        }
    });

    return win;
};