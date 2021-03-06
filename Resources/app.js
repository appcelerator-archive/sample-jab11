/*
 * Set up some constants that we will use throughout the app.
 */
constants = {
    TwitterConsumerKey: '9U7332KAWsGzdIZDNpWkw',
    TwitterConsumerSecret: 'zG0SgCPfxFcwPyVatmYik9tUXMwcMQaKZjj2wOqQeag',
    TwitPicKey: '269c295a7bd82d7ddb991a201bd50114',
    Website: 'http://jandbeyond.org/',
    ProgramUpdateURL: 'http://jandbeyond.org/index.php?option=com_jab_program&type=1&format=raw',
    SpeakerUpdateURL: 'http://jandbeyond.org/index.php?option=com_jab_program&type=2&format=raw',
    FacebookAppID: '213079428719971',
    TwitterUpdateURL: 'http://search.twitter.com/search.json?q=%23jab11%20OR%20@jandbeyond%20OR%20from%3Ajandbeyond',
    FacebookUpdateURL: 'https://graph.facebook.com/jandbeyond/feed',
    DefaultComment: '@JandBeyond'
};

/*
 * Include the libraries we will use.
 */
Ti.include('lib/oauth.js');
Ti.include('lib/sha1.js');
Ti.include('lib/oauth_adapter.js');
Ti.include('lib/oauth_android.js');
Ti.include('utility.js');
Ti.include('lib/redux.js');
Ti.include('lib/TiAir.js');
Ti.include('lib/TiStorage.js');

Ti.UI.backgroundImage = 'content/images/loading.withoutbar.png';
var used = [
    Ti.UI.createView, Ti.UI.createLabel, Ti.UI.createImageView, Ti.UI.createButton, Ti.UI.createWindow,
    Ti.UI.createWebView, Ti.UI.createAnimation, Ti.Map.createView, Ti.UI.create2DMatrix, Ti.UI.createScrollView,
    Ti.UI.createTableView, Ti.UI.createTableViewRow, Ti.Network.createHTTPClient, Ti.UI.createTextField,
    Ti.UI.createActivityIndicator, Ti.UI.createAlertDialog, Ti.UI.createTextArea, Ti.UI.createProgressBar,
    Ti.UI.createEmailDialog, Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT
];

/*
 * Include our various styles. We chose to use redux for this project, but TiAir has no dependency on redux.
 */
includeRJSS(
    'content/styles/common.rjss',
    'content/styles/default.rjss',
    'content/styles/settings.rjss',
    'content/styles/social.rjss',
    'content/styles/speakers.rjss',
    'content/styles/maps.rjss'
);

oauthWrapper.setup({
    secret: constants.TwitterConsumerSecret,
    key: constants.TwitterConsumerKey
});

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
        'about.js', 'default.js', 'maps.js', 'news.js', 'program.js', 'settings.js', 'social.js',
        'speakers.js', 'sponsors.js', 'travel.js'
    ],

    // models contain data
    models: [
        'about.js', 'defaultIcons.js', 'defaultNewsList.js', 'defaultProgram.js', 'defaultSpeakers.js',
        'defaultTravel.js', 'sponsors.js', 'venueMap.js'
    ],

    // navigators control the transitions between views in your app
    navigator: 'default.js',

    // views show something to the user; a single view can contain other views, and usually receives a model
    views: {
        shared: [
            'button.js', 'details.js', 'htmlHeader.js', 'htmlFooter.js', 'gridWithDetails.js', 'notification.js',
            'notImplemented.js', 'pullToRefresh.js', 'row.js', 'segmentedPicker.js', 'table.js', 'titleBar.js'
        ],
        about: [
            'about.js'
        ],
        'default': [
            'daysUntil.js', 'list.js'
        ],
        maps: [
            'venueMap.js'
        ],
        news: [
            'details.js', 'list.js'
        ],
        program: [
            'details.js', 'list.js', 'myScheduleRows.js'
        ],
        settings: [
            'list.js'
        ],
        social: [
            'addComment.js', 'details.js', 'getPhoto.js', 'list.js'
        ],
        speakers: [
            'details.js', 'list.js'
        ],
        sponsors: [
        	'sponsors.js'
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