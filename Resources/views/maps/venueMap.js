view = function() {
    var win = new View({ className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: 'Venue Map'
    }));
    var scroll = new ScrollView({
        top: 45,
        id: 'VenueMapScroll'
    });
    scroll.add(new ImageView({
        id: 'VenueMapImageView'
    }));
    win.add(scroll);
    scroll.zoomScale = scroll.minZoomScale;
    return win;
};