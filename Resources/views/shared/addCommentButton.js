view = function(callback) {
    var button = new Button({ className: 'AddCommentButton' });
    $(button).click(function(evt) {
        callback(evt);
    });
    return button;
};