model = {
    // May 9th, 2011, 9am in the morning
    conferenceDate: new Date(2011, 5, 6, 9, 0, 0, 0),
    icons: [
        { className: 'icon', id: 'AboutIcon', targetURL: { controller: 'about', action: 'about' } },
        { className: 'icon', id: 'MapsIcon', targetURL: { controller: 'maps', action: 'venueMap' } },
        { className: 'icon', id: 'TravelIcon', targetURL: { controller: 'travel', action: 'list' } },
        { className: 'icon', id: 'LatestNewsIcon', targetURL: { controller: 'news', action: 'list' } },
        { className: 'icon', id: 'SpeakersIcon', targetURL: { controller: 'speakers', action: 'list' } },
        { className: 'icon', id: 'ProgramIcon', targetURL: { controller: 'schedule', action: 'list' } },
        { className: 'icon', id: 'SocialIcon', targetURL: { controller: 'social', action: 'list' } },
        { className: 'icon', id: 'JOSCARSIcon', targetURL: { controller: 'joscars', action: 'form' } },
        { className: 'icon', id: 'SettingsIcon', targetURL: { controller: 'settings', action: 'list' } }
    ]
};