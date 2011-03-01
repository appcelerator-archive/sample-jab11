view = function(parentView) {
    var button = new Button({ className: 'HomeButton' });
    $(button).click(function() {
        TiAir.close(parentView);
    });
    return button;
};