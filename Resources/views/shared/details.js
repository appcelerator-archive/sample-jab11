view = function(model) {
    var view = new View({ className: 'DetailsContainer' });

    var titleContainer = new View({ className: 'DetailsTitleContainer' });
    if (typeof model.title === 'string') {
        titleContainer.add(new Label({ text: model.title, className: 'DetailsTitle' }));
    }
    else {
        titleContainer.add(model.title);
    }
    if (model.subtitle) {
        titleContainer.add(new Label({ text: model.subtitle, className: 'DetailsSubtitle' }));
    }
    view.add(titleContainer);

    view.add(new WebView({
        className: 'DetailsBody',
        html: AirView('detailsCSS') + model.bodyHTML
    }));

    view.add(new ImageView({ className: 'TornEdge DetailsTornEdge' }));

    return view;
};
