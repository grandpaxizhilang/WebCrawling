
function C(A) {
    var W = 1830453227;
    var z = 1664525;
    var F = 4294967296;

    function T() {
        W = ((z * W) + A) % F;
        return W / F;
    }

    T.toString = function () {
        return "function random() { [native code] }";
    };

    return T;
}


function Q(A) {
    const rand = C(495841377);
    var Y = Math.floor(1 + 10 * rand());

    var T = Math.ceil(A.length / Y);
    var z = [];
    for (var F = 0; F < T; ++F) {
        for (var b = 0; b < Y; ++b) {
            var index = b * T + F;
            if (A[index] !== undefined) {
                z.push(A[index]);
            }
        }
    }

    return z;
}

function fill(J) {
    var D = Q(J);
    J["splice"](0, J["length"]);
    for (let y1 = 0; y1 < D["length"]; y1++) J["push"](D[y1]);

    return J;
  }



function j(A) {
    const rand = C(2333100694);
    var Y = "0123456789ABCDEF".split('');
    var T = Y;

    for (let q = T.length - 1; q > 0; q--) {
        var z = Math.floor(rand() * (q + 1));
        var F = T[q];
        T[q] = T[z];
        T[z] = F;
    }

    var b = [];
    for (var P = 0; P < A.length; ++P) {
        b.push(Y[parseInt(A[P], 16)]);
    }

    return b;
}




function get_result(arg1){
    // var arg1 = "5fc561f4f314c89fb5fa4840ec846e89d60e4492d7d54c6f83";
    // var arg1 = "5fc56326db6d5621f82eb8db2c296274ab4310e0160f7b3828";
    Ttt = arg1["slice"](0,40)["split"]('')
    Tttt = fill(Ttt)
    P = j(Tttt)["join"]('')

    Tt = [
      false,
      undefined,
      true,
      true,
      false,
    ]
    for (let L = 0; L < Tt.length; ++L) {
        let G = Math.floor(128 * Math.random());
        if ((Tt[L] && G % 2 === 0) || (!Tt[L] && G % 2 !== 0)) G++;
        P += G.toString(16).padStart(2, '0');
        console.log(G.toString(16).padStart(2, '0'))
    }

    result = "197d84838-" + P.toLowerCase()

    // console.log(Tttt.toString())
    // console.log(P)
    // console.log(result)
    return result
}


