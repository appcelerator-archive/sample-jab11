model = {
    // May 9th, 2011, 9am in the morning
    conferenceDate: new Date(2011, 4, 6, 9, 0, 0, 0),
    icons: [

        { className: 'Icon', id: 'AboutIcon',
            targetURL: {
                controller: 'about', action: 'about',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        },

        { className: 'Icon', id: 'MapsIcon',
            targetURL: {
                controller: 'maps', action: 'venueMap',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        },

        { className: 'Icon', id: 'TravelIcon',
            targetURL: {
                controller: 'travel', action: 'list',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        },

        { className: 'Icon', id: 'LatestNewsIcon',
            targetURL: {
                controller: 'news', action: 'list',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        },

        { className: 'Icon', id: 'SpeakersIcon',
            targetURL: {
                controller: 'speakers', action: 'list',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        },

        { className: 'Icon', id: 'ProgramIcon',
            targetURL: {
                controller: 'program', action: 'list',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        },

        { className: 'Icon', id: 'SocialIcon',
            targetURL: {
                controller: 'social', action: 'list',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        },

        { className: 'Icon', id: 'SponsorsIcon', 
            targetURL: {
                controller: 'sponsors', action: 'sponsors',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }        
        },

        { className: 'Icon', id: 'SettingsIcon',
            targetURL: {
                controller: 'settings', action: 'list',
                navigatorOptions: { animate: 'pop' },
                cache: true
            }
        }

    ]
};