model = {
    // May 9th, 2011, 9am in the morning
    conferenceDate: new Date(2011, 5, 6, 9, 0, 0, 0),
    icons: [
        { className: 'Icon', id: 'AboutIcon', targetURL: { controller: 'about', action: 'about' } },
        { className: 'Icon', id: 'MapsIcon', targetURL: { controller: 'maps', action: 'venueMap' } },
        { className: 'Icon', id: 'TravelIcon', targetURL: { controller: 'travel', action: 'list' } },
        { className: 'Icon', id: 'LatestNewsIcon', targetURL: { controller: 'news', action: 'list' } },
        { className: 'Icon', id: 'SpeakersIcon', targetURL: { controller: 'speakers', action: 'list' } },
        { className: 'Icon', id: 'ProgramIcon', targetURL: { controller: 'schedule', action: 'list' } },
        { className: 'Icon', id: 'SocialIcon', targetURL: { controller: 'social', action: 'list' } },
        { className: 'Icon', id: 'JOSCARSIcon', targetURL: { controller: 'joscars', action: 'form' } },
        { className: 'Icon', id: 'SettingsIcon', targetURL: { controller: 'settings', action: 'list' } }
    ]
};