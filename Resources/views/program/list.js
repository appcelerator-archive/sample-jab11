view = function(model) {
    var win = new View({ id: 'ProgramWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: '2011 Program',
        right: AirView('button', { type: 'Refresh', callback: function() {
            table.update();
        }})
    }));
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
    table.top = 45;
    win.add(table);
    return win;
};