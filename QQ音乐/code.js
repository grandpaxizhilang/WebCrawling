//


window = global
navigator = {}
location = {}

navigator.userAgent = ''
location.host = ''


var xl;
!function(e) {
    function t(t) {
        for (var r, n, f = t[0], c = t[1], i = t[2], l = 0, u = []; l < f.length; l++)
            n = f[l],
            Object.prototype.hasOwnProperty.call(o, n) && o[n] && u.push(o[n][0]),
            o[n] = 0;
        for (r in c)
            Object.prototype.hasOwnProperty.call(c, r) && (e[r] = c[r]);
        for (b && b(t); u.length; )
            u.shift()();
        return d.push.apply(d, i || []),
        a()
    }
    function a() {
        for (var e, t = 0; t < d.length; t++) {
            for (var a = d[t], r = !0, n = 1; n < a.length; n++) {
                var c = a[n];
                0 !== o[c] && (r = !1)
            }
            r && (d.splice(t--, 1),
            e = f(f.s = a[0]))
        }
        return e
    }
    var r = {}
      , n = {
        21: 0
    }
      , o = {
        21: 0
    }
      , d = [];
    function f(t) {
        if (r[t])
            return r[t].exports;
        var a = r[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        // console.log(t)
        return e[t].call(a.exports, a, a.exports, f),
        a.l = !0,
        a.exports
    }
    f.e = function(e) {
        var t = [];
        n[e] ? t.push(n[e]) : 0 !== n[e] && {
            1: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1
        }[e] && t.push(n[e] = new Promise((function(t, a) {
            for (var r = "css/" + ({
                1: "common",
                3: "album",
                4: "albumDetail",
                5: "album_mall",
                6: "category",
                7: "cmtpage",
                8: "download_detail",
                9: "index",
                10: "msg_center",
                11: "mv",
                12: "mvList",
                13: "mv_toplist",
                14: "notfound",
                15: "player",
                16: "player_radio",
                17: "playlist",
                18: "playlist_edit",
                19: "profile",
                20: "radio",
                22: "search",
                23: "singer",
                24: "singer_list",
                25: "songDetail",
                26: "toplist"
            }[e] || e) + "." + {
                1: "2e3d715e72682303d35b",
                3: "5cf0d69eaf29bcab23d2",
                4: "798353db5b0eb05d5358",
                5: "df4c243f917604263e58",
                6: "20d532d798099a44bc88",
                7: "e3bedf2b5810f8db0684",
                8: "e3bedf2b5810f8db0684",
                9: "ea0adb959fef9011fc25",
                10: "020422608fe8bfb1719a",
                11: "8bdb1df6c5436b790baa",
                12: "47ce9300786df1b70584",
                13: "4aee33230ba2d6b81dce",
                14: "e6f63b0cf57dd029fbd6",
                15: "1d2dbefbea113438324a",
                16: "d893492de07ce97d8048",
                17: "9484fde660fe93d9f9f0",
                18: "67fb85e7f96455763c83",
                19: "5e8c651e74b13244f7cf",
                20: "3befd83c10b19893ec66",
                22: "b2d11f89ea6a512a2302",
                23: "c7a38353c5f4ebb47491",
                24: "df0961952a2d3f022894",
                25: "4c080567e394fd45608b",
                26: "8edb142553f97482e00f"
            }[e] + ".chunk.css?max_age=2592000", o = f.p + r, d = document.getElementsByTagName("link"), c = 0; c < d.length; c++) {
                var i = (b = d[c]).getAttribute("data-href") || b.getAttribute("href");
                if ("stylesheet" === b.rel && (i === r || i === o))
                    return t()
            }
            var l = document.getElementsByTagName("style");
            for (c = 0; c < l.length; c++) {
                var b;
                if ((i = (b = l[c]).getAttribute("data-href")) === r || i === o)
                    return t()
            }
            var u = document.createElement("link");
            u.rel = "stylesheet",
            u.type = "text/css",
            u.onload = t,
            u.onerror = function(t) {
                var r = t && t.target && t.target.src || o
                  , d = new Error("Loading CSS chunk " + e + " failed.\n(" + r + ")");
                d.code = "CSS_CHUNK_LOAD_FAILED",
                d.request = r,
                delete n[e],
                u.parentNode.removeChild(u),
                a(d)
            }
            ,
            u.href = o,
            0 !== u.href.indexOf(window.location.origin + "/") && (u.crossOrigin = "anonymous"),
            document.getElementsByTagName("head")[0].appendChild(u)
        }
        )).then((function() {
            n[e] = 0
        }
        )));
        var a = o[e];
        if (0 !== a)
            if (a)
                t.push(a[2]);
            else {
                var r = new Promise((function(t, r) {
                    a = o[e] = [t, r]
                }
                ));
                t.push(a[2] = r);
                var d, c = document.createElement("script");
                c.charset = "utf-8",
                c.timeout = 120,
                f.nc && c.setAttribute("nonce", f.nc),
                c.src = function(e) {
                    return f.p + "js/" + ({
                        1: "common",
                        3: "album",
                        4: "albumDetail",
                        5: "album_mall",
                        6: "category",
                        7: "cmtpage",
                        8: "download_detail",
                        9: "index",
                        10: "msg_center",
                        11: "mv",
                        12: "mvList",
                        13: "mv_toplist",
                        14: "notfound",
                        15: "player",
                        16: "player_radio",
                        17: "playlist",
                        18: "playlist_edit",
                        19: "profile",
                        20: "radio",
                        22: "search",
                        23: "singer",
                        24: "singer_list",
                        25: "songDetail",
                        26: "toplist"
                    }[e] || e) + ".chunk." + {
                        1: "0b15a31f7bc269ea76ff",
                        3: "b3395a2d475262b98fa7",
                        4: "dea94b21a47cdb6d0f65",
                        5: "f5b6937e84f33133b31d",
                        6: "6c4ac3718d0230ac3b1c",
                        7: "ae411fac801093307ebc",
                        8: "f1c40f6b3a431ca4c9ac",
                        9: "52f2369df6a4a3649011",
                        10: "90aef56793aff533bf57",
                        11: "4c23320d028878580c26",
                        12: "b43316a48154164d557b",
                        13: "8adf08693025ab48224f",
                        14: "89eb6da604ebcf2dda2d",
                        15: "c6c19b148a1694a28cbe",
                        16: "0df54200ddf5f7710d42",
                        17: "6838a647ca4abb619832",
                        18: "9d2cbd13db3328dcd357",
                        19: "ce6940fdeda857506a27",
                        20: "8af74f665077243ecefa",
                        22: "5a013d73a1da88cc221e",
                        23: "469f622f5dffdeee26eb",
                        24: "9df420e7d63b8d867fd2",
                        25: "9bea17905ada32dde9b5",
                        26: "bcb481bd9dd2001370ac"
                    }[e] + ".js?max_age=2592000"
                }(e),
                0 !== c.src.indexOf(window.location.origin + "/") && (c.crossOrigin = "anonymous");
                var i = new Error;
                d = function(t) {
                    c.onerror = c.onload = null,
                    clearTimeout(l);
                    var a = o[e];
                    if (0 !== a) {
                        if (a) {
                            var r = t && ("load" === t.type ? "missing" : t.type)
                              , n = t && t.target && t.target.src;
                            i.message = "Loading chunk " + e + " failed.\n(" + r + ": " + n + ")",
                            i.name = "ChunkLoadError",
                            i.type = r,
                            i.request = n,
                            a[1](i)
                        }
                        o[e] = void 0
                    }
                }
                ;
                var l = setTimeout((function() {
                    d({
                        type: "timeout",
                        target: c
                    })
                }
                ), 12e4);
                c.onerror = c.onload = d,
                document.head.appendChild(c)
            }
        return Promise.all(t)
    }
    ,
    f.m = e,
    f.c = r,
    f.d = function(e, t, a) {
        f.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: a
        })
    }
    ,
    f.r = function(e) {
        "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    f.t = function(e, t) {
        if (1 & t && (e = f(e)),
        8 & t)
            return e;
        if (4 & t && "object" === typeof e && e && e.__esModule)
            return e;
        var a = Object.create(null);
        if (f.r(a),
        Object.defineProperty(a, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var r in e)
                f.d(a, r, function(t) {
                    return e[t]
                }
                .bind(null, r));
        return a
    }
    ,
    f.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return f.d(t, "a", t),
        t
    }
    ,
    f.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    f.p = "/ryqq/",
    f.oe = function(e) {
        throw e
    }
    ;
    var c = window.webpackJsonp = window.webpackJsonp || []
      , i = c.push.bind(c);
    c.push = t,
    c = c.slice();
    for (var l = 0; l < c.length; l++)
        t(c[l]);
    var b = i;
    a()
    xl = f
}({
    147 : function(t, e, n) {
        "use strict";
        n.r(e),
        function(t) {
            var n = "undefined" !== typeof t ? t : "undefined" !== typeof window ? window : "undefined" !== typeof self ? self : void 0;
            var r = function() {
                function t(e, n, r, i, o, a, u, s) {
                    var c = !i;
                    e = +e,
                    n = n || [0],
                    i = i || [[this], [{}]],
                    o = o || {};
                    var l, f = [], p = null;
                    Function.prototype.bind || (l = [].slice,
                    Function.prototype.bind = function(t) {
                        if ("function" != typeof this)
                            throw new TypeError("bind101");
                        var e = l.call(arguments, 1)
                          , n = e.length
                          , r = this
                          , i = function() {}
                          , o = function() {
                            return e.length = n,
                            e.push.apply(e, arguments),
                            r.apply(i.prototype.isPrototypeOf(this) ? this : t, e)
                        };
                        return this.prototype && (i.prototype = this.prototype),
                        o.prototype = new i,
                        o
                    }
                    );
                    for (var d = [function() {
                        i[i.length - 2] = i[i.length - 2] + i.pop()
                    }
                    , function() {
                        for (var a = n[e++], u = [], s = n[e++], c = n[e++], l = [], f = 0; f < s; f++)
                            u[n[e++]] = i[n[e++]];
                        for (f = 0; f < c; f++)
                            l[f] = n[e++];
                        i.push((function e() {
                            var i = u.slice(0);
                            i[0] = [this],
                            i[1] = [arguments],
                            i[2] = [e];
                            for (var s = 0; s < l.length && s < arguments.length; s++)
                                0 < l[s] && (i[l[s]] = [arguments[s]]);
                            return t(a, n, r, i, o)
                        }
                        ))
                    }
                    , function() {
                        i[i.length - 2] = i[i.length - 2] | i.pop()
                    }
                    , function() {
                        i.push(i[n[e++]][0])
                    }
                    , function() {
                        var t = n[e++]
                          , r = i[i.length - 2 - t];
                        i[i.length - 2 - t] = i.pop(),
                        i.push(r)
                    }
                    , , function() {
                        var t = n[e++]
                          , r = t ? i.slice(-t) : [];
                        i.length -= t,
                        t = i.pop(),
                        i.push(t[0][t[1]].apply(t[0], r))
                    }
                    , , , function() {
                        var t = n[e++];
                        i[i.length - 1] && (e = t)
                    }
                    , function() {
                        var t = n[e++]
                          , r = t ? i.slice(-t) : [];
                        i.length -= t,
                        r.unshift(null),
                        i.push(function() {
                            return function(t, e, n) {
                                return new (Function.bind.apply(t, e))
                            }
                            .apply(null, arguments)
                        }(i.pop(), r))
                    }
                    , function() {
                        i[i.length - 2] = i[i.length - 2] - i.pop()
                    }
                    , function() {
                        var t = i[i.length - 2];
                        t[0][t[1]] = i[i.length - 1]
                    }
                    , , function() {
                        var t = n[e++];
                        i[t] = void 0 === i[t] ? [] : i[t]
                    }
                    , , function() {
                        i.push(!i.pop())
                    }
                    , , , , function() {
                        i.push([n[e++]])
                    }
                    , function() {
                        i[i.length - 1] = r[i[i.length - 1]]
                    }
                    , , function() {
                        i.push("")
                    }
                    , , function() {
                        i[i.length - 2] = i[i.length - 2] << i.pop()
                    }
                    , , function() {
                        var t = i.pop();
                        i.push([i[i.pop()][0], t])
                    }
                    , function() {
                        i.push(i[i.pop()[0]][0])
                    }
                    , , function() {
                        i[i.length - 1] = n[e++]
                    }
                    , function() {
                        i[i.length - 2] = i[i.length - 2] >> i.pop()
                    }
                    , , function() {
                        i.push(!1)
                    }
                    , function() {
                        i[i.length - 2] = i[i.length - 2] > i.pop()
                    }
                    , , function() {
                        i[i.length - 2] = i[i.length - 2] ^ i.pop()
                    }
                    , function() {
                        i.push([i.pop(), i.pop()].reverse())
                    }
                    , function() {
                        i.pop()
                    }
                    , function() {
                        i[i[i.length - 2][0]][0] = i[i.length - 1]
                    }
                    , , , , function() {
                        i.push(i[i.length - 1])
                    }
                    , , function() {
                        return !0
                    }
                    , function() {
                        i.push([r, i.pop()])
                    }
                    , function() {
                        var t = n[e++]
                          , o = t ? i.slice(-t) : [];
                        i.length -= t,
                        i.push(i.pop().apply(r, o))
                    }
                    , function() {
                        i[i.length - 2] = i[i.length - 2] >= i.pop()
                    }
                    , , , function() {
                        i.length = n[e++]
                    }
                    , , function() {
                        var t = i.pop()
                          , e = i.pop();
                        i.push([e[0][e[1]], t])
                    }
                    , , function() {
                        i[i.length - 2] = i[i.length - 2] & i.pop()
                    }
                    , function() {
                        e = n[e++]
                    }
                    , , function() {
                        i[i.length - 1] += String.fromCharCode(n[e++])
                    }
                    , , , function() {
                        i[i.length - 2] = i[i.length - 2] === i.pop()
                    }
                    , function() {
                        i.push(void 0)
                    }
                    , function() {
                        var t = i.pop();
                        i.push(t[0][t[1]])
                    }
                    , , function() {
                        i.push(!0)
                    }
                    , , function() {
                        i[i.length - 2] = i[i.length - 2] * i.pop()
                    }
                    , function() {
                        i.push(n[e++])
                    }
                    , function() {
                        i.push(typeof i.pop())
                    }
                    ]; ; )
                        try {
                            for (var h = !1; !h; )
                                h = d[n[e++]]();
                            if (p)
                                throw p;
                            return c ? (i.pop(),
                            i.slice(3 + t.v)) : i.pop()
                        } catch (m) {
                            var v = f.pop();
                            if (void 0 === v)
                                throw m;
                            p = m,
                            e = v[0],
                            i.length = v[1],
                            v[2] && (i[v[2]][0] = p)
                        }
                }
                return t.v = 5,
                t(0, function(t) {
                    var e = t[1]
                      , n = []
                      , r = function(t) {
                        for (var e, n, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(""), i = String(t).replace(/[=]+$/, ""), o = 0, a = 0, u = ""; n = i.charAt(a++); ~n && (e = o % 4 ? 64 * e + n : n,
                        o++ % 4) && (u += String.fromCharCode(255 & e >> (-2 * o & 6))))
                            n = function(t, e, n) {
                                if ("function" == typeof Array.prototype.indexOf)
                                    return Array.prototype.indexOf.call(t, e, n);
                                var r;
                                if (null == t)
                                    throw new TypeError('"array" is null or not defined');
                                var i = Object(t)
                                  , o = i.length >>> 0;
                                if (0 == o)
                                    return -1;
                                if (o <= (n |= 0))
                                    return -1;
                                for (r = Math.max(0 <= n ? n : o - Math.abs(n), 0); r < o; r++)
                                    if (r in i && i[r] === e)
                                        return r;
                                return -1
                            }(r, n);
                        return u
                    }(t[0])
                      , i = e.shift()
                      , o = e.shift()
                      , a = 0;
                    function u() {
                        for (; a === i; )
                            n.push(o),
                            a++,
                            i = e.shift(),
                            o = e.shift()
                    }
                    for (var s = 0; s < r.length; s++) {
                        var c = r.charAt(s).charCodeAt(0);
                        u(),
                        n.push(c),
                        a++
                    }
                    return u(),
                    n
                }(["MwgOAg4DDgQOBQ4GDgc4fzozCQ4CDgMOBA4FDgYOBw4IFzpkOmU6ZjppOm46ZRVFFzpmOnU6bjpjOnQ6aTpvOm49CUc4XzomFzpkOmU6ZjppOm46ZS4XOmE6bTpkNT8JaSYDAy8AOHwJJhc6ZDplOmY6aTpuOmUuAwMGASY+LQERAAEDOAMzCg4CDgMOBA4FDgYOBw4IDgkUCDg8MwgOAg4DDgQOBQ4GDgcXOmc6bDpvOmI6YTpsFUUXOnU6bjpkOmU6ZjppOm46ZTpkPRAJ1iY45gQmFzpnOmw6bzpiOmE6bBUtFzp3Omk6bjpkOm86dxVFFzp1Om46ZDplOmY6aTpuOmU6ZD0QCSY4BiYXOnc6aTpuOmQ6bzp3FS0XOnM6ZTpsOmYVRRc6dTpuOmQ6ZTpmOmk6bjplOmQ9EAkmOAEmFzpzOmU6bDpmFS0+LQGeAAAvACcmJhQJOA0zIg4CDgMOBA4FDgYOBw4IDgkOCg4LDgwODQ4ODg8OEA4RDhIOEw4UDhUOFg4XDhgOGQ4aDhsOHA4dDh4OHw4gFAkXOk86YjpqOmU6Yzp0FQoAKxc6MCVEAAwmJisXOjElRAEMJiYrFzoyJUQCDCYmKxc6MyVEAwwmJisXOjQlRAQMJiYrFzo1JUQFDCYmKxc6NiVEBgwmJisXOjclRAcMJiYrFzo4JUQIDCYmKxc6OSVECQwmJisXOkElRAoMJiYrFzpCJUQLDCYmKxc6QyVEDAwmJisXOkQlRA0MJiYrFzpFJUQODCYmKxc6RiVEI0QUCwwmJicmJhQKFzpBOkI6QzpEOkU6RjpHOkg6STpKOks6TDpNOk46TzpQOlE6UjpTOlQ6VTpWOlc6WDpZOlo6YTpiOmM6ZDplOmY6ZzpoOmk6ajprOmw6bTpuOm86cDpxOnI6czp0OnU6djp3Ong6eTp6OjA6MToyOjM6NDo1OjY6Nzo4Ojk6KzovOj0nJiYUCxQhFzpfOl86czppOmc6bjpfOmg6YTpzOmg6XzoyOjA6MjowOjA6MzowOjUbPwk4MyYhFCEXOl86XzpzOmk6ZzpuOl86aDphOnM6aDpfOjI6MDoyOjA6MDozOjA6NRsDAwYBBAAmFzp0Om86VTpwOnA6ZTpyOkM6YTpzOmUlBgAnJiYUDBc6dzppOm46ZDpvOncVRRc6bzpiOmo6ZTpjOnQ9CTgBJhc6bjphOnY6aTpnOmE6dDpvOnIVRRc6bzpiOmo6ZTpjOnQ9CTgDJhc6bDpvOmM6YTp0Omk6bzpuFUUXOm86YjpqOmU6Yzp0PScmJhQNAwwJOAomFzpSOmU6ZzpFOng6cBUXOkg6ZTphOmQ6bDplOnM6cxc6aS8CFzp0OmU6czp0JRc6bjphOnY6aTpnOmE6dDpvOnIuFzp1OnM6ZTpyOkE6ZzplOm46dDU/BgEnJiYUDhQhFzpfOl86cTptOmY6ZTpfOnM6aTpnOm46XzpjOmg6ZTpjOmsbP0QBPQkmAwwJOAkmAw0QCTg4Jhc6bDpvOmM6YTp0Omk6bzpuLhc6aDpvOnM6dDUXOmk6bjpkOmU6eDpPOmY1FzpxOnE6LjpjOm86bQYBRABEAQsiJyYmFA9BFzpBOnI6cjphOnkVCgArRAAlRC5EGQsMJiYrRAElRAQMJiYrRAIlRAkMJiYrRAMlRDVEGwsMJiYrRAQlRANEDQAMJiYrRAUlRABEFAAMJiYrRAYlRC9EFAsMJiYrRAclRC9EEQsMJiYXOm06YTpwJTgBMwsOAg4DDgQOBQ4GDgcOCBQJAwoJJgMDRAEAOAomAwMbPy0BAgEJCwoOAwYBFzpqOm86aTpuJQQAJhcGAScmJhQQFzpBOnI6cjphOnkVCgArRAAlRAZEDAAMJiYrRAElRAsMJiYrRAIlRAMMJiYrRAMlRAIMJiYrRAQlRAEMJiYrRAUlRAcMJiYrRAYlRAYMJiYrRAclRDlEIAsMJiYXOm06YTpwJTgxMwsOAg4DDgQOBQ4GDgcOCBQJAwoJJgMDRAEAOAEmAwMbPy0BAgEJCwoOAwYBFzpqOm86aTpuJRcGAScmJhQRFzpBOnI6cjphOnkVCgArRAAlRAhEEUQMQwAMJiYrRAElRAtEIgAMJiYrRAIlRDREHAAMJiYrRAMlRDxECAAMJiYrRAQlRA1EDkQNQwAMJiYrRAUlRAdEDEQNQwAMJiYrRAYlRAdEDUQMQwAMJiYrRAclRAtEEEQMQwAMJiYrRAglRAVECEQTQwAMJiYrRAklRApEDkQPQwAMJiYrRAolRBBEEUQOQwAMJiYrRAslRB1EPgAMJiYrRAwlRAxEEUMMJiYrRA0lRApERQAMJiYrRA4lRAdEYQAMJiYrRDxELQslRAYMJiYnJiYDDhAJJjgeJhQRFzpBOnI6cjphOnkVCgArRAAlRBVEBAAMJiYrRAElRBtEJwAMJiYrRAIlRAEMJiYrRAMlRDhEAgAMJiYrRAQlRANEVwAMJiYrRAUlRDVEGQAMJiYrRAYlRDlEQgAMJiYrRAclRBpELQAMJiYrRAglRCVEBAsMJiYrRAklRAwMJiYrRAolRAhECkQRQwAMJiYrRAslRDJEKwAMJiYrRAwlRCFEBwAMJiYrRA0lRApEDEQNQwAMJiYrRA4lRC5EEAAMJiYrRBFEAgslRAhED0QPQwAMJiYnJiYUEhc6QTpyOnI6YTp5FQoAJyYmFBNEACcmJhQTHEQTRAMLMBAJJjgUJhQUFAkUCwMTRAJDGz8bP0Q2RCYLQxQJFAsDE0QCQ0QBABs/Gz8AJyYmFBUUEQMTGz8nJiYUEhc6cDp1OnM6aBsDFAMVJAYBJhQTKxwrBAEEAEQBACcmHgAEAAImOEQUERQLFAkhJwQAJicEACYnJiYUHRcnJiYUHkQAJyYmFB4cRAUwEAkmOBQmFBYUEgMeRANDGz8nJiYUFxQSAx5EA0NEAQAbPycmJhQYFBIDHkQDQ0QCABs/JyYmFBkDFkQCHycmJhQaAxZEAzdEBBkDF0QEHwInJiYUGwMXRAVECgA3RAIZAxhEBh8CJyYmFBwDGEQ1RAoANycmJhQdAx0UCgMZGz8AFAoDGhs/ABQKAxsbPwAUCgMcGz8AJyYmFB4rHCsEAQQARAEAJyYeAAQAAiY4LxQdAx0UChQSRAhEBwAbP0QCHxs/ABQKFBJEC0QEABs/RAM3RAQZGz8AJyYmFBIhJyYmFB8UHRc6cjplOnA6bDphOmM6ZRsXOlI6ZTpnOkU6eDpwFRc6WzpcOi86KzpdFzpnLwIXBgInJiYUIBc6ejp6OmIDDwADHwADEAAnJiYUDxQQFB8UHRQKIScEACYnBAAmJwQAJicEACYnJiYUIBc6dDpvOkw6bzp3OmU6cjpDOmE6czplGwYALQEBASEIAycmJhQIFzpfOmc6ZTp0OlM6ZTpjOnU6cjppOnQ6eTpTOmk6ZzpuGwMJDCYmPi0BhwAALwEmPi0=", [133, 2628, 156, 340, 267, 272, 270, 288, 321, 326, 324, 338, 352, 2575, 786, 790, 788, 869, 904, 908, 906, 944, 945, 949, 947, 983, 991, 995, 993, 1085, 1133, 1217, 1138, 1142, 1140, 1146, 1147, 1151, 1149, 1217, 1336, 1375, 1359, 1369, 1367, 1372, 1376, 1338, 1508, 1547, 1531, 1541, 1539, 1544, 1548, 1510, 1813, 1818, 1816, 2036, 2073, 2078, 2076, 2174, 2172, 2062, 2213, 2218, 2216, 2389, 2387, 2205, 2576, 354]]), n)
            }();
            r.g = function() {
                return r.shift()[0]
            }
            ,
            n.__sign_hash_20200305 = function(t) {
                function e(t, e) {
                    var n = (65535 & t) + (65535 & e);
                    return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n
                }
                function n(t, n, r, i, o, a) {
                    return e((u = e(e(n, t), e(i, a))) << (s = o) | u >>> 32 - s, r);
                    var u, s
                }
                function r(t, e, r, i, o, a, u) {
                    return n(e & r | ~e & i, t, e, o, a, u)
                }
                function i(t, e, r, i, o, a, u) {
                    return n(e & i | r & ~i, t, e, o, a, u)
                }
                function o(t, e, r, i, o, a, u) {
                    return n(e ^ r ^ i, t, e, o, a, u)
                }
                function a(t, e, r, i, o, a, u) {
                    return n(r ^ (e | ~i), t, e, o, a, u)
                }
                function u(t) {
                    return function(t) {
                        var e, n = "";
                        for (e = 0; e < 32 * t.length; e += 8)
                            n += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
                        return n
                    }(function(t, n) {
                        t[n >> 5] |= 128 << n % 32,
                        t[14 + (n + 64 >>> 9 << 4)] = n;
                        var u, s, c, l, f, p = 1732584193, d = -271733879, h = -1732584194, v = 271733878;
                        for (u = 0; u < t.length; u += 16)
                            s = p,
                            c = d,
                            l = h,
                            f = v,
                            p = r(p, d, h, v, t[u], 7, -680876936),
                            v = r(v, p, d, h, t[u + 1], 12, -389564586),
                            h = r(h, v, p, d, t[u + 2], 17, 606105819),
                            d = r(d, h, v, p, t[u + 3], 22, -1044525330),
                            p = r(p, d, h, v, t[u + 4], 7, -176418897),
                            v = r(v, p, d, h, t[u + 5], 12, 1200080426),
                            h = r(h, v, p, d, t[u + 6], 17, -1473231341),
                            d = r(d, h, v, p, t[u + 7], 22, -45705983),
                            p = r(p, d, h, v, t[u + 8], 7, 1770035416),
                            v = r(v, p, d, h, t[u + 9], 12, -1958414417),
                            h = r(h, v, p, d, t[u + 10], 17, -42063),
                            d = r(d, h, v, p, t[u + 11], 22, -1990404162),
                            p = r(p, d, h, v, t[u + 12], 7, 1804603682),
                            v = r(v, p, d, h, t[u + 13], 12, -40341101),
                            h = r(h, v, p, d, t[u + 14], 17, -1502002290),
                            p = i(p, d = r(d, h, v, p, t[u + 15], 22, 1236535329), h, v, t[u + 1], 5, -165796510),
                            v = i(v, p, d, h, t[u + 6], 9, -1069501632),
                            h = i(h, v, p, d, t[u + 11], 14, 643717713),
                            d = i(d, h, v, p, t[u], 20, -373897302),
                            p = i(p, d, h, v, t[u + 5], 5, -701558691),
                            v = i(v, p, d, h, t[u + 10], 9, 38016083),
                            h = i(h, v, p, d, t[u + 15], 14, -660478335),
                            d = i(d, h, v, p, t[u + 4], 20, -405537848),
                            p = i(p, d, h, v, t[u + 9], 5, 568446438),
                            v = i(v, p, d, h, t[u + 14], 9, -1019803690),
                            h = i(h, v, p, d, t[u + 3], 14, -187363961),
                            d = i(d, h, v, p, t[u + 8], 20, 1163531501),
                            p = i(p, d, h, v, t[u + 13], 5, -1444681467),
                            v = i(v, p, d, h, t[u + 2], 9, -51403784),
                            h = i(h, v, p, d, t[u + 7], 14, 1735328473),
                            p = o(p, d = i(d, h, v, p, t[u + 12], 20, -1926607734), h, v, t[u + 5], 4, -378558),
                            v = o(v, p, d, h, t[u + 8], 11, -2022574463),
                            h = o(h, v, p, d, t[u + 11], 16, 1839030562),
                            d = o(d, h, v, p, t[u + 14], 23, -35309556),
                            p = o(p, d, h, v, t[u + 1], 4, -1530992060),
                            v = o(v, p, d, h, t[u + 4], 11, 1272893353),
                            h = o(h, v, p, d, t[u + 7], 16, -155497632),
                            d = o(d, h, v, p, t[u + 10], 23, -1094730640),
                            p = o(p, d, h, v, t[u + 13], 4, 681279174),
                            v = o(v, p, d, h, t[u], 11, -358537222),
                            h = o(h, v, p, d, t[u + 3], 16, -722521979),
                            d = o(d, h, v, p, t[u + 6], 23, 76029189),
                            p = o(p, d, h, v, t[u + 9], 4, -640364487),
                            v = o(v, p, d, h, t[u + 12], 11, -421815835),
                            h = o(h, v, p, d, t[u + 15], 16, 530742520),
                            p = a(p, d = o(d, h, v, p, t[u + 2], 23, -995338651), h, v, t[u], 6, -198630844),
                            v = a(v, p, d, h, t[u + 7], 10, 1126891415),
                            h = a(h, v, p, d, t[u + 14], 15, -1416354905),
                            d = a(d, h, v, p, t[u + 5], 21, -57434055),
                            p = a(p, d, h, v, t[u + 12], 6, 1700485571),
                            v = a(v, p, d, h, t[u + 3], 10, -1894986606),
                            h = a(h, v, p, d, t[u + 10], 15, -1051523),
                            d = a(d, h, v, p, t[u + 1], 21, -2054922799),
                            p = a(p, d, h, v, t[u + 8], 6, 1873313359),
                            v = a(v, p, d, h, t[u + 15], 10, -30611744),
                            h = a(h, v, p, d, t[u + 6], 15, -1560198380),
                            d = a(d, h, v, p, t[u + 13], 21, 1309151649),
                            p = a(p, d, h, v, t[u + 4], 6, -145523070),
                            v = a(v, p, d, h, t[u + 11], 10, -1120210379),
                            h = a(h, v, p, d, t[u + 2], 15, 718787259),
                            d = a(d, h, v, p, t[u + 9], 21, -343485551),
                            p = e(p, s),
                            d = e(d, c),
                            h = e(h, l),
                            v = e(v, f);
                        return [p, d, h, v]
                    }(function(t) {
                        var e, n = [];
                        for (n[(t.length >> 2) - 1] = void 0,
                        e = 0; e < n.length; e += 1)
                            n[e] = 0;
                        for (e = 0; e < 8 * t.length; e += 8)
                            n[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
                        return n
                    }(t), 8 * t.length))
                }
                function s(t) {
                    return u(unescape(encodeURIComponent(t)))
                }
                return function(t) {
                    var e, n, r = "";
                    for (n = 0; n < t.length; n += 1)
                        e = t.charCodeAt(n),
                        r += "0123456789abcdef".charAt(e >>> 4 & 15) + "0123456789abcdef".charAt(15 & e);
                    return r
                }(s(t))
            }
            ;
            var i = n._getSecuritySign;
            delete n._getSecuritySign,
            e.default = i
        }
        .call(this, n(110))
    },
    110: function(t, e) {
        var n;
        n = function() {
            return this
        }();
        try {
            n = n || new Function("return this")()
        } catch (r) {
            "object" === typeof window && (n = window)
        }
        t.exports = n
    },
});


function get_sign(data){
    var sign = xl(147).default(data)
    var ts = new Date().getTime()
    return [sign,ts]
}



// data = '{"comm":{"cv":4747474,"ct":24,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"yqq.json","needNewCode":1,"uin":0,"g_tk_new_20200303":5381,"g_tk":5381},"req_1":{"module":"music.musicsearch.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"searchid":"34959328740049978","remoteplace":"txt.yqq.top","from":"yqqweb"}},"req_2":{"module":"music.musicHall.MusicHallPlatformSvr","method":"GetFocus","param":{}},"req_3":{"module":"newalbum.NewAlbumServer","method":"get_new_album_area","param":{}},"req_4":{"module":"newalbum.NewAlbumServer","method":"get_new_album_info","param":{"area":1,"sin":0,"num":20}},"req_5":{"module":"musicToplist.ToplistInfoServer","method":"GetAll","param":{}},"req_6":{"module":"MvService.MvInfoProServer","method":"GetNewMv","param":{"style":0,"tag":0,"start":0,"size":40}},"req_7":{"module":"music.paycenterapi.LoginStateVerificationApi","method":"GetChargeAccount","param":{"appid":"mlive"}}}'
// console.log(get_sign(data))