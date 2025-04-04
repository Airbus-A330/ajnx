"use strict";
var TMIN = 1,
    TMAX = 26,
    BASE = 36,
    SKEW = 38,
    DAMP = 700,
    INITIAL_N = 128,
    INITIAL_BIAS = 72;
function adaptBias(r, t, e) {
    (r /= e ? DAMP : 2), (r += ~~(r / t));
    for (var n = BASE - TMIN, i = ~~((n * TMAX) / 2), o = 0; i < r; o += BASE)
        r = ~~(r / n);
    var a, A;
    return o + ~~(((BASE - TMIN + 1) * r) / (r + SKEW));
}
function decodeDigit(r) {
    if (48 <= r && r <= 57) return r - 22;
    if (65 <= r && r <= 90) return r - 65;
    if (97 <= r && r <= 122) return r - 97;
    throw new Error("Illegal digit #" + r);
}
function threshold(r, t) {
    return r <= t + TMIN ? TMIN : t + TMAX <= r ? TMAX : r - t;
}
function decode(r) {
    if ("string" != typeof r) throw new Error("Argument must be a string.");
    for (
        var t = 1 + r.lastIndexOf("-"),
            e = (r = r.split("").map(function (r) {
                return r.charCodeAt(0);
            })).slice(0, t ? t - 1 : 0),
            n = INITIAL_N,
            i = INITIAL_BIAS,
            o = 0,
            a = r.length;
        t < a;
        ++o
    ) {
        for (var A = o, I = BASE, u = 1; ; I += BASE) {
            var f = decodeDigit(r[t++]);
            o += f * u;
            var c = threshold(I, i);
            if (f < c) break;
            u *= BASE - c;
        }
        var d = 1 + e.length;
        (i = adaptBias(o - A, d, 0 === A)),
            (n += ~~(o / d)),
            (o %= d),
            e.splice(o, 0, n);
    }
    return String.fromCharCode.apply(String, e);
}
function punyDecodeDomain(r) {
    for (var t = r.split("."), e = [], n = 0; n < t.length; ++n) {
        var i = t[n];
        e.push(i.match(/^xn--/) ? decode(i.slice(4)) : i);
    }
    return e.join(".");
}
