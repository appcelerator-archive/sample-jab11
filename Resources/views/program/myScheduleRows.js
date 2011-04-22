view = function(model) {
    var data = model.data,
            emptyTitle = model.emptyTitle,
            emptySubtitle = model.emptySubtitle;

    var rows = [], lastHeader;
    for (var i = 0, l = data.length; i < l; i++) {
        var item = data[i];
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
            title: emptyTitle,
            subtitle: emptySubtitle
        }));
    }
    return rows;
};