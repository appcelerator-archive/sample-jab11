controller = {
    actions: {
        list: function() {
            return AirView({
                lastUpdated: new Date(),
                items: [
                    {
                        imageURL: 'http://a3.twimg.com/profile_images/1194447295/fspencer_reasonably_small.png',
                        who: 'Fred Spencer',
                        text: 'Awesome b-day gift from @SnzyFstpnchr - Pure joy in a box. http://instagr.am/p/CHh67/',
                        source: 'Twitter',
                        url: 'Awesome b-day gift from @SnzyFstpnchr - Pure joy in a box. http://instagr.am/p/CHh67/',
                        when: new Date()
                    },
                    {
                        imageURL: 'http://a3.twimg.com/profile_images/1194447295/fspencer_reasonably_small.png',
                        who: 'Fred Spencer',
                        text: 'Awesome b-day gift from @SnzyFstpnchr - Pure joy in a box. http://instagr.am/p/CHh67/',
                        source: 'Twitter',
                        url: 'Awesome b-day gift from @SnzyFstpnchr - Pure joy in a box. http://instagr.am/p/CHh67/',
                        when: new Date('Wed, 09 Mar 2011 22:04:36 +0000')
                    },
                    {
                        imageURL: 'http://a3.twimg.com/profile_images/1194447295/fspencer_reasonably_small.png',
                        who: 'Fred Spencer',
                        text: 'Awesome b-day gift from @SnzyFstpnchr - Pure joy in a box. http://instagr.am/p/CHh67/',
                        source: 'Facebook',
                        url: 'Awesome b-day gift from @SnzyFstpnchr - Pure joy in a box. http://instagr.am/p/CHh67/',
                        when: new Date('Mon, 07 Mar 2011 12:45:36 +0000')
                    },
                    {
                        imageURL: 'http://a3.twimg.com/profile_images/1215252283/AngryFace-Bigger_reasonably_small_reasonably_small.jpg',
                        who: 'Dawson Toth',
                        text: 'Like a good story, life is more interesting with imminent catastrophic failure and an unforeseeable conclusion.',
                        source: 'Twitter',
                        url: 'http://twitter.com/#!/dawsontoth/status/45272233345691648',
                        when: new Date('Mon, 07 Mar 2011 14:20:30 +0000')
                    },
                    {
                        imageURL: 'http://a3.twimg.com/profile_images/1215252283/AngryFace-Bigger_reasonably_small_reasonably_small.jpg',
                        who: 'Dawson Toth',
                        text: 'Native notifications from pure JS in #android with @appcelerator #titanium http://bit.ly/hjJYYo',
                        source: 'Facebook',
                        url: 'http://twitter.com/#!/dawsontoth/status/43801472080687104',
                        when: new Date('Mon, 06 Mar 2011 12:57:21 +0000')
                    }
                ]
            });
        },
        addComment: function() {
            return AirView();
        },
        details: function(id) {
            return AirView('notImplemented');
        },
        update: function(callback) {
            callback({ error: 'Not Implemented'});
        }
    }
};