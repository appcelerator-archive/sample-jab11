var offset = 0, ani = new Animation({ id: 'NotificationOutAnimation' });
ani.addEventListener('complete', function() {
    offset -= 33;
});
view = function(text) {
    var window = new Window({ id: 'Notification' });
    window.add(new View({ id: 'NotificationView' }));
    window.add(new Label({
        id: 'NotificationLabel',
        text: text
    }));
    window.top += offset;
    offset += 33;
    
    function close() {
        clearTimeout(timeout);
        window.close(ani);
    }
    var timeout = setTimeout(close, ani.timeout || 3000);
    $(window).click(close);
    
    window.open();
};