controller = {
    actions: {
        about: function() {
            return AirView(AirModel('about'));
        },
        sponsors: function() {
            return AirView();
        }
    }
};