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
        var mySchedule = AirAction({ controller: 'program', action: 'getMySchedule' }) || [];
        var rows = [], lastHeader;
        for (var i = 0, l = mySchedule.length; i < l; i++) {
            var item = mySchedule[i];
            var rowData = {
                title: item.Title,
                subtitle: item.UserName,
                targetURL: { controller: 'program', action: 'details', id: item.id, navigatorOptions: { animate: 'tabSlide' } },
                className: 'MySchedule'
            };
            var date;
            switch (item.Day) {
                case 'Friday':
                    date = 'Fri. 6/5/11';
                    break;
                case 'Saturday':
                    date = 'Sat. 6/6/11';
                    break;
                case 'Sunday':
                    date = 'Sun. 6/7/11';
                    break;
            }
            var row = AirView('row', rowData);
            row.add(new Label({ className: 'MyScheduleTimeRow', text: item.Start + '-' + item.End }));
            row.add(new Label({ className: 'MyScheduleDateRow', text: date }));
            row.Day = item.Day;
            if (item.Day != lastHeader) {
                row.header = lastHeader = item.Day;
            }
            rows.push(row);
        }
        if (rows.length == 0) {
            rows.push(AirView('row', {
                title: 'Nothing in your schedule yet!',
                subtitle: 'Tap a calendar icon, it\'ll show up here.'
            }));
        }
        return rows;
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