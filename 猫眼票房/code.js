
var Crypto = require('crypto-js')

function get_result(ua){

    var d = {
        method: 'GET',
        timeStamp: Date.now(),
        "User-Agent": btoa(ua),
        index: Math['floor'](1e3 * Math['random']() + 1),
        channelId: 40009,
        sVersion: 2,
        key: 'A013F70DB97834C0A5492378BD76C53A'
    }

    var c = Object['keys'](d).reduce(function(e, t) {
        return e = 0 === d[t] || d[t] ? e + "&" + t + "=" + d[t] : e + "&" + t + "=''"
    }, "")['slice'](1)


    signKey = Crypto.MD5(c).toString()
    return [d['index'],d["User-Agent"],d['timeStamp'],signKey]
}




