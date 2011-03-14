view = function(model) {

    var postTo = { Facebook: true, Twitter: false };

    var view = new View({ id: 'SocialAddComment', className: 'Window' });

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

    view.add(AirView('titleBar', {
        left: AirView('button', { type: 'X', callback: function() {
            text.blur();
            TiAir.close(view);
        }}),
        center: 'Add Comment',
        right: AirView('button', { type: 'Camera', callback: function() {
            AirView('notImplemented');
        }}),
        style: 'Grey'
    }));

    var text = new TextArea({ id: 'SocialTextArea' });
    var count = new Label({ id:'SocialCount' });
    text.add(count);
    view.add(text);

    view.addEventListener('open', function() {
        text.focus();
    });

    $(text).change(function() {
        count.text = text.value.length;
    });
    text.addEventListener('return', function() {
        if (!postTo.Facebook && !postTo.Twitter) {
            text.focus();
            return AirView('notification', 'Please post to at least one social site.');
        }
        if (!text.value || !text.value.length)
        {
            text.focus();
            return AirView('notification', 'Please enter some text!');
        }

        TiAir.close(view);
    });
    return view;
};