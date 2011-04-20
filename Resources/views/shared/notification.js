var offset = 0, ani = new Animation({ id: 'NotificationOutAnimation' });
ani.addEventListener('complete', function() {
    offset -= 33;
});
var byID = {};
view = function(model) {
    var window, text, id = 0;
    if (typeof model === 'string') {
        text = model
    }
    else {
        text = model.text;
        id = model.id;
    }

    if (id && byID[id]) {
        window = byID[id];
        clearTimeout(window.timeout);
    }
    else {
        byID[id] = window = new Window({ id: 'Notification' });
        window.add(new View({ id: 'NotificationView' }));
        window.add(window.label = new Label({ id: 'NotificationLabel' }));
        window.top += offset;
        offset += 33;
        window.open();
    }
    
    window.label.text = text;

    function close() {
        clearTimeout(window.timeout);
        if (id) {
            byID[id] = null;
        }
        window.close(ani);
    }
    window.timeout = setTimeout(close, ani.timeout || 3000);
    $(window).click(close);
};