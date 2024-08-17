var CryptoJS = require("crypto-js")

function DESEncrypt(key, word) {
    var key_ = CryptoJS.enc.Utf8.parse(key);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.DES.encrypt(srcs, key_, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
}