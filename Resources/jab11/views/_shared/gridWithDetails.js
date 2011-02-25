view = function(model) {
    if (!model.data || model.data.length == 0) {
        throw 'gridWithDetails.js :: No data array provided in the passed in model, or the array was empty!';
    }
    model.layout = model.layout || 'horizontal';
    var grid = new View(model);

    function curryClickHandler(data) {
        return function() {
            TiAir.openURL(data.targetURL);
        };
    }

    for (var i = 0, l = model.data.length; i < l; i++) {
        var view = model.data[i].view;
        if (model.data[i].targetURL) {
            view.targetURL = model.data[i].targetURL;
            view.addEventListener('click', curryClickHandler(model.data[i]));
        }
        grid.add(view);
    }
    return grid;
};
