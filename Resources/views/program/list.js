view = function(model) {
    var win = new View({ id: 'ProgramWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: '2011 Program',
        right: AirView('button', { type: 'Refresh', callback: function() {
            table.update();
        }})
    }));

    /*
     Now place a bar right below it that will let the user choose day.
     */
    var show = { My: false, Friday: true, Saturday: false, Sunday: false };
    var options = [];
    for (var key in show) {
        options.push(new Label({ text: key, className: 'SegmentedPickerText', selected: show[key] }))
    }
    var secondBar = AirView('titleBar', {
        left: 'Post to:',
        style: 'LighterGrey',
        right: AirView('segmentedPicker', {
            selectMultiple: false,
            onSelect: function(evt) {
                show[evt.source.text.text] = true;
                // TODO: adjust filter
            },
            options: options
        })
    });
    secondBar.top = 42;
    win.add(secondBar);

    function processRows(data) {
        var rows = [], lastStart;
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            var rowData = {
                title: item.Title,
                subtitle: item.UserName
            };
            if (item.TitleLink) {
                rowData.targetURL = { controller: 'program', action: 'details', id: i, navigatorOptions: { animate: 'tabSlide' } };
            }
            var row = AirView('row', rowData);
            if (item.Start != lastStart) {
                row.header = lastStart = item.Start;
            }
            rows.push(row);
        }
        return rows;
    }

    var table = AirView('table', {
        rows: processRows(model),
        update: function(callback) {
            AirView('notification', 'Updating...');
            AirAction({
                controller: 'program',
                action: 'update',
                callback: function(response) {
                    if (response.error) {
                        callback();
                        AirView('notification', response.error);
                        error(response.error);
                    }
                    else {
                        callback(response);
                        AirView('notification', 'Last Updated: Just Now');
                    }
                }
            });
        }
    });
    table.top = 86;
    win.add(table);
    return win;
};