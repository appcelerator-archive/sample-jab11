view = function(model) {
    var view = new View({ id: 'SocialAddComment', className: 'Window' });

    var options = [
        new Label({
            text: 'Facebook',
            className: 'SocialSegmentedPickerText SegmentedPickerText'
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
            },
            onDeselect: function(evt) {
            },
            options: options
        })
    });
    secondBar.top = 42;
    view.add(secondBar);

    view.add(AirView('titleBar', {
        left: AirView('button', { view: view, type: 'X' }),
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
    $(text).change(function() {
        count.text = text.value.length;
    });
    return view;
};