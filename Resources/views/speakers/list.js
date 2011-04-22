view = function(model) {
    var view = new View({ id: 'SpeakersWindow', className: 'Window' });
    view.add(AirView('titleBar', {
        left: AirView('button', { view: view, type: 'Home' }),
        center: '2011 Speakers',
        right: AirView('button', { type: 'Refresh', callback: function() {
            update();
        }})
    }));

    var grid;

    function displaySpeakers(data) {
        var newGrid = new ScrollView({ id: 'SpeakerGrid' });

        // create our new grid
        for (var i = 0, l = data.length; i < l; i++) {
            newGrid.add(createTile(data[i]));
        }
        if (l > 0) {
            newGrid.add(new ImageView({ className: 'TornEdge', bottom: -8 }));
        }

        // and swap the new grid in for the old grid
        view.add(newGrid);
        if (grid) {
            view.remove(grid);
        }
        grid = newGrid;
    }

    function createTile(item) {
        var tile = new View({ className: 'SpeakerTile' });
        if (item.ThumbnailURL) {
            tile.add(new ImageView({ image: item.ThumbnailURL, className: 'SpeakerImage' }));
            tile.add(new ImageView({ className: 'SpeakerWithThumbnail' }));
        }
        else {
            tile.add(new ImageView({ className: 'SpeakerNoThumbnail' }));
        }
        tile.add(new Label({ text: item.UserName, className: 'SpeakerName' }));

        $(tile).click(function() {
            TiAir.openURL({
                controller: 'speakers', action: 'details',
                id: item.id,
                navigatorOptions: { animate: 'tabSlide' }
            });
        });
        return tile;
    }

    function update() {
        AirView('notification', { text: 'Updating...', id: 'Speakers' });
        AirAction({
            controller: 'speakers',
            action: 'update',
            callback: function(response) {
                if (response.error) {
                    AirView('notification', { text: response.error, id: 'Speakers' });
                    error(response.error);
                }
                else {
                    AirView('notification', { text: 'Last Updated: Just Now', id: 'Speakers' });
                    displaySpeakers(response);
                }
            }
        });
    }


    displaySpeakers(model);

    view.add(grid);
    return view;
};