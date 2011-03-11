view = function(model) {
    var view = new View({ id: 'SocialAddComment', className: 'Window' });

    var secondBar = AirView('titleBar', {
        left: 'Post to:',
        style: 'LighterGrey',
        right: AirView('segmentedPicker', {
            selectMultiple: true,
            onSelect: function(evt) {
            },
            onDeselect: function(evt) {
            },
            options: ['Facebook', 'Twitter']
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
    return view;
};