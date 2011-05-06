view = function(model) {

    var view = new View({ id: 'SocialAddComment', className: 'Window' });

    function showCamera() {
        Ti.Media.showCamera({
            success: getPhotoView
        });
    }

    function getPhotoView(event) {
        AirView('getPhoto', {
            event: event,
            callback: handleUploadResponse
        });
    }

    function handleUploadResponse(evt) {
        if (evt.error) {
            AirView('notification', 'TwitPic Upload Failed: ' + evt.error);
        }
        else {
            text.value += ' ' + evt.url;
            $(text).change();
            text.focus();
        }
    }

    /*
     Create our title bar. The left button will close the pop up, the right will launch the camera.
     */
    view.add(AirView('titleBar', {
        left: AirView('button', { type: 'X', callback: function() {
            text.blur();
            TiAir.close(view);
        }}),
        center: 'Add Comment',
        // 'Ti.Media.isCameraSupported' is not impl on Android; http://appc.me/TIMOB-993
        right: (Ti.Android || Ti.Media.isCameraSupported)
                ? AirView('button', { type: 'Camera', callback: showCamera })
                : null,
        style: 'Grey'
    }));

    /*
     Now place a bar right below it that will let the user choose where they want to post their comment. Note that
     Facebook starts off selected, but Facebook does not.
     */
    var postTo = { Facebook: true, Twitter: false };
    var options = [
        new Label({
            text: 'Facebook',
            className: 'SocialSegmentedPickerText SegmentedPickerText',
            selected: true
        }),
        new Label({
            text: 'Twitter',
            className: 'SocialSegmentedPickerText SegmentedPickerText'
        })
    ];
    for (var i = 0, l = options.length; i < l; i++) {
        options[i].add(new ImageView({ left: -23, className: 'SocialIcon' + options[i].text }));
    }
    var secondBar = AirView('titleBar', {
        left: 'Post to:',
        style: 'LighterGrey',
        right: AirView('segmentedPicker', {
            className: 'Social',
            selectMultiple: true,
            onSelect: function(evt) {
                postTo[evt.source.text.text] = true;
            },
            onDeselect: function(evt) {
                postTo[evt.source.text.text] = false;
            },
            options: options
        })
    });
    secondBar.top = 42;
    view.add(secondBar);

    /*
     Add a text area with a counter in its bottom right corner.
     */
    var text = new TextArea({ id: 'SocialTextArea', value: model && model.text });
    var count = new Label({ id:'SocialCount', value: text.value && text.value.length });
    text.add(count);
    view.add(text);
    $(text).change(function() {
        count.text = text.value.length;
    });

    $(view).open(function() {
        text.focus();
    });

    /*
     When the user hits the "SEND" button on the keyboard, perform some validation then send off the message to the
     appropriate controller.
     */
    // we unfortunately can't use the redux bindings for this next line, because "return" is a reserved keyword...
    text.addEventListener('return', function() {

        // did they select at least one place to post?
        if (!postTo.Facebook && !postTo.Twitter) {
            text.focus();
            return AirView('notification', 'Please post to at least one social site.');
        }

        // did they fill in a value?
        var value = text.value;
        if (!value || !value.length) {
            text.focus();
            return AirView('notification', 'Please enter some text!');
        }

        // we're good! lets turn the "postTo" into an array (because that's what the controller wants to receive)
        var to = [];
        if (postTo.Facebook) {
            to.push('Facebook');
        }
        if (postTo.Twitter) {
            to.push('Twitter');
        }

        // and finally send off the request to the controller! Check out "Resources/controllers/social.js:post" now.
        TiAir.openURL({
            controller: 'social',
            action: 'post',
            to: to,
            message: value,
            callback: function(evt) {
                if (evt.success) {
                    text.value = (model && model.text) || '';
                    TiAir.close(view);
                }
            }
        });
    });
    return view;
};