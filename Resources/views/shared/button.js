view = function(model) {
    var button = new Button({ className: model.type + 'Button Button' });
    $(button).click(model.callback || function() {
        TiAir.close(model.view);
    });
    return button;
};