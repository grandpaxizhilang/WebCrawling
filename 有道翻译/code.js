var crypto = require('crypto')

function get_sign(key){
    a = {}
    a.o = (new Date).getTime();

    var e = `client=fanyideskweb&mysticTime=${a.o}&product=webfanyi&key=${key}`
    a.sign = crypto.createHash("md5").update(e).digest("hex")
    return a;

}

function get_data(data,key,iv){
    const n = Buffer.alloc(16, crypto.createHash("md5").update(key).digest())
        , a = Buffer.alloc(16, crypto.createHash("md5").update(iv).digest())
        , i = crypto.createDecipheriv("aes-128-cbc", n, a);
    let c = i.update(data, "base64", "utf-8");
    return c += i.final("utf-8"),
    c
}

// var data = 'Z21kD9ZK1ke6ugku2ccWuz4Ip5f4PLCoxWstZf_6UUyBoy8dpWc3NOXFRrnPMya70RuGOsPQrbXqI2sOSz95IX_RHCxw20BoECTNvoeDchKz7lzIRfVLfu_Gzg4rN5UqqIZCNxArbk-SUn3VeG5q4pKQFnFxn_htgtoIvzESQ6voW7ZlOhRjwj7UudCwmYKVMf3w5LDCC8n9OeS1CA3M_2r9p767GaGCU-goNU6NC9otZQk3Vsxmv56yLxNtz3rN5ZwI51CtKWaHkGgz3-yBrCahqMDhkgOQMv_lXFmcvcuVG00fgfNvdUjDwhpjIByEhm1PhAqxJI-7U5-WHv7hKa0eMRQ2o5p2u-2tcMdFGsglL-VahRHNA_fX9wfBU2c0q1EJJqVmgvOWncR8uNQ2hIOHMl1RUStsyhgnbdSmihtCPxhSHunxscR3rGK8LjJ0VTahXHLgdHaNnd-Mb8UxClcRFZP2SPqWiAYhAYgFwW8-U9zjDK3jDps5emQMrMdGY0RRICtdMer12FbHuMcRP4KZX0iBDNM-dPwCU4g1TEO_mlB5izhTFVIXYQxoYFx4'
// var key = 'ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl'
// var iv = 'ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4'

// console.log(get_data(data,key,iv))
// console.log(get_sign('asdjnjfenknafdfsdfsd'))