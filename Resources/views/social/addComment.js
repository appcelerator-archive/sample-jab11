view = function(model) {
    var view = new View({ id: 'SocialAddComment', className: 'Window' });
    view.add(AirView('titleBar', {
        left: AirView('button', { view: view, type: 'X' }),
        title: 'Add Comment',
        right: AirView('button', { type: 'Camera', callback: function() {
            AirView('notImplemented');
        }}),
        style: 'Grey'
    }));

    return view;
};