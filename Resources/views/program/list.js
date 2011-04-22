view = function(model) {

    var days = { My: false, Friday: true, Saturday: false, Sunday: false };

    var win = new View({ id: 'ProgramWindow', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('button', { view: win, type: 'Home' }),
        center: '2011 Program',
        right: AirView('button', { type: 'Refresh', callback: function() {
            update();
        }})
    }));

    function getMyScheduleRows() {
        return AirView('program/myScheduleRows', {
            data: AirAction({ controller: 'program', action: 'getMySchedule' }) || [],
            emptyTitle: 'Nothing in your schedule yet!',
            emptySubtitle: 'Tap a calendar icon, it\'ll show up here.'
        });
    }

    Ti.App.addEventListener('MySchedule-Updated', function() {
        tables['My'].updateRows({ rows: getMyScheduleRows() });
    });

    function updateTables(data) {
        var tableRows = {}, lastHeader = {};
        for (var i = 0, l = data.length; i < l; i++) {
            var rows = tableRows[data[i].Day] = tableRows[data[i].Day] || [];
            var item = data[i];
            var rowData = {
                title: item.Title,
                subtitle: item.UserName
            };
            if (item.TitleLink) {
                rowData.targetURL = { controller: 'program', action: 'details', id: item.id, navigatorOptions: { animate: 'tabSlide' } };
            }
            var row = AirView('row', rowData);
            var header = item.Start + ' - ' + item.End;
            if (header != lastHeader[item.Day]) {
                row.header = lastHeader[item.Day] = header;
            }
            row.Day = item.Day;
            rows.push(row);
        }
        tableRows['My'] = getMyScheduleRows();
        for (var day in tables) {
            tables[day].updateRows({ rows: tableRows[day] });
        }
    }

    function update(callback) {
        AirView('notification', { text: 'Updating...', id: 'Program' });
        AirAction({
            controller: 'program',
            action: 'update',
            callback: function(response) {
                if (response.error) {
                    callback && callback();
                    AirView('notification', { text: response.error, id: 'Program' });
                    error(response.error);
                }
                else {
                    updateTables(response);
                }
            }
        });
    }

    var options = [], tables = {}, visibleTable;
    for (var day in days) {
        options.push(new Label({ text: day, className: 'SegmentedPickerText', selected: days[day] }));
        tables[day] = AirView('table', { update: update });
        tables[day].top = 86;
    }
    var secondBar = AirView('titleBar', {
        style: 'LighterGrey',
        right: AirView('segmentedPicker', {
            selectMultiple: false,
            allowNoneSelected: false,
            onSelect: function(evt) {
                var day = evt.source.text.text;
                days[day] = true;
                if (visibleTable != tables[day]) {
                    win.remove(visibleTable);
                    win.add(visibleTable = tables[day]);
                }
            },
            options: options
        })
    });
    secondBar.top = 42;
    win.add(secondBar);

    updateTables(model);

    win.add(visibleTable = tables['Friday']);

    return win;
};