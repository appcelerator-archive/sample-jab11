view = function(model) {
    var win = new View({ id: 'AboutWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: 'Settings'
    }));

    Ti.Facebook.appid = String(constants.FacebookAppID);
    Ti.Facebook.permissions = ['publish_stream'];
    var fb = new LoginButton();
    win.add(fb);

    return win;
};