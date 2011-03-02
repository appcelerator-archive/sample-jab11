view = function(model) {
    var win = new View({ id: 'VenueMapWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: 'Venue Map'
    }));
    win.add(Titanium.Map.createView({
        top: 45,
        mapType: Titanium.Map.STANDARD_TYPE,
        region: {
            latitude: 50.8683, longitude: 6.0818,
            latitudeDelta: 0.01, longitudeDelta: 0.01
        },
        animate: true,
        regionFit: true,
        userLocation: true,
        annotations: [
            Titanium.Map.createAnnotation({
                latitude: 50.8683,
                longitude: 6.0818,
                title: 'Rolduc Abbey',
                subtitle: 'Kerkrade, Netherlands',
                pincolor: Titanium.Map.ANNOTATION_RED,
                animate: true
            })
        ]
    }));
    return win;
};