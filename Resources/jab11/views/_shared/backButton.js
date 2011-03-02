view = function(parentView) {
    var button = new Button({ className: 'BackButton' });
    $(button).click(function() {
        TiAir.close(parentView);
    });
    return button;
};