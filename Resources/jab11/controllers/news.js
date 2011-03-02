var privateStore;
controller = {
    actions: {
        list: function() {
            return AirView(privateStore || (privateStore = AirModel('newsList')));
        },
        details: function(id) {
            var allNews = privateStore || (privateStore = AirModel('newsList'));
            return AirView(allNews.query.results.item[id]);
        }
    }
};