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
    function close() {
        clearTimeout(timeout);
        window.close({ opacity: 0, duration: window.fadeDuration || 500 });
        offset -= 40;
    }

    var timeout = setTimeout(close, window.timeout || 3000);
    $(window).click(close);
};