var Crypto = require('crypto-js')

function get_result(data){
    var i = '7cd084941338484aae1ad9425b84077c'
    var a = '4932caff0ff746eab6f01bf08b70ac45'

    for (var c = (n = i + a,
    r = [],
    [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52].forEach((function(t) {
        n.charAt(t) && r.push(n.charAt(t))
    }
    )),
    r.join("").slice(0, 32)), u = Math.round(Date.now() / 1e3), s = Object.assign({}, data, {
        wts: u
    }), l = Object.keys(data).sort(), f = [], p = /[!'()*]/g, d = 0; d < l.length; d++) {
        var h = l[d]
            , v = data[h];
        v && "string" == typeof v && (v = v.replace(p, "")),
        null != v && f.push("".concat(encodeURIComponent(h), "=").concat(encodeURIComponent(v)))
    }
    var y = f.join("&");
    return {
        w_rid: Crypto.MD5(y + c).toString(),
    }

}

// data = {
//     "mid": 245833292,
//     "ps": 30,
//     "tid": 0,
//     "pn": 1,
//     "keyword": "",
//     "order": "pubdate",
//     "platform": "web",
//     "web_location": 1550101,
//     "order_avoided": true,
//     "dm_img_list": "[]",
//     "dm_img_str": "V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ",
//     "dm_cover_img_str": "QU5HTEUgKEFNRCwgQU1EIFJhZGVvbihUTSkgR3JhcGhpY3MgKDB4MDAwMDE2MzYpIERpcmVjdDNEMTEgdnNfNV8wIHBzXzVfMCwgRDNEMTEpR29vZ2xlIEluYy4gKEFNRC",
//     "dm_img_inter": "{\"ds\":[{\"t\":2,\"c\":\"Y2xlYXJmaXggZy1zZWFyY2ggc2VhcmNoLWNvbnRhaW5lcg\",\"p\":[1521,85,782],\"s\":[49,511,514]},{\"t\":2,\"c\":\"d3JhcHBlcg\",\"p\":[657,3,1299],\"s\":[306,4285,3664]}],\"wh\":[1977,-51,75],\"of\":[366,732,366]}",
//     "wts": 1714629013
// }

// console.log(get_result(data))


