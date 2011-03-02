view = function() {
    var win = new View({ id: 'JOSCARsView', className: 'Window' });
    win.add(AirView('titleBar', {
        left: AirView('homeButton', win),
        title: 'JOSCARS'
    }));
    var scroll = new ScrollView({ id: 'JOSCARsScroll' });
    win.add(scroll);
    scroll.add(new ImageView({ id: 'JOSCARsBannerImage' }));
    scroll.add(new Label({ id: 'JOSCARsSubtitle' }));

    scroll.add(new Label({ id: 'JOSCARsCommunity' }));
    var community = new TextField({ className: 'JOSCARsText' });
    scroll.add(community);

    scroll.add(new Label({ id: 'JOSCARsNonProfit' }));
    var nonprofit = new TextField({ className: 'JOSCARsText' });
    scroll.add(nonprofit);

    var submit = new Button({ id: 'JOSCARsSubmit' });
    scroll.add(submit);

    $(submit).click(function() {
        var commValue = community.value.trim();
        var npValue = nonprofit.value.trim();
        if (!commValue.length && !npValue.length) {
            alert('Please nominate at least one site.');
        }
        else {
            return AirView('notImplemented');
        }
    });

    return win;
};