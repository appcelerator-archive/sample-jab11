controller = {
    actions: {
        list: function() {
            return AirView(AirModel('newsList'));
        },
        details: function(id) {
            return AirView();
        }
    }
};