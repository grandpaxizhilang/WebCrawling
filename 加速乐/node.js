var CryptoJS = require('crypto-js');


var hash = {
    'md5': function(a){return CryptoJS.MD5(a)},
    'sha1': function(a){return CryptoJS.SHA1(a)},
    'sha256': function(a){return CryptoJS.SHA256(a)}
}


var _0x48666a={
    'lvfXw':function(_0x1c1aca, _0x4e31b4) {
        return _0x1c1aca + _0x4e31b4;
    },
    'GxsPR': ';Max-age=',
    'uzjCz':function(_0x243576, _0x13a443, _0x42e6c3) {
        return _0x243576(_0x13a443, _0x42e6c3);
    },
    'SxVDQ':function(_0x5a271e, _0x1e353d) {
        return _0x5a271e < _0x1e353d;
    },

}


function get_key(_0x14adfe){
    var _0x259824 = new Date();
    function _0x150029(_0x30ebea, _0x12f4d0) {

        var _0x223c3e = _0x14adfe['chars']['length'];
        for (var _0x5c9766 = 0x0; _0x5c9766 < _0x223c3e; _0x5c9766++) {
            for (var _0x333303 = 0x0; _0x48666a['SxVDQ'](_0x333303, _0x223c3e); _0x333303++) {
                var _0x2a1b85 = _0x12f4d0[0x0] + _0x14adfe['chars']['substr'](_0x5c9766, 0x1) + _0x14adfe['chars']['substr'](_0x333303, 0x1) + _0x12f4d0[0x1];
                if (hash[_0x14adfe['ha']](_0x2a1b85) == _0x30ebea) {
                    return [_0x2a1b85, new Date() - _0x259824];
                }
            }
        }
    };

    var _0xd94907 = _0x48666a['uzjCz'](_0x150029, _0x14adfe['ct'], _0x14adfe['bts']);
    var _0x2bdf4c = _0x48666a['lvfXw'](_0x48666a['lvfXw'](_0x14adfe['tn'] + '=', _0xd94907[0x0]) + _0x48666a['GxsPR'], _0x14adfe['vt']) + '; path = /';
    _0x2bdf4c = _0x48666a['lvfXw'](_0x2bdf4c, '; SameSite=None; Secure')


    return _0x2bdf4c
}

var t = {
    "bts": ["1707234523.796|0|Eq7", "HI%2BaY787HhxAwo1INwD3TE%3D"],
    "chars": "toHctvIrMehzZvuIhuiupZ",
    "ct": "49934a886b405b239c213e5ed4eee25f",
    "ha": "md5",
    "is": true,
    "tn": "__jsl_clearance_s",
    "vt": "3600",
    "wt": "1500"
}


