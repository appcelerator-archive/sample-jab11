view = function(model) {

    var table = new TableView({ className: 'Table' });

    var handleDataCallback;

    table.updateRows = function(model) {
        if (model && model.rows) {
            var data = model.rows;
            if (model.rows.length > 0) {
                data[model.rows.length - 1].add(new ImageView({ className: 'TornEdge', bottom: -8 }));
            }
            table.setData(data);
        }
        if (handleDataCallback) {
            handleDataCallback();
        }
    };

    table.updateRows(model);

    $(table).click(function(evt) {
        if (evt.row && evt.row.targetURL) {
            TiAir.openURL(evt.row.targetURL, evt);
        }
    });

    table.update = function (callback) {
        handleDataCallback = callback;
        model.update(table.updateRows);
    };

    // pull to refresh?
    if (model.update) {
        AirView('pullToRefresh', {
            table: table,
            update: function (callback) {
                handleDataCallback = callback;
                model.update(table.updateRows);
            }
        });
    }

    return table;
};
