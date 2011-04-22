controller = {
    actions: {
        sessions: function() {
            return AirView();
        },
        list: function() {
            return AirView(this.get());
        },
        details: function(id) {
            return AirView(this.get(id));
        },
        get: function(id) {
            var collection = TiStorage().use('jab').collection('Speakers');
            // if we don't have anything in our database, load in the default data.
            if (collection.find().length == 0) {
                this.handlePayload(collection, AirModel('defaultSpeakers'));
            }
            if (id == undefined) {
                return collection.find();
            }
            else {
                return collection.find({ id: id })[0];
            }
        },
        update: function(callback) {

            var collection = TiStorage().use('jab').collection('Speakers');
            var self = this;
            var xhr = new HTTPClient({
                onload: function() {
                    try {
                        var response = this.responseText;
                        if (response) {
                            collection.clear();
                            self.handlePayload(collection, response);
                            callback(collection.find());
                        } else if (response.error) {
                            callback(response);
                        } else {
                            callback({ error: 'The server is temporarily unavailable; please check your internet connection, and try again.' });
                        }
                    }
                    catch(err) {
                        callback({ error: err });
                    }
                },
                onerror: function(e) {
                    callback({ error: e });
                }
            });
            xhr.open('GET', constants.SpeakerUpdateURL);
            xhr.send();

        },
        handlePayload: function(collection, data) {

            function cleanText(text) {
                return text
                    .split('\\/').join('/')
                    .split('\\"').join('"')
                    .split('\\r\\n').join('<br />')
                    .split('\\u00e9').join('é')
                    .split('\\u2026').join('…')
                    .split('\\u010d').join('č');
            }
            var rows = data.substring(3, data.length - 3).split('"],["');
            for (var i = 0, l = rows.length; i < l; i++) {
                var cells = rows[i].split('","');
                collection.create({
                    ServerID: cells[0],
                    UserName: cleanText(cells[1]),
                    UserLink: cleanText(cells[2]),
                    BiographyHTML: cleanText(cells[3]),
                    ThumbnailURL: cleanText(cells[4]),
                    EmailAddress: cleanText(cells[5])
                });
            }
            
            collection.sort({ UserName : -1 });
        }
    }
};