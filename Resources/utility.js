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