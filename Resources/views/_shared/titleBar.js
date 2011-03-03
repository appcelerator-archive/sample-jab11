view = function(model) {
    var bar = new View({
        className: 'TitleBar'
    });
    if (model.title) {
        bar.add(new Label({
            text: model.title,
            className: 'TitleBarTitle'
        }));
    }
    if (model.left) {
        model.left.left = 5;
        bar.add(model.left);
    }
    if (model.right) {
        model.right.right = 5;
        bar.add(model.right);
    }
    return bar;
};