var mySchedule = JSON.parse(Ti.App.Properties.getString('MySchedule')) || {};

controller = {
    actions: {
        list: function() {
            return AirView(this.get());
        },
        details: function(id) {
            return AirView(this.get(id));
        },
        get: function(id) {
            var jab = TiStorage().use('jab');
            var collection = jab.collection('Program');
            var collectionDetails = jab.collection('ProgramDetails');
            // if we don't have anything in our database, load in the default data.
            if (collection.find().length == 0) {
                this.handlePayload(collection, AirModel('defaultProgram'));
            }
            if (id == undefined) {
                return collection.find();
            }
            else {
                var item = collection.find({ id: id })[0];
                item.Details = collectionDetails.find({ guid: item.TitleLink })[0];
                return item;
            }
        },
        isInMySchedule: function(gripPos) {
            return mySchedule[gripPos];
        },
        compareEventsChronologically: function (a, b) {
            if (a.Day == b.Day) {
                if (a.Start == b.Start) {
                    if (a.End == b.End) {
                        return 0;
                    }
                    return a.End < b.End ? -1 : 1;
                }
                return a.Start < b.Start ? -1 : 1;
            }
            return a.Day < b.Day ? -1 : 1;
        },
        getMySchedule: function() {
            var retVal = [];
            for (var key in mySchedule) {
                retVal.push(mySchedule[key])
            }
            retVal.sort(this.compareEventsChronologically);
            return retVal;
        },
        __cachedAllSpeeches: null,
        getForSpeaker: function(userLink) {
            var allSpeeches = this.__cachedAllSpeeches || this.get();
            var retVal = [];
            for (var i = allSpeeches.length - 1; i >= 0; i--) {
                if (allSpeeches[i].UserLink == userLink) {
                    retVal.push(allSpeeches[i]);
                }
            }
            retVal.sort(this.compareEventsChronologically);
            return retVal;
        },
        setMySchedule: function(gripPos, val) {
            if (val == null) {
                delete mySchedule[gripPos];
            }
            else {
                mySchedule[gripPos] = val;
            }
            Ti.App.Properties.setString('MySchedule', JSON.stringify(mySchedule));
            Ti.App.fireEvent('MySchedule-Updated', { GripPos: gripPos });
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
            xhr.open('GET', constants.ProgramUpdateURL);
            xhr.send();

        },
        handlePayload: function(collection, data) {

            function cleanText(text) {
                return text
                        .split('\\/').join('/')
                        .split('\\"').join('"')
                        .split('\\u00e9').join('é')
                        .split('\\u2026').join('…')
                        .split('\\u010d').join('č')
                        .split('<br \\/>').join('');
            }

            var rows = data.substring(3, data.length - 3).split('"],["');
            for (var i = 0, l = rows.length; i < l; i++) {
                var cells = rows[i].split('","');
                collection.create({
                    GripPos: cells[0],
                    Start: cells[1],
                    StartFloat: parseFloat(cells[1].split(':').join('.')),
                    End: cells[2],
                    EndFloat: parseFloat(cells[2].split(':').join('.')),
                    Title: cleanText(cells[3]),
                    TitleLink: cleanText(cells[4]),
                    UserName: cleanText(cells[5]),
                    UserLink: cleanText(cells[6]),
                    Day: cells[7]
                });
            }
            var n = new Date();
            var timestamp = '' + n.getUTCFullYear() + toTwoDigits(n.getUTCMonth() + 1) + toTwoDigits(n.getUTCDate()) + toTwoDigits(n.getUTCHours());
            var query = 'SELECT guid,description FROM feed WHERE url="http://jandbeyond.org/attendees/proposed-talks-and-sessions.feed?start={START}&export=json?t=' + timestamp + '"';

            var programDetails = TiStorage().use('jab').collection('ProgramDetails');

            function downloadProgramDetails(start) {
                var percent = start / rows.length;
                if (percent > 1) {
                    percent = 1;
                }
                AirView('notification', { text: 'Downloading details: ' + parseInt(percent * 100, 0) + '%', id: 'Program'});
                Ti.Yahoo.yql(query.split('{START}').join(start), function(response) {
                    if (!response.success) {
                        AirView('notification', { text: 'Interrupted while downloading details!', id: 'Program'});
                    }
                    else {
                        if (response.data) {
                            var data = response.data;
                            for (var j = 0, k = data.item.length; j < k; j++) {
                                var item = data.item[j];
                                item.description = item.description.replace(/K2Feed/gi, 'item');
                                programDetails.create(item);
                            }
                            downloadProgramDetails(start + 10);
                        }
                        else {
                            // we're done!
                            AirView('notification', { text: 'Downloading details: Complete!', id: 'Program'});
                        }
                    }
                });
            }

            programDetails.clear();
            downloadProgramDetails(0);
        }
    }
};