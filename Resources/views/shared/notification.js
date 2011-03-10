var offset = 0;
view = function(text) {
    var window = new Window({
        id: 'Notification'
    });
    window.add(new View({
        id: 'NotificationView'
    }));
    window.add(new Label({
        id: 'NotificationLabel',
        text: text
    }));
    window.top += offset;
    offset += 40;
    window.open();
    setTimeout(function() {
        window.close({ opacity: 0, duration: window.fadeDuration || 500 });
        offset -= 40;
    }, window.timeout || 3000);
};