view = function(model) {
    var bar = new View({
        className: (model.style || 'Black') + 'TitleBar TitleBar'
    });
    var positions = ['center', 'left', 'right'];
    for (var i = 0, l = positions.length; i < l; i++) {
        var position = positions[i], value = model[position];
        if (!value) {
            continue;
        }
        var obj = typeof value != 'string'
                ? value
                : new Label({
            text: value,
            className: (model.style || 'Black') + 'TitleBarText TitleBarText'
        });
        if (position != 'center') {
            obj[position] = 5;
        }

        bar.add(obj);
    }
    return bar;
};