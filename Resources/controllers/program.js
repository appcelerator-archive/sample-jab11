controller = {
    actions: {
        list: function() {
            return AirView(this.get());
        },
        details: function(id) {
            return AirView(this.get(id)[0]);
        },
        get: function(id) {
            var program = TiStorage().use('jab').collection('Program');
            // if we don't have anything in our database, load in the default data.
            if (program.find().length == 0) {
                this.handlePayload(program, AirModel('defaultProgram'));
            }
            return program.find(id == undefined ? undefined : { id: id });
        },
        update: function(callback) {

            var program = TiStorage().use('jab').collection('Program');
            var self = this;
            var xhr = new HTTPClient({
                onload: function() {
                    try {
                        var response = this.responseText;
                        if (response) {
                            program.clear();
                            self.handlePayload(program, response);
                            callback(program.find());
                        } else if (response.error) {
                            callback(response);
                        } else {
                            AirView('notification', 'The server is temporarily unavailable; please check your internet connection, and try again.');
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
            xhr.open('GET', constants.ProgramUpdateURL);
            xhr.send();

        },
        handlePayload: function(collection, data) {
            var rows = data.substring(3, data.length - 3).split('"],["');
            for (var i = 0, l = rows.length; i < l; i++) {
                var cells = rows[i].split('","');
                collection.create({
                    GripPos: cells[0],
                    Start: cells[1],
                    StartFloat: parseFloat(cells[1].split(':').join('.')),
                    End: cells[2],
                    EndFloat: parseFloat(cells[2].split(':').join('.')),
                    Title: cells[3],
                    TitleLink: cells[4],
                    UserName: cells[5],
                    UserLink: cells[6],
                    Day: cells[7]
                });
            }
        }
    }
};