view = function(model) {
    var view = new ScrollView({ className: 'ListContainer' });

    for (var i = 0, l = model.rows.length; i < l; i++) {
        view.add(model.rows[i]);
    }

    $(view).click(function(evt) {
        if (evt.source.targetURL) {
            TiAir.openURL(evt.source.targetURL, evt);
        }
    });
    
    view.add(new ImageView({ className: 'TornEdge' }));

    return view;
};
