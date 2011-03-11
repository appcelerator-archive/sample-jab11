view = function(model) {
    var win = new View({ id: 'VenueMapWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        title: 'Venue Map'
    }));
    win.add(Titanium.Map.createView({
        top: 45,
        mapType: Titanium.Map.STANDARD_TYPE,
        region: model.region,
        animate: true,
        regionFit: true,
        userLocation: true,
        annotations: [
            Titanium.Map.createAnnotation(model.annotation)
        ]
    }));
    return win;
};