view = function(model) {

    var row = new TableViewRow({ className: 'Row' });

    // title
    if (typeof model.title === 'string') {
        row.add(new Label({ text: model.title, className: 'RowTitle' }));
    }
    else {
        row.add(model.title);
    }

    // subtitle
    if (model.subtitle) {
        row.add(new Label({ text: model.subtitle, className: 'RowSubtitle' }));
    }

    // do we have details?
    if (model.targetURL) {
        row.targetURL = model.targetURL;
        row.add(new ImageView({ className: 'RowDetailsArrow' }));
    }

    return row;
};
