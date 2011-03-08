controller = {
    actions: {
        form: function() {
            return AirView(AirModel('joscars'));
        },
        submit: function(data) {
            return AirView();
        }
    }
};