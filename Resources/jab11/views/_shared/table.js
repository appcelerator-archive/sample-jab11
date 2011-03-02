view = function(model) {

    var table = new TableView({ className: 'Table' });

    var handleDataCallback;

    function handleData(model) {
        var data = [];
        for (var i = 0, l = model.rows.length; i < l; i++) {
            data.push(model.rows[i]);
        }
        if (i > 1) {
            data[i - 1].add(new ImageView({ className: 'TornEdge', bottom: -5 }));
        }
        table.setData(data);
        if (handleDataCallback) {
            handleDataCallback();
        }
    }

    handleData(model);

    $(table).click(function(evt) {
        if (evt.row && evt.row.targetURL) {
            TiAir.openURL(evt.row.targetURL, evt);
        }
    });

    // pull to refresh?
    if (model.update) {
        AirView('pullToRefresh', {
            table: table,
            update: function (callback) {
                handleDataCallback = callback;
                model.update(handleData);
            }
        });
    }

    return table;
};
