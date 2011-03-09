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
                        when: new Date(2011, 3, 9, 12, 0)
                    },
                    {
                        imageURL: 'http://a3.twimg.com/profile_images/1215252283/AngryFace-Bigger_reasonably_small_reasonably_small.jpg',
                        who: 'Dawson Toth',
                        text: 'Like a good story, life is more interesting with imminent catastrophic failure and an unforeseeable conclusion.',
                        source: 'Twitter',
                        url: 'http://twitter.com/#!/dawsontoth/status/45272233345691648',
                        when: new Date(2011, 3, 8, 10, 53)
                    },
                    {
                        imageURL: 'http://a3.twimg.com/profile_images/1215252283/AngryFace-Bigger_reasonably_small_reasonably_small.jpg',
                        who: 'Dawson Toth',
                        text: 'Native notifications from pure JS in #android with @appcelerator #titanium http://bit.ly/hjJYYo',
                        source: 'Twitter',
                        url: 'http://twitter.com/#!/dawsontoth/status/43801472080687104',
                        when: new Date(2011, 3, 8, 7, 20)
                    }
                ]
            });
        },
        addComment: function() {
            return AirView();
        }
    }
};