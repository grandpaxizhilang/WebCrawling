function d() {
  for (;;) {
    var t = o[a++];
    switch (t) {
      case 0:
        var r = o[a++];
        p -= r;
        var e = v.slice(p + 1, p + r + 1),
          n = v[p--],
          d = v[p--];
        if ("function" != typeof n) {
          return f = 3, void (l = new TypeError(typeof n + " is not a function"));
        }
        var y = V.get(n);
        if (y) {
          h.push([o, i, u, s, c, a, f, l]);
          g(y[0], d, e, y[1]);
        } else {
          var m = n.apply(d, e);
          v[++p] = m;
        }
        break;
      case 1:
        var w = v[p--];
        v[p] = v[p] <= w;
        break;
      case 2:
        w = v[p--];
        v[p] = v[p] > w;
        break;
      case 3:
        var x = o[a++],
          S = v[p--],
          P = [];
        for (var j in S) P.push(j);
        s[x] = [P, S];
        break;
      case 4:
        x = o[a++];
        var O = v[p--],
          R = v[p--];
        P = s[x];
        j = void 0;
        do {
          j = P[0].shift();
        } while (void 0 !== j && !(j in P[1]));
        if (void 0 !== j) {
          R[O] = j;
          v[++p] = !0;
        } else {
          v[++p] = !1;
        }
        break;
      case 5:
        x = o[a++];
        var A = Z[x],
          E = b(A, i);
        v[++p] = E;
        v[++p] = A;
        break;
      case 6:
        w = v[p--];
        v[p] = v[p] !== w;
        break;
      case 7:
        v[++p] = {};
        break;
      case 8:
        var k = v[p--];
        v[p] = v[p][k];
        break;
      case 9:
        v[++p] = !0;
        break;
      case 10:
        v[p] = void 0;
        break;
      case 11:
        E = v[p--];
        v[p] %= E;
        break;
      case 12:
        w = v[p--];
        v[p] = v[p] & w;
        break;
      case 13:
        S = v[p--];
        v[p] = v[p] instanceof S;
        break;
      case 14:
        E = v[p--];
        var T = v[p--];
        (S = v[p--])[T] = E;
        break;
      case 15:
        x = o[a++];
        E = v[p--];
        var C = Z[x];
        if (i && !(C in globalThis)) {
          return f = 3, void (l = new ReferenceError(C + " is not defined"));
        }
        globalThis[C] = E;
        break;
      case 16:
        var L = v[p--];
        (S = v[p--])[L] = v[p];
        break;
      case 17:
        var U = o[a++];
        if (v[p]) {
          --p;
        } else {
          a += U;
        }
        break;
      case 18:
        E = v[p];
        v[++p] = E;
        break;
      case 19:
        w = v[p--];
        v[p] = v[p] >>> w;
        break;
      case 20:
        x = o[a++];
        E = v[p--];
        (S = v[p--])[Z[x]] = E;
        break;
      case 21:
        E = v[p--];
        v[p] -= E;
        break;
      case 22:
        if (f !== 0) {
          return;
        }
        break;
      case 23:
        U = o[a++];
        E = v[p--];
        v[p] === E && (--p, a += U);
        break;
      case 24:
        v[p] = typeof v[p];
        break;
      case 25:
        var I = v[p--];
        E = delete (S = v[p--])[I];
        v[++p] = E;
        break;
      case 26:
        --p;
        break;
      case 27:
        v[++p] = !1;
        break;
      case 28:
        v[++p] = NaN;
        break;
      case 29:
        v[p] = !v[p];
        break;
      case 30:
        x = o[a++];
        v[p] = v[p][Z[x]];
        break;
      case 31:
        U = o[a++];
        v[p] ? a += U : --p;
        break;
      case 32:
        w = v[p--];
        v[p] = v[p] < w;
        break;
      case 33:
        v[++p] = void 0;
        break;
      case 34:
        v[++p] = c;
        break;
      case 35:
        w = v[p--];
        v[p] = v[p] >> w;
        break;
      case 36:
        v[p] = +v[p];
        break;
      case 37:
        v[p] = ~v[p];
        break;
      case 38:
        v[++p] = o[a++];
        break;
      case 39:
        var F = o[a++];
        v[p = p - F + 1] = v.slice(p, p + F);
        break;
      case 40:
        var M = v[p--];
        E = ++(S = v[p--])[M];
        v[++p] = E;
        break;
      case 41:
        U = o[a++];
        v[p--] || (a += U);
        break;
      case 42:
        E = v[p--];
        v[p] /= E;
        break;
      case 43:
        v[p] = -v[p];
        break;
      case 44:
        var B = v[p--];
        E = --(S = v[p--])[B];
        v[++p] = E;
        break;
      case 45:
        E = v[p--];
        v[p] *= E;
        break;
      case 46:
        x = o[a++];
        v[++p] = +Z[x];
        break;
      case 47:
        x = o[a++];
        var Q = v[p--];
        Object.defineProperty(v[p], Z[x], {
          get: Q,
          enumerable: !0,
          configurable: !0
        });
        break;
      case 48:
        x = o[a++];
        var H = v[p--];
        Object.defineProperty(v[p], Z[x], {
          set: H,
          enumerable: !0,
          configurable: !0
        });
        break;
      case 49:
        return f = 3, void (l = v[p--]);
        break;
      case 50:
        var q = v[p--];
        E = (S = v[p--])[q]++;
        v[++p] = E;
        break;
      case 51:
        w = v[p--];
        v[p] = v[p] | w;
        break;
      case 52:
        return U = o[a++], f = 1, void (l = a + U);
        break;
      case 53:
        U = o[a++];
        a += U;
        break;
      case 54:
        var N = o[a++];
        for (x = o[a++], U = s; N > 0;) {
          U = U[0];
          --N;
        }
        U[x] = v[p--];
        break;
      case 55:
        S = v[p--];
        v[p] = v[p] in S;
        break;
      case 56:
        w = v[p--];
        v[p] = v[p] << w;
        break;
      case 57:
        w = v[p--];
        v[p] = v[p] === w;
        break;
      case 58:
        w = v[p--];
        v[p] = v[p] == w;
        break;
      case 59:
        r = o[a++];
        for (var G = [void 0]; r > 0;) {
          G[r--] = v[p--];
        }
        var z = v[p--];
        m = new (Function.bind.apply(z, G))();
        v[++p] = m;
        break;
      case 60:
        x = o[a++];
        var Y = Z[x];
        if (!(Y in globalThis)) {
          return f = 3, void (l = new ReferenceError(Y + " is not defined"));
        }
        E = globalThis[Y];
        v[++p] = E;
        break;
      case 61:
        for (N = o[a++], x = o[a++], U = s; N > 0;) {
          U = U[0];
          --N;
        }
        v[++p] = U;
        v[++p] = x;
        break;
      case 62:
        w = v[p--];
        v[p] = v[p] != w;
        break;
      case 63:
        E = D(o[a++], s);
        v[++p] = E;
        break;
      case 64:
        w = v[p--];
        v[p] = v[p] >= w;
        break;
      case 65:
        v[++p] = 1 / 0;
        break;
      case 66:
        var J = v[p--];
        E = (S = v[p--])[J]--;
        v[++p] = E;
        break;
      case 67:
        x = o[a++];
        E = v[p--];
        Object.defineProperty(v[p], Z[x], {
          value: E,
          writable: !0,
          configurable: !0,
          enumerable: !0
        });
        break;
      case 68:
        E = v[p--];
        v[p] += E;
        break;
      case 69:
        x = o[a++];
        var X = Z[x];
        E = typeof globalThis[X];
        v[++p] = E;
        break;
      case 70:
        w = v[p--];
        v[p] = v[p] ^ w;
        break;
      case 71:
        U = o[a++];
        v[p--] && (a += U);
        break;
      case 72:
        x = o[a++];
        var W = Z[x];
        W in globalThis || (globalThis[W] = void 0);
        break;
      case 73:
        x = o[a++];
        v[++p] = Z[x];
        break;
      case 74:
        for (N = o[a++], x = o[a++], U = s; N > 0;) {
          U = U[0];
          --N;
        }
        E = U[x];
        v[++p] = E;
        break;
      case 75:
        v[++p] = null;
        break;
      default:
        return f = 2, void (l = v[p--]);
    }
  }
}