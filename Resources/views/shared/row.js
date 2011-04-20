view = function(model) {

    var className = model.className || '';
    var row = new TableViewRow({ className: className + 'Row Row' });

    // title
    if (typeof model.title === 'string') {
        row.add(new Label({ text: model.title, className: className + 'RowTitle RowTitle' }));
    }
    else {
        row.add(model.title);
    }

    // subtitle
    if (model.subtitle) {
        row.add(new Label({ text: model.subtitle, className: className + 'RowSubtitle RowSubtitle' }));
    }

    // do we have details?
    if (model.targetURL) {
        row.targetURL = model.targetURL;
        row.add(new ImageView({ className: className + 'RowDetailsArrow RowDetailsArrow' }));
    }

    return row;
};
