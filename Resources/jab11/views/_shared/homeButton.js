view = function(win) {
    var button = new Button({ className: 'HomeButton' });
    $(button).click(function() {
        win.close();
    });
    return button;
};