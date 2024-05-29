var crypto = require('crypto-js')

function u(t) {
    return ~~(Math['random']() * t)
}

function get_xm(){

    var n = Date.now();
    var t = 'himalaya-';
    var e = n;
    var r = n + 1000;
    return ("{" + t + e + "}(" + u(100) + ")" + e + "(" + u(100) + ")" + r)['replace'](/{([\w-]+)}/, (function(t, e) {
        return crypto.MD5(e)
    }
    ))
}

// console.log(get_xm())

