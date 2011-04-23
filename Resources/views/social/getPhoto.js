view = function(model) {

    var image = model.event.media;
    var callback = model.callback;

    if (!oauthWrapper.isAuthorized()) {
        oauthWrapper.authorize(function() {
            uploadImage();
        });
    }
    else {
        uploadImage();
    }

    function uploadImage() {
        var window = new Window({ id: 'Notification', bottom: 10, height: 60 });
        var view = new View({ id: 'NotificationView', height: 60, layout: 'vertical' });
        window.add(view);
        window.open();

        var animation = new Animation({ id: 'NotificationOutAnimation' });

        function closeWindow() {
            window.close(animation);
        }

        $(window).click(closeWindow);

        view.add(new Label({ id: 'NotificationLabel', text: 'Uploading to TwitPic', top: 10 }));
        var progress = new ProgressBar({
            width: 200, height: 20,
            top: 5,
            min: 0, max: 1, value: 0
        });
        view.add(progress);
        progress.show();

        var xhr = new HTTPClient({
            timeout: 20000,
            onerror: function(e) {
                error(e.error);
                callback({ error: e.error});
                closeWindow();
            },
            onload: function(e) {
                var url = this.responseText.split('<mediaurl>')[1].split('</mediaurl>')[0];
                callback(url);
                closeWindow();
            },
            onsendstream: function(e) {
                progress.value = e.progress;
                info('ONSENDSTREAM - PROGRESS: ' + e.progress);
            }
        });

		xhr.open('POST','https://twitpic.com/api/upload');
		xhr.send({
            media: image,
            username: 'fgsandford1000',
            password: 'sanford1000',
            message: '#jab11'
        });

    }
};