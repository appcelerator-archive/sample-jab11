controller = {
    actions: {
        list: function() {
            var item = AirModel('defaultTravel').query.results.item;
            item.description = item.description.replace(/K2Feed/gi, 'item');
            return AirView(item);
        },
        update: function(callback) {

            var n = new Date();
            var timestamp = '' + n.getUTCFullYear() + toTwoDigits(n.getUTCMonth() + 1) + toTwoDigits(n.getUTCDate()) + toTwoDigits(n.getUTCHours());
            var query = 'SELECT * FROM feed WHERE url="http://jandbeyond.org/information.feed?export=json?t=' + timestamp + '" and guid="http://jandbeyond.org/information/Travelling.html"';

            Ti.Yahoo.yql(query, function(response) {
                if (Ti.Android == undefined && !response.success) {
                    callback({ error: response.message });
                }
                else {
                    var data = response.data;
                    var collection = TiStorage().use('jab').collection('Travel');
                    collection.clear();
                    var item = data.item[0];
                    item.description = item.description.replace(/K2Feed/gi, 'item');
                    collection.create(item);
                    callback(collection.findOne());
                }
            });
        }
    }
};