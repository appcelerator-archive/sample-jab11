view = function(callback) {
    var button = new Button({ className: 'RefreshButton' });
    $(button).click(function(evt) {
        callback(evt);
    });
    return button;
};