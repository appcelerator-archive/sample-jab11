view = function(model) {

    var className = model.className || '';

    var view = new View({ className: className + 'DetailsContainer DetailsContainer' });

    var titleContainer = new View({ className: className + 'DetailsTitleContainer DetailsTitleContainer' });
    if (typeof model.title === 'string') {
        titleContainer.add(new Label({ text: model.title, className: className + 'DetailsTitle DetailsTitle' }));
    }
    else {
        titleContainer.add(model.title);
    }
    if (model.subtitle) {
        titleContainer.add(new Label({ text: model.subtitle, className: className + 'DetailsSubtitle DetailsSubtitle' }));
    }
    view.add(titleContainer);

    view.add(new WebView({
        className: className + 'DetailsBody DetailsBody',
        html: AirView('htmlHeader') + model.bodyHTML + AirView('htmlFooter')
    }));

    view.add(new ImageView({ className: className + 'DetailsTornEdge DetailsTornEdge TornEdge' }));

    return view;
};
