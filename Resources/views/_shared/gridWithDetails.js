view = function(model) {
    if (!model.data || model.data.length == 0) {
        throw 'gridWithDetails.js :: No data array provided in the passed in model, or the array was empty!';
    }
    model.layout = model.layout || 'horizontal';
    var grid = new View(model);

    $(grid).click(function(evt) {
        if (evt.source.targetURL) {
            TiAir.openURL(evt.source.targetURL, evt);
        }
    });

    for (var i = 0, l = model.data.length; i < l; i++) {
        var view = model.data[i].view;
        if (model.data[i].targetURL) {
            view.targetURL = model.data[i].targetURL;
        }
        grid.add(view);
    }
    return grid;
};
