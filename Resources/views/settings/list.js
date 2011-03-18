view = function(model) {
    var win = new View({ id: 'AboutWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: 'Settings'
    }));
    return win;
};