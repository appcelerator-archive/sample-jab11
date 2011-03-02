controller = {
    actions: {
        list: function() {
            return AirView(this.getNews());
        },
        details: function(id) {
            return AirView(this.getNews(id)[0]);
        },
        getNews: function(id) {

	        var news = TiStorage().use('jab11').collection('News');

            // if we don't have anything in our database, load in the default data.
            if (news.find().length == 0) {
                var defaultNews = AirModel('defaultNewsList').query.results.item;
                for (var i = 0, l = defaultNews.length; i < l; i++) {
                    defaultNews[i].id = i;
                    news.create(defaultNews[i]);
                }
            }

            return news.find(id == undefined ? undefined : { id: id })
        },
        updateNews: function(callback) {
            
        }
    }
};