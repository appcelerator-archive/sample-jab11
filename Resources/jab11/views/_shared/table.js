view = function(model) {

    var data = [];
    for (var i = 0, l = model.rows.length; i < l; i++) {
        data.push(model.rows[i]);
    }
    if (i > 1) {
        data[i - 1].add(new ImageView({ className: 'TornEdge', bottom: -5 }));
    }

    var table = new TableView({ className: 'Table', data: data });

    $(table).click(function(evt) {
        if (evt.row && evt.row.targetURL) {
            TiAir.openURL(evt.row.targetURL, evt);
        }
    });

    return table;
};
