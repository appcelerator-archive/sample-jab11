function formatDate(d) {
    d = d || new Date();
    var retVal = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + ' ';
    if (d.getHours() >= 12) {
        retVal += (d.getHours() == 12 ?
                d.getHours() : d.getHours() - 12) + ':' +
                d.getMinutes() + ' PM';
    }
    else {
        retVal += d.getHours() + ':' + d.getMinutes() + ' AM';
    }
    return retVal;
}

function toTwoDigits(num) {
    return num < 10 ? '0' + String(num) : num;
}

function toTimeElapsed(date) {
    if (!date) {
        return 'Unknown';
    }
    if (!date.getTime) {
        date = new Date(date);
    }
    var ms = new Date().getTime() - date.getTime();
    var min = parseInt(ms / 60000);
    var hrs = 0;
    var days = 0;
    if (min > 60) {
        hrs = parseInt(min / 60);
        min = min % 60;
    }
    if (hrs > 24) {
        days = parseInt(hrs / 24);
        hrs = hrs % 24;
        return days + 'd' + (hrs > 0
                ? ', ' + hrs + 'h'
                : '') + ' ago';
    }
    return hrs < 1 && min < 1
            ? 'Just Now'
            : (hrs >= 1 ? hrs + 'h, ' : '') + min + 'm ago';

}

/**
 * Define our HTML parser class. It takes in some text, and then you can call "linkifyURLs", or one of the other
 * methods, and then call "getHTML" to get the fully parsed text back as HTML!
 * @param text that you want parsed
 */
function HTMLParser(text) {

    var html = text;

    var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    var hashTagRegex = /#([^ ]+)/gi;
    var mentionRegex = /@([^ ]+)/gi;

    this.linkifyURLs = function() {
        html = html.replace(urlRegex, '<a href="$1">$1</a>');
    };
    this.linkifyHashTags = function() {
        html = html.replace(hashTagRegex, '<a href="http://twitter.com/#!/search?q=%23$1">#$1</a>');
    };
    this.linkifyMentions = function() {
        html = html.replace(mentionRegex, '<a href="http://twitter.com/#!/search?q=%40$1">@$1</a>');
    };

    this.getHTML = function() {
        return html;
    };

}

function parseISODate(input) {
    var year, months, days, hours, minutes, seconds, milliseconds;
    var iso = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;
    var parts = input.match(iso);
    if (parts == null) {
        return null;
    }
    year = Number(parts[1]);
    if (typeof parts[2] != "undefined") {
        /* Convert weeks to days, months 0 */
        var weeks = Number(parts[2]) - 1;
        days = Number(parts[3]);
        if (typeof days == "undefined") {
            days = 0;
        }
        days += weeks * 7;
        months = 0;
    }
    else {
        if (typeof parts[4] != "undefined") {
            months = Number(parts[4]) - 1;
        }
        else {
            months = 0;
        }
        days = Number(parts[5]);
    }
    if (typeof parts[6] != "undefined" &&
            typeof parts[7] != "undefined") {
        hours = Number(parts[6]);
        minutes = Number(parts[7]);
        if (typeof parts[8] != "undefined") {
            seconds = Number(parts[8]);
            if (typeof parts[9] != "undefined") {
                milliseconds = Number(parts[9]) / 100;
            }
        }
    }
    if (typeof parts[10] != "undefined") {
        minutes = Number(minutes) + (parts[10] * 60 + (new Date().getTimezoneOffset()));
    }
    return new Date(year, months, days, hours, minutes, seconds);
}

var iconStore = Ti.Filesystem.applicationDataDirectory + '/CachedRemoteImages';
var dir = Ti.Filesystem.getFile(iconStore);
if (!dir.exists()) {
    dir.createDirectory();
}
function cacheRemoteURL(image, imageURL) {
    if (imageURL) {
        var hashedSource = Ti.Utils.md5HexDigest(imageURL + '') + '.' + imageURL.split('.').pop();
        var localIcon = Ti.Filesystem.getFile(iconStore, hashedSource);
        if (localIcon.exists()) {
            image.image = localIcon.nativePath;
        }
        else {
            image.image = imageURL;
            image.addEventListener('load', function() {
                localIcon.write(image.toImage());
            });
        }
    }
}

var oauthWrapper = {
    settings : {},
    store: {},
    setup: function(settings) {
        this.settings = settings;
        this.store.adapter = new OAuthAdapter(
                settings.secret,
                settings.key,
                'HMAC-SHA1');
        this.store.adapter.loadAccessToken('twitter');
    },
    isAuthorized: function() {
        return this.store.adapter.isAuthorized();
    },
    deAuthorize: function() {
        this.store.adapter.clearAccessToken('twitter');
    },
    authorize: function(callback) {
        var adapter = this.store.adapter;
        if (!adapter.isAuthorized()) {
            var receivePin = function() {
                adapter.getAccessToken('https://api.twitter.com/oauth/access_token');
                adapter.saveAccessToken('twitter');
                callback && callback({ delay: 2000 });
            };
            var token = adapter.getRequestToken('https://api.twitter.com/oauth/request_token');
            adapter.showAuthorizeUI('https://api.twitter.com/oauth/authorize?' + token, receivePin);
        }
        else {
            callback && callback({ delay: 0 });
        }
    },
    /**
     * Sends an oauth request to Twitter to post an update.
     * @param options Should include a message parameter, and two function callback parameters, success and error.
     */
    sendToTwitter: function(options) {
        var adapter = this.store.adapter;
        this.authorize(function(evt) {
            setTimeout(function() {
                adapter.send({
                    url: 'https://api.twitter.com/1/statuses/update.json',
                    parameters: [
                        ['status', options.message]
                    ],
                    title: 'Twitter',
                    onSuccess: options.success,
                    onError: options.error
                });
            }, evt.delay);
        });
    }
};
