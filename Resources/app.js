/*
 * Include the libraries we will use. These libraries are NOT dependent on each other.
 */
Ti.include('utility.js');
Ti.include('redux.js');
Ti.include('TiAir.js');
Ti.include('TiStorage.js');

Ti.UI.backgroundImage = 'content/images/loading.withoutbar.png';
var used = [
    Ti.UI.createView, Ti.UI.createLabel, Ti.UI.createImageView, Ti.UI.createButton, Ti.UI.createWindow,
    Ti.UI.createWebView, Ti.UI.createAnimation, Ti.Map.createView, Ti.UI.create2DMatrix, Ti.UI.createScrollView,
    Ti.UI.createTableView, Ti.UI.createTableViewRow, Ti.Network.createHTTPClient, Ti.UI.createTextField,
    Ti.UI.createActivityIndicator, Ti.UI.createAlertDialog
];

/*
 * Include our various styles. We chose to use redux for this project, but TiAir has no dependency on redux.
 */
includeRJSS(
    'content/styles/common.rjss',
    'content/styles/default.rjss',
    'content/styles/about.rjss',
    'content/styles/social.rjss',
    'content/styles/joscars.rjss'
);

/*
 * Call the init function. This will intelligently load our application, and call the default controller's action.
 */
TiAir.init({

    // the default URL is the entry point for the app; after everything is initialized, we'll open this URL
    // note that it is a controller-action pair with as many optional arguments as you want. We'll magically map any
    // objects you pass here into their matching arguments on the specified controller's action.
    defaultURL: { controller: 'default', action: 'list' },

    // your controllers decide who is going to do stuff, and what they are going to do it with
    controllers: [
        'about.js', 'default.js', 'joscars.js', 'maps.js', 'news.js', 'schedule.js', 'settings.js', 'social.js',
        'speakers.js', 'travel.js'
    ],

    // models contain data
    models: [
        'about.js', 'defaultIcons.js', 'defaultNewsList.js', 'defaultTravel.js', 'joscars.js', 'venueMap.js'
    ],

    // navigators control the transitions between views in your app
    navigator: 'default.js',

    // views show something to the user; a single view can contain other views, and usually receives a model
    views: {
        shared: [
            'button.js', 'details.js', 'htmlHeader.js', 'htmlFooter.js', 'gridWithDetails.js', 'notification.js',
            'notImplemented.js', 'pullToRefresh.js', 'row.js', 'segmentedDisplay.js', 'table.js', 'titleBar.js'
        ],
        about: [
            'about.js', 'sponsors.js'
        ],
        'default': [
            'daysUntil.js', 'list.js'
        ],
        joscars: [
            'form.js'
        ],
        maps: [
            'venueMap.js'
        ],
        news: [
            'details.js', 'list.js'
        ],
        schedule: [
            'details.js', 'list.js'
        ],
        settings: [
            'list.js'
        ],
        social: [
            'addComment.js', 'list.js', 'details.js'
        ],
        speakers: [
            'addComment.js', 'comments.js', 'details.js', 'list.js', 'rate.js', 'sessions.js'
        ],
        travel: [
            'details.js', 'list.js'
        ]
    }
});

/*
 * Handle links to external websites.
 */
Ti.App.addEventListener('linkClicked', function(evt) {
    // confirm that they want to leave the app for the web browser
    var alertDialog = new AlertDialog({
        title: 'Opening External Website',
        message: 'Are you sure you want to leave the app?',
        buttonNames: ['Yes','No!'],
        cancel: 1
    });
    $(alertDialog).click(function(innerEvt) {
        if (!innerEvt.index) {
            // turn relative links into absolute links
            if (!evt.href.indexOf('/')) {
                evt.href = 'http://jandbeyond.org/' + evt.href;
            }
            // and open the url!
            Ti.Platform.openURL(evt.href);
        }
    });
    alertDialog.show();
});