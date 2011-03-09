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