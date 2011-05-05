view = function(model) {

    // Android doesn't support pull to refresh at the moment
    if (Ti.Android) {
        return null;
    }

    // based heavily on Jeff Haynie's blog post here:
    // http://developer.appcelerator.com/blog/2010/05/how-to-create-a-tweetie-like-pull-to-refresh-table.html

    var table = model.table;
    var update = model.update;

    var messages = ['Pull to Refresh...', 'Release to Refresh...', 'Refreshing...'];
    var container = new View({ className: 'PullToRefresh' });

    function getUpdatedMessage() {
        return 'Last Updated: ' + formatDate();
    }

    var flipped = Ti.UI.create2DMatrix().rotate(-90);
    var normal = Ti.UI.create2DMatrix().rotate(90);

    var arrow = new ImageView({
        className: 'PullToRefreshArrow',
        transform: normal
    });
    var statusLabel = new Label({
        text: messages[0],
        className: 'PullToRefreshText'
    });
    var lastUpdatedLabel = new Label({
        text: getUpdatedMessage(),
        className: 'PullToRefreshLastUpdated'
    });
    var activityIndicator = new ActivityIndicator({
        className: 'PullToRefreshIndicator'
    });

    container.add(arrow);
    container.add(statusLabel);
    container.add(lastUpdatedLabel);
    container.add(activityIndicator);

    var pulling, refreshing;

    function refreshFinished() {
        table.setContentInsets({ top:0 }, { animated:true });
        refreshing = false;
        lastUpdatedLabel.text = getUpdatedMessage();
        statusLabel.text = messages[0];
        activityIndicator.hide();
        arrow.show();
    }

    $(table).scroll(function(e) {
        var offset = e.contentOffset.y;
        if (offset <= -65.0 && !pulling) {
            pulling = true;
            arrow.animate({ transform: flipped, duration: 180 });
            statusLabel.text = messages[1];
        }
        else if (pulling && offset > -65.0 && offset < 0) {
            pulling = false;
            arrow.animate({ transform: normal, duration: 180 });
            statusLabel.text = messages[0];
        }
    });
    $(table).scrollEnd(function() {
        if (pulling && !refreshing) {
            refreshing = true;
            pulling = false;
            arrow.hide();
            activityIndicator.show();
            statusLabel.text = messages[2];
            table.setContentInsets({ top: 60 }, { animated: true });
            arrow.animate({ transform: normal, duration: 180 });
            update(refreshFinished);
        }
    });
    table.headerView = container;

    return container;
};