view = function() {
    var win = new View({ className: 'Window' });
    var map = new ImageView({
        id: 'VenueMapImageView'
    });
    // Android doesn't support panning and pinching scroll views, so we'll add the image directly
    if (Ti.Android) {
        win.add(map);
    }
    else {
        var scroll = new ScrollView({
            top: 45,
            id: 'VenueMapScroll'
        });
        scroll.add(map);
        win.add(scroll);
        scroll.zoomScale = scroll.minZoomScale;
    }
    // Note that we add the title bar last so that it will be on top of the map
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: 'Venue Map'
    }));
    return win;
};