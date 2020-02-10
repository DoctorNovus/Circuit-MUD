"use strict";

function e(e) {
    return e && "object" == typeof e && "default" in e ? e.default : e;
}

var t = require("net"), n = e(require("fs")), r = e(require("path")), i = e(require("url")), o = e(require("stream")), a = e(require("child_process")), s = e(require("os")), l = e(require("util")), u = e(require("events")), c = e(require("buffer")), h = e(require("assert")), d = e(require("crypto"));

var f = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

function p() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}

function v(e, t) {
    return e(t = {
        exports: {}
    }, t.exports), t.exports;
}

function b(e) {
    return e && e.default || e;
}

var g = v((function(e, t) {
    function n(e) {
        1 === arguments.length && Array.isArray(e) || (e = Array.prototype.slice.call(arguments, 0));
        for (var t = 0, n = e.length, i = []; t < n; t++) i[t] = "string" == typeof e[t] ? e[t] : String(e[t]);
        // sort them lexicographically, so that they're next to their nearest kin
                // walk through each, seeing how much it has in common with the next and previous
        var o = {}, a = "";
        for (t = 0, n = (i = i.sort(r)).length; t < n; t++) {
            var s = i[t], l = i[t + 1] || "", u = !0, c = !0;
            if (s !== l) {
                for (var h = 0, d = s.length; h < d; h++) {
                    var f = s.charAt(h);
                    if (u = u && f === l.charAt(h), c = c && f === a.charAt(h), !u && !c) {
                        h++;
                        break;
                    }
                }
                if (a = s, h !== d) for (var p = s.substr(0, h); h <= d; h++) o[p] = s, p += s.charAt(h); else o[s] = s;
            }
        }
        return o;
    }
    function r(e, t) {
        return e === t ? 0 : e > t ? 1 : -1;
    }
    e.exports = n.abbrev = n, n.monkeyPatch = function() {
        Object.defineProperty(Array.prototype, "abbrev", {
            value: function() {
                return n(this);
            },
            enumerable: !1,
            configurable: !0,
            writable: !0
        }), Object.defineProperty(Object.prototype, "abbrev", {
            value: function() {
                return n(Object.keys(this));
            },
            enumerable: !1,
            configurable: !0,
            writable: !0
        });
    };
})), _ = "win32" === process.platform, m = _ ? /[^:]\\$/ : /.\/$/, y = function() {
    var e;
    return e = _ ? process.env.TEMP || process.env.TMP || (process.env.SystemRoot || process.env.windir) + "\\temp" : process.env.TMPDIR || process.env.TMP || process.env.TEMP || "/tmp", 
    m.test(e) && (e = e.slice(0, -1)), e;
};

var w = "function" == typeof s.homedir ? s.homedir : function() {
    var e = process.env, t = e.HOME, n = e.LOGNAME || e.USER || e.LNAME || e.USERNAME;
    return "win32" === process.platform ? e.USERPROFILE || e.HOMEDRIVE + e.HOMEPATH || t || null : "darwin" === process.platform ? t || (n ? "/Users/" + n : null) : "linux" === process.platform ? t || (0 === process.getuid() ? "/root" : n ? "/home/" + n : null) : t || null;
}, E = v((function(e, t) {
    var n = "win32" === process.platform, r = a.exec;
    // looking up envs is a bit costly.
    // Also, sometimes we want to have a fallback
    // Pass in a callback to wait for the fallback on failures
    // After the first lookup, always returns the same thing.
    function i(e, n, i) {
        var o = !1, a = !1;
        t[e] = function(s) {
            var l = n();
            return l || o || a || !i || (o = !0, a = !0, r(i, (function(e, t, n) {
                a = !1, e || (// oh well, we tried
                l = t.trim());
            }))), t[e] = function(e) {
                return e && process.nextTick(e.bind(null, null, l)), l;
            }, s && !a && process.nextTick(s.bind(null, null, l)), l;
        };
    }
    i("user", (function() {
        return n ? process.env.USERDOMAIN + "\\" + process.env.USERNAME : process.env.USER;
    }), "whoami"), i("prompt", (function() {
        return n ? process.env.PROMPT : process.env.PS1;
    })), i("hostname", (function() {
        return n ? process.env.COMPUTERNAME : process.env.HOSTNAME;
    }), "hostname"), i("tmpdir", (function() {
        return y();
    })), i("home", (function() {
        return w();
    })), i("path", (function() {
        return (process.env.PATH || process.env.Path || process.env.path).split(n ? ";" : ":");
    })), i("editor", (function() {
        return process.env.EDITOR || process.env.VISUAL || (n ? "notepad.exe" : "vi");
    })), i("shell", (function() {
        return n ? process.env.ComSpec || "cmd" : process.env.SHELL || "bash";
    }));
})), k = v((function(e, t) {
    // info about each config option.
    var n = process.env.DEBUG_NOPT || process.env.NOPT_DEBUG ? function() {
        console.error.apply(console, arguments);
    } : function() {}, a = o.Stream;
    function s(e, r, i) {
        i = i || t.typeDefs;
        var o = {}, a = [ !1, !0, null, String, Array ];
        Object.keys(e).forEach((function(s) {
            if ("argv" !== s) {
                var l = e[s], u = Array.isArray(l), c = r[s];
                u || (l = [ l ]), c || (c = a), c === Array && (c = a.concat(Array)), Array.isArray(c) || (c = [ c ]), 
                n("val=%j", l), n("types=", c), (l = l.map((function(a) {
                    if (
                    // if it's an unknown value, then parse false/true/null/numbers/dates
                    "string" == typeof a && (n("string %j", a), "null" === (a = a.trim()) && ~c.indexOf(null) || "true" === a && (~c.indexOf(!0) || ~c.indexOf(Boolean)) || "false" === a && (~c.indexOf(!1) || ~c.indexOf(Boolean)) ? (a = JSON.parse(a), 
                    n("jsonable %j", a)) : ~c.indexOf(Number) && !isNaN(a) ? (n("convert to number", a), 
                    a = +a) : ~c.indexOf(Date) && !isNaN(Date.parse(a)) && (n("convert to date", a), 
                    a = new Date(a))), !r.hasOwnProperty(s)) return a;
                    // allow `--no-blah` to set 'blah' to null if null is allowed
                                        !1 !== a || !~c.indexOf(null) || ~c.indexOf(!1) || ~c.indexOf(Boolean) || (a = null);
                    var l = {};
                    return l[s] = a, n("prevalidated val", l, a, r[s]), function e(t, r, i, o, a) {
                        // arrays are lists of types.
                        if (Array.isArray(o)) {
                            for (var s = 0, l = o.length; s < l; s++) if (o[s] !== Array && e(t, r, i, o[s], a)) return !0;
                            return delete t[r], !1;
                        }
                        // an array of anything?
                                                if (o === Array) return !0;
                        // NaN is poisonous.  Means that something is not allowed.
                                                if (o != o) return n("Poison NaN", r, i, o), delete t[r], 
                        !1;
                        // explicit list of values
                                                if (i === o) return n("Explicitly allowed %j", i), 
                        // if (isArray) (data[k] = data[k] || []).push(val)
                        // else data[k] = val
                        t[r] = i, !0;
                        // now go through the list of typeDefs, validate against each one.
                                                var u = !1, c = Object.keys(a);
                        for (s = 0, l = c.length; s < l; s++) {
                            n("test type %j %j %j", r, i, c[s]);
                            var h = a[c[s]];
                            if (h && (o && o.name && h.type && h.type.name ? o.name === h.type.name : o === h.type)) {
                                var d = {};
                                if (u = !1 !== h.validate(d, r, i), i = d[r], u) {
                                    // if (isArray) (data[k] = data[k] || []).push(val)
                                    // else data[k] = val
                                    t[r] = i;
                                    break;
                                }
                            }
                        }
                        n("OK? %j (%j %j %j)", u, r, i, c[s]), u || delete t[r];
                        return u;
                    }(l, s, a, r[s], i) ? (n("validated val", l, a, r[s]), l[s]) : (t.invalidHandler ? t.invalidHandler(s, a, r[s], e) : !1 !== t.invalidHandler && n("invalid: " + s + "=" + a, r[s]), 
                    o);
                })).filter((function(e) {
                    return e !== o;
                }))).length ? u ? (n(u, e[s], l), e[s] = l) : e[s] = l[0] : delete e[s], n("k=%s val=%j", s, l, e[s]);
            }
        }));
    }
    function l(e, t, r, i) {
        // if it's an exact known option, then don't go any further
        if (i[
        // handle single-char shorthands glommed together, like
        // npm ls -glp, but only if there is one dash, and only if
        // all of the chars are single-char shorthands, and it's
        // not a match to some other abbrev.
        e = e.replace(/^-+/, "")] === e) return null;
        // if it's an exact known shortopt, same deal
                if (t[e]) 
        // make it an array, if it's a list of words
        return t[e] && !Array.isArray(t[e]) && (t[e] = t[e].split(/\s+/)), t[e];
        // first check to see if this arg is a set of single-char shorthands
                var o = t.___singles;
        o || (o = Object.keys(t).filter((function(e) {
            return 1 === e.length;
        })).reduce((function(e, t) {
            return e[t] = !0, e;
        }), {}), t.___singles = o, n("shorthand singles", o));
        var a = e.split("").filter((function(e) {
            return o[e];
        }));
        return a.join("") === e ? a.map((function(e) {
            return t[e];
        })).reduce((function(e, t) {
            return e.concat(t);
        }), []) : 
        // if it's an arg abbrev, and not a literal shorthand, then prefer the arg
        i[e] && !t[e] ? null : (
        // if it's an abbr for a shorthand, then use that
        r[e] && (e = r[e]), 
        // make it an array, if it's a list of words
        t[e] && !Array.isArray(t[e]) && (t[e] = t[e].split(/\s+/)), t[e]);
    }
    e.exports = t = function(e, r, i, o) {
        i = i || process.argv, "number" != typeof o && (o = 2);
        n(e = e || {}, r = r || {}, i, o), i = i.slice(o);
        var a = {}, u = {
            remain: [],
            cooked: i,
            original: i.slice(0)
        };
        return function(e, t, r, i, o) {
            n("parse", e, t, r);
            for (var a = g(Object.keys(i)), s = g(Object.keys(o)), u = 0; u < e.length; u++) {
                var c = e[u];
                if (n("arg", c), c.match(/^-{2,}$/)) {
                    // done with keys.
                    // the rest are args.
                    r.push.apply(r, e.slice(u + 1)), e[u] = "--";
                    break;
                }
                var h = !1;
                if ("-" === c.charAt(0) && c.length > 1) {
                    var d = c.indexOf("=");
                    if (d > -1) {
                        h = !0;
                        var f = c.substr(d + 1);
                        c = c.substr(0, d), e.splice(u, 1, c, f);
                    }
                    // see if it's a shorthand
                    // if so, splice and back up to re-parse it.
                                        var p = l(c, o, s, a);
                    if (n("arg=%j shRes=%j", c, p), p && (n(c, p), e.splice.apply(e, [ u, 1 ].concat(p)), 
                    c !== p[0])) {
                        u--;
                        continue;
                    }
                    c = c.replace(/^-+/, "");
                    for (var v = null; 0 === c.toLowerCase().indexOf("no-"); ) v = !v, c = c.substr(3);
                    a[c] && (c = a[c]);
                    var b = i[c], _ = Array.isArray(b);
                    _ && 1 === b.length && (_ = !1, b = b[0]);
                    var m = b === Array || _ && -1 !== b.indexOf(Array);
                    // allow unknown things to be arrays if specified multiple times.
                                        !i.hasOwnProperty(c) && t.hasOwnProperty(c) && (Array.isArray(t[c]) || (t[c] = [ t[c] ]), 
                    m = !0);
                    var y, w = e[u + 1];
                    if ("boolean" == typeof v || b === Boolean || _ && -1 !== b.indexOf(Boolean) || void 0 === b && !h || "false" === w && (null === b || _ && ~b.indexOf(null))) {
                        // just set and move along
                        y = !v, 
                        // however, also support --bool true or --bool false
                        "true" !== w && "false" !== w || (y = JSON.parse(w), w = null, v && (y = !y), u++), 
                        // also support "foo":[Boolean, "bar"] and "--foo bar"
                        _ && w && (~b.indexOf(w) ? (
                        // an explicit type
                        y = w, u++) : "null" === w && ~b.indexOf(null) ? (
                        // null allowed
                        y = null, u++) : w.match(/^-{2,}[^-]/) || isNaN(w) || !~b.indexOf(Number) ? !w.match(/^-[^-]/) && ~b.indexOf(String) && (
                        // string
                        y = w, u++) : (
                        // number
                        y = +w, u++)), m ? (t[c] = t[c] || []).push(y) : t[c] = y;
                        continue;
                    }
                    b === String && (void 0 === w ? w = "" : w.match(/^-{1,2}[^-]+/) && (w = "", u--)), 
                    w && w.match(/^-{2,}$/) && (w = void 0, u--), y = void 0 === w || w, m ? (t[c] = t[c] || []).push(y) : t[c] = y, 
                    u++;
                } else r.push(c);
            }
        }(i, a, u.remain, e, r), 
        // now data is full
        s(a, e, t.typeDefs), a.argv = u, Object.defineProperty(a.argv, "toString", {
            value: function() {
                return this.original.map(JSON.stringify).join(" ");
            },
            enumerable: !1
        }), a;
    }, t.clean = s, t.typeDefs = {
        String: {
            type: String,
            validate: function(e, t, n) {
                e[t] = String(n);
            }
        },
        Boolean: {
            type: Boolean,
            validate: function(e, t, n) {
                n = n instanceof Boolean ? n.valueOf() : "string" == typeof n ? isNaN(n) ? "null" !== n && "false" !== n : !!+n : !!n;
                e[t] = n;
            }
        },
        url: {
            type: i,
            validate: function(e, t, n) {
                if (!(n = i.parse(String(n))).host) return !1;
                e[t] = n.href;
            }
        },
        Number: {
            type: Number,
            validate: function(e, t, r) {
                if (n("validate Number %j %j %j", t, r, isNaN(r)), isNaN(r)) return !1;
                e[t] = +r;
            }
        },
        path: {
            type: r,
            validate: function(e, t, n) {
                if (!0 === n) return !1;
                if (null === n) return !0;
                n = String(n);
                var i = "win32" === process.platform ? /^~(\/|\\)/ : /^~\//, o = E.home();
                o && n.match(i) ? e[t] = r.resolve(o, n.substr(2)) : e[t] = r.resolve(n);
                return !0;
            }
        },
        Stream: {
            type: a,
            validate: function(e, t, n) {
                if (!(n instanceof a)) return !1;
                e[t] = n;
            }
        },
        Date: {
            type: Date,
            validate: function(e, t, r) {
                var i = Date.parse(r);
                if (n("validate Date %j %j %j", t, r, i), isNaN(i)) return !1;
                e[t] = new Date(r);
            }
        }
    };
})), S = (k.clean, k.typeDefs, v((function(e) {
    var t = u.EventEmitter, n = 0, r = e.exports = function(e) {
        t.call(this), this.id = ++n, this.name = e;
    };
    l.inherits(r, t);
}))), x = v((function(e) {
    var t = e.exports = function(e, t) {
        S.call(this, e), this.workDone = 0, this.workTodo = t || 0;
    };
    l.inherits(t, S), t.prototype.completed = function() {
        return 0 === this.workTodo ? 0 : this.workDone / this.workTodo;
    }, t.prototype.addWork = function(e) {
        this.workTodo += e, this.emit("change", this.name, this.completed(), this);
    }, t.prototype.completeWork = function(e) {
        this.workDone += e, this.workDone > this.workTodo && (this.workDone = this.workTodo), 
        this.emit("change", this.name, this.completed(), this);
    }, t.prototype.finish = function() {
        this.workTodo = this.workDone = 1, this.emit("change", this.name, 1, this);
    };
})), j = v((function(e) {
    "undefined" == typeof process || !process.version || 0 === process.version.indexOf("v0.") || 0 === process.version.indexOf("v1.") && 0 !== process.version.indexOf("v1.8.") ? e.exports = {
        nextTick: function(e, t, n, r) {
            if ("function" != typeof e) throw new TypeError('"callback" argument must be a function');
            var i, o, a = arguments.length;
            switch (a) {
              case 0:
              case 1:
                return process.nextTick(e);

              case 2:
                return process.nextTick((function() {
                    e.call(null, t);
                }));

              case 3:
                return process.nextTick((function() {
                    e.call(null, t, n);
                }));

              case 4:
                return process.nextTick((function() {
                    e.call(null, t, n, r);
                }));

              default:
                for (i = new Array(a - 1), o = 0; o < i.length; ) i[o++] = arguments[o];
                return process.nextTick((function() {
                    e.apply(null, i);
                }));
            }
        }
    } : e.exports = process;
})), T = (j.nextTick, {}.toString), O = Array.isArray || function(e) {
    return "[object Array]" == T.call(e);
}, A = o, R = v((function(e, t) {
    /* eslint-disable node/no-deprecated-api */
    var n = c.Buffer;
    // alternative to using Object.keys for old browsers
        function r(e, t) {
        for (var n in e) t[n] = e[n];
    }
    function i(e, t, r) {
        return n(e, t, r);
    }
    // Copy static methods from Buffer
        n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? e.exports = c : (
    // Copy properties from require('buffer')
    r(c, t), t.Buffer = i), r(n, i), i.from = function(e, t, r) {
        if ("number" == typeof e) throw new TypeError("Argument must not be a number");
        return n(e, t, r);
    }, i.alloc = function(e, t, r) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        var i = n(e);
        return void 0 !== t ? "string" == typeof r ? i.fill(t, r) : i.fill(t) : i.fill(0), 
        i;
    }, i.allocUnsafe = function(e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return n(e);
    }, i.allocUnsafeSlow = function(e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return c.SlowBuffer(e);
    };
}));

R.Buffer;

function C(e) {
    return Object.prototype.toString.call(e);
}

var M = {
    isArray: 
    // Copyright Joyent, Inc. and other Node contributors.
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.
    function(e) {
        return Array.isArray ? Array.isArray(e) : "[object Array]" === C(e);
    },
    isBoolean: function(e) {
        return "boolean" == typeof e;
    },
    isNull: function(e) {
        return null === e;
    },
    isNullOrUndefined: function(e) {
        return null == e;
    },
    isNumber: function(e) {
        return "number" == typeof e;
    },
    isString: function(e) {
        return "string" == typeof e;
    },
    isSymbol: function(e) {
        return "symbol" == typeof e;
    },
    isUndefined: function(e) {
        return void 0 === e;
    },
    isRegExp: function(e) {
        return "[object RegExp]" === C(e);
    },
    isObject: function(e) {
        return "object" == typeof e && null !== e;
    },
    isDate: function(e) {
        return "[object Date]" === C(e);
    },
    isError: function(e) {
        return "[object Error]" === C(e) || e instanceof Error;
    },
    isFunction: function(e) {
        return "function" == typeof e;
    },
    isPrimitive: function(e) {
        return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || // ES6 symbol
        void 0 === e;
    },
    isBuffer: Buffer.isBuffer
}, N = v((function(e) {
    "function" == typeof Object.create ? 
    // implementation from standard node.js 'util' module
    e.exports = function(e, t) {
        t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }));
    } : 
    // old school shim for old browsers
    e.exports = function(e, t) {
        if (t) {
            e.super_ = t;
            var n = function() {};
            n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e;
        }
    };
})), I = v((function(e) {
    try {
        var t = l;
        /* istanbul ignore next */        if ("function" != typeof t.inherits) throw "";
        e.exports = t.inherits;
    } catch (t) {
        /* istanbul ignore next */
        e.exports = N;
    }
})), L = v((function(e) {
    var t = R.Buffer;
    e.exports = function() {
        function e() {
            !function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), this.head = null, this.tail = null, this.length = 0;
        }
        return e.prototype.push = function(e) {
            var t = {
                data: e,
                next: null
            };
            this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
        }, e.prototype.unshift = function(e) {
            var t = {
                data: e,
                next: this.head
            };
            0 === this.length && (this.tail = t), this.head = t, ++this.length;
        }, e.prototype.shift = function() {
            if (0 !== this.length) {
                var e = this.head.data;
                return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, 
                --this.length, e;
            }
        }, e.prototype.clear = function() {
            this.head = this.tail = null, this.length = 0;
        }, e.prototype.join = function(e) {
            if (0 === this.length) return "";
            for (var t = this.head, n = "" + t.data; t = t.next; ) n += e + t.data;
            return n;
        }, e.prototype.concat = function(e) {
            if (0 === this.length) return t.alloc(0);
            if (1 === this.length) return this.head.data;
            for (var n, r, i, o = t.allocUnsafe(e >>> 0), a = this.head, s = 0; a; ) n = a.data, 
            r = o, i = s, n.copy(r, i), s += a.data.length, a = a.next;
            return o;
        }, e;
    }(), l && l.inspect && l.inspect.custom && (e.exports.prototype[l.inspect.custom] = function() {
        var e = l.inspect({
            length: this.length
        });
        return this.constructor.name + " " + e;
    });
}));

function P(e, t) {
    e.emit("error", t);
}

var D = 
/*<replacement>*/
/*</replacement>*/
// undocumented cb() API, needed for core, not for public API
function(e, t) {
    var n = this, r = this._readableState && this._readableState.destroyed, i = this._writableState && this._writableState.destroyed;
    return r || i ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || j.nextTick(P, this, e), 
    this) : (
    // we set destroyed to true before firing error callbacks in order
    // to make it re-entrance safe in case destroy() is called within callbacks
    this._readableState && (this._readableState.destroyed = !0), 
    // if this is a duplex stream mark the writable part as destroyed as well
    this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, (function(e) {
        !t && e ? (j.nextTick(P, n, e), n._writableState && (n._writableState.errorEmitted = !0)) : t && t(e);
    })), this);
}, B = function() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, 
    this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, 
    this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, 
    this._writableState.errorEmitted = !1);
}, U = l.deprecate, $ = Q;

/**
 * For Node.js, simply re-export the core `util.deprecate` function.
 */
// It seems a linked list but it is not
// there will be only 2 of these for each stream
function G(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
        !function(e, t, n) {
            var r = e.entry;
            e.entry = null;
            for (;r; ) {
                var i = r.callback;
                t.pendingcb--, i(n), r = r.next;
            }
            t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
        }(t, e);
    };
}

/* </replacement> */
/*<replacement>*/ var q, W = !process.browser && [ "v0.10", "v0.9." ].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : j.nextTick;

/*</replacement>*/
/*<replacement>*/
/*</replacement>*/
Q.WritableState = Z;

/*<replacement>*/
var F = Object.create(M);

F.inherits = I;

/*</replacement>*/
/*<replacement>*/
var H, z = {
    deprecate: U
}, Y = R.Buffer, V = f.Uint8Array || function() {};

/*</replacement>*/
/*<replacement>*/
/*</replacement>*/
/*<replacement>*/ function J() {}

function Z(e, t) {
    e = e || {};
    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
    var n = t instanceof (q = q || oe);
    // object stream flag to indicate whether or not this stream
    // contains buffers or objects.
        this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    // the point at which write() starts returning false
    // Note: 0 is a valid value, means that we always return false if
    // the entire buffer is not flushed immediately on write()
    var r = e.highWaterMark, i = e.writableHighWaterMark, o = this.objectMode ? 16 : 16384;
    this.highWaterMark = r || 0 === r ? r : n && (i || 0 === i) ? i : o, 
    // cast to ints.
    this.highWaterMark = Math.floor(this.highWaterMark), 
    // if _final has been called
    this.finalCalled = !1, 
    // drain event flag.
    this.needDrain = !1, 
    // at the start of calling end()
    this.ending = !1, 
    // when end() has been called, and returned
    this.ended = !1, 
    // when 'finish' is emitted
    this.finished = !1, 
    // has it been destroyed
    this.destroyed = !1;
    // should we decode strings into buffers before passing to _write?
    // this is here so that some node-core streams can optimize string
    // handling at a lower level.
    var a = !1 === e.decodeStrings;
    this.decodeStrings = !a, 
    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = e.defaultEncoding || "utf8", 
    // not an actual buffer we keep track of, but a measurement
    // of how much we're waiting to get pushed to some underlying
    // socket or file.
    this.length = 0, 
    // a flag to see when we're in the middle of a write.
    this.writing = !1, 
    // when true all writes will be buffered until .uncork() call
    this.corked = 0, 
    // a flag to be able to tell if the onwrite cb is called immediately,
    // or on a later tick.  We set this to true at first, because any
    // actions that shouldn't happen until "later" should generally also
    // not happen before the first write call.
    this.sync = !0, 
    // a flag to know if we're processing previously buffered items, which
    // may call the _write() callback in the same tick, so that we don't
    // end up in an overlapped onwrite situation.
    this.bufferProcessing = !1, 
    // the callback that's passed to _write(chunk,cb)
    this.onwrite = function(e) {
        !function(e, t) {
            var n = e._writableState, r = n.sync, i = n.writecb;
            if (function(e) {
                e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
            }(n), t) !function(e, t, n, r, i) {
                --t.pendingcb, n ? (
                // defer the callback if we are being called synchronously
                // to avoid piling up things on the stack
                j.nextTick(i, r), 
                // this can emit finish, and it will always happen
                // after error
                j.nextTick(re, e, t), e._writableState.errorEmitted = !0, e.emit("error", r)) : (
                // the caller expect this to happen before if
                // it is async
                i(r), e._writableState.errorEmitted = !0, e.emit("error", r), 
                // this can emit finish, but finish must
                // always follow error
                re(e, t));
            }(e, n, r, t, i); else {
                // Check if we're actually ready to finish, but don't emit yet
                var o = te(n);
                o || n.corked || n.bufferProcessing || !n.bufferedRequest || ee(e, n), r ? 
                /*<replacement>*/
                W(K, e, n, o, i) : K(e, n, o, i);
            }
        }(t, e);
    }, 
    // the callback that the user supplies to write(chunk,encoding,cb)
    this.writecb = null, 
    // the amount that is being written when _write is called.
    this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, 
    // number of pending user-supplied write callbacks
    // this must be 0 before 'finish' can be emitted
    this.pendingcb = 0, 
    // emit prefinish if the only thing we're waiting for is _write cbs
    // This is relevant for synchronous Transform streams
    this.prefinished = !1, 
    // True if the error was already emitted and should not be thrown again
    this.errorEmitted = !1, 
    // count buffered requests
    this.bufferedRequestCount = 0, 
    // allocate the first CorkedRequest, there is always
    // one allocated and free to use, and we maintain at most two
    this.corkedRequestsFree = new G(this);
}

function Q(e) {
    // Writable ctor is applied to Duplexes, too.
    // `realHasInstance` is necessary because using plain `instanceof`
    // would return false, as no `_writableState` property is attached.
    // Trying to use the custom `instanceof` for Writable here will also break the
    // Node.js LazyTransform implementation, which has a non-trivial getter for
    // `_writableState` that would lead to infinite recursion.
    if (q = q || oe, !(H.call(Q, this) || this instanceof q)) return new Q(e);
    this._writableState = new Z(e, this), 
    // legacy.
    this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), 
    "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), 
    "function" == typeof e.final && (this._final = e.final)), A.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
function X(e, t, n, r, i, o, a) {
    t.writelen = r, t.writecb = a, t.writing = !0, t.sync = !0, n ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), 
    t.sync = !1;
}

function K(e, t, n, r) {
    n || 
    // Must force callback to be called on nextTick, so that we don't
    // emit 'drain' before the write() consumer gets the 'false' return
    // value, and has a chance to attach a 'drain' listener.
    function(e, t) {
        0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
    }
    // if there's something in the buffer waiting, then process it
    (e, t), t.pendingcb--, r(), re(e, t);
}

function ee(e, t) {
    t.bufferProcessing = !0;
    var n = t.bufferedRequest;
    if (e._writev && n && n.next) {
        // Fast case, write everything using _writev()
        var r = t.bufferedRequestCount, i = new Array(r), o = t.corkedRequestsFree;
        o.entry = n;
        for (var a = 0, s = !0; n; ) i[a] = n, n.isBuf || (s = !1), n = n.next, a += 1;
        i.allBuffers = s, X(e, t, !0, t.length, i, "", o.finish), 
        // doWrite is almost always async, defer these to save a bit of time
        // as the hot path ends with doWrite
        t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, 
        o.next = null) : t.corkedRequestsFree = new G(t), t.bufferedRequestCount = 0;
    } else {
        // Slow case, write chunks one-by-one
        for (;n; ) {
            var l = n.chunk, u = n.encoding, c = n.callback;
            // if we didn't call the onwrite immediately, then
            // it means that we need to wait until it does.
            // also, that means that the chunk and cb are currently
            // being processed, so move the buffer counter past them.
            if (X(e, t, !1, t.objectMode ? 1 : l.length, l, u, c), n = n.next, t.bufferedRequestCount--, 
            t.writing) break;
        }
        null === n && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = n, t.bufferProcessing = !1;
}

function te(e) {
    return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
}

function ne(e, t) {
    e._final((function(n) {
        t.pendingcb--, n && e.emit("error", n), t.prefinished = !0, e.emit("prefinish"), 
        re(e, t);
    }));
}

function re(e, t) {
    var n = te(t);
    return n && (!function(e, t) {
        t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, 
        t.finalCalled = !0, j.nextTick(ne, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
    }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), n;
}

/*</replacement>*/
F.inherits(Q, A), Z.prototype.getBuffer = function() {
    for (var e = this.bufferedRequest, t = []; e; ) t.push(e), e = e.next;
    return t;
}, function() {
    try {
        Object.defineProperty(Z.prototype, "buffer", {
            get: z.deprecate((function() {
                return this.getBuffer();
            }), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
    } catch (e) {}
}(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (H = Function.prototype[Symbol.hasInstance], 
Object.defineProperty(Q, Symbol.hasInstance, {
    value: function(e) {
        return !!H.call(this, e) || this === Q && (e && e._writableState instanceof Z);
    }
})) : H = function(e) {
    return e instanceof this;
}, Q.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
}, Q.prototype.write = function(e, t, n) {
    var r, i = this._writableState, o = !1, a = !i.objectMode && (r = e, Y.isBuffer(r) || r instanceof V);
    return a && !Y.isBuffer(e) && (e = function(e) {
        return Y.from(e);
    }(e)), "function" == typeof t && (n = t, t = null), a ? t = "buffer" : t || (t = i.defaultEncoding), 
    "function" != typeof n && (n = J), i.ended ? function(e, t) {
        var n = new Error("write after end");
        // TODO: defer error events consistently everywhere, not just the cb
                e.emit("error", n), j.nextTick(t, n);
    }
    // Checks that a user-supplied chunk is valid, especially for the particular
    // mode the stream is in. Currently this means that `null` is never accepted
    // and undefined/non-string values are only allowed in object mode.
    (this, n) : (a || function(e, t, n, r) {
        var i = !0, o = !1;
        return null === n ? o = new TypeError("May not write null values to stream") : "string" == typeof n || void 0 === n || t.objectMode || (o = new TypeError("Invalid non-string/buffer chunk")), 
        o && (e.emit("error", o), j.nextTick(r, o), i = !1), i;
    }(this, i, e, n)) && (i.pendingcb++, o = 
    // if we're already writing something, then just put this
    // in the queue, and wait our turn.  Otherwise, call _write
    // If we return false, then we need a drain event, so set that flag.
    function(e, t, n, r, i, o) {
        if (!n) {
            var a = function(e, t, n) {
                e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = Y.from(t, n));
                return t;
            }(t, r, i);
            r !== a && (n = !0, i = "buffer", r = a);
        }
        var s = t.objectMode ? 1 : r.length;
        t.length += s;
        var l = t.length < t.highWaterMark;
        // we must ensure that previous needDrain will not be reset to false.
                l || (t.needDrain = !0);
        if (t.writing || t.corked) {
            var u = t.lastBufferedRequest;
            t.lastBufferedRequest = {
                chunk: r,
                encoding: i,
                isBuf: n,
                callback: o,
                next: null
            }, u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, 
            t.bufferedRequestCount += 1;
        } else X(e, t, !1, s, r, i, o);
        return l;
    }(this, i, a, e, t, n)), o;
}, Q.prototype.cork = function() {
    this._writableState.corked++;
}, Q.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || ee(this, e));
}, Q.prototype.setDefaultEncoding = function(e) {
    if (
    // node::ParseEncoding() requires lower case.
    "string" == typeof e && (e = e.toLowerCase()), !([ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
    return this._writableState.defaultEncoding = e, this;
}, Object.defineProperty(Q.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
        return this._writableState.highWaterMark;
    }
}), Q.prototype._write = function(e, t, n) {
    n(new Error("_write() is not implemented"));
}, Q.prototype._writev = null, Q.prototype.end = function(e, t, n) {
    var r = this._writableState;
    "function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, 
    t = null), null != e && this.write(e, t), 
    // .end() fully uncorks
    r.corked && (r.corked = 1, this.uncork()), 
    // ignore unnecessary end() calls.
    r.ending || r.finished || function(e, t, n) {
        t.ending = !0, re(e, t), n && (t.finished ? j.nextTick(n) : e.once("finish", n));
        t.ended = !0, e.writable = !1;
    }(this, r, n);
}, Object.defineProperty(Q.prototype, "destroyed", {
    get: function() {
        return void 0 !== this._writableState && this._writableState.destroyed;
    },
    set: function(e) {
        // we ignore the value if the stream
        // has not been initialized yet
        this._writableState && (
        // backward compatibility, the user is explicitly
        // managing destroyed
        this._writableState.destroyed = e);
    }
}), Q.prototype.destroy = D, Q.prototype._undestroy = B, Q.prototype._destroy = function(e, t) {
    this.end(), t(e);
};

/*<replacement>*/
/*</replacement>*/
/*<replacement>*/
var ie = Object.keys || function(e) {
    var t = [];
    for (var n in e) t.push(n);
    return t;
}, oe = ce, ae = Object.create(M);

/*</replacement>*/ ae.inherits = I, 
/*</replacement>*/
ae.inherits(ce, Te);

for (
// avoid scope creep, the keys array can then be collected
var se = ie($.prototype), le = 0; le < se.length; le++) {
    var ue = se[le];
    ce.prototype[ue] || (ce.prototype[ue] = $.prototype[ue]);
}

function ce(e) {
    if (!(this instanceof ce)) return new ce(e);
    Te.call(this, e), $.call(this, e), e && !1 === e.readable && (this.readable = !1), 
    e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), 
    this.once("end", he);
}

// the no-half-open enforcer
function he() {
    // if we allow half-open state, or if the writable side ended,
    // then we're ok.
    this.allowHalfOpen || this._writableState.ended || 
    // no more data can be written.
    // But allow more writes to happen in this tick.
    j.nextTick(de, this);
}

function de(e) {
    e.end();
}

Object.defineProperty(ce.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
        return this._writableState.highWaterMark;
    }
}), Object.defineProperty(ce.prototype, "destroyed", {
    get: function() {
        return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
    },
    set: function(e) {
        // we ignore the value if the stream
        // has not been initialized yet
        void 0 !== this._readableState && void 0 !== this._writableState && (
        // backward compatibility, the user is explicitly
        // managing destroyed
        this._readableState.destroyed = e, this._writableState.destroyed = e);
    }
}), ce.prototype._destroy = function(e, t) {
    this.push(null), this.end(), j.nextTick(t, e);
};

/*<replacement>*/
var fe = R.Buffer, pe = fe.isEncoding || function(e) {
    switch ((e = "" + e) && e.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;

      default:
        return !1;
    }
};

/*</replacement>*/
// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
var ve = be;

function be(e) {
    var t;
    switch (this.encoding = 
    // Do not cache `Buffer.isEncoding` when checking encoding names as some
    // modules monkey-patch it to support additional encodings
    function(e) {
        var t = function(e) {
            if (!e) return "utf8";
            for (var t; ;) switch (e) {
              case "utf8":
              case "utf-8":
                return "utf8";

              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return "utf16le";

              case "latin1":
              case "binary":
                return "latin1";

              case "base64":
              case "ascii":
              case "hex":
                return e;

              default:
                if (t) return;
 // undefined
                                e = ("" + e).toLowerCase(), t = !0;
            }
        }(e);
        if ("string" != typeof t && (fe.isEncoding === pe || !pe(e))) throw new Error("Unknown encoding: " + e);
        return t || e;
    }(e), this.encoding) {
      case "utf16le":
        this.text = me, this.end = ye, t = 4;
        break;

      case "utf8":
        this.fillLast = _e, t = 4;
        break;

      case "base64":
        this.text = we, this.end = Ee, t = 3;
        break;

      default:
        return this.write = ke, void (this.end = Se);
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = fe.allocUnsafe(t);
}

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function ge(e) {
    return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function _e(e) {
    var t = this.lastTotal - this.lastNeed, n = 
    // Validates as many continuation bytes for a multi-byte UTF-8 character as
    // needed or are available. If we see a non-continuation byte where we expect
    // one, we "replace" the validated continuation bytes we've seen so far with
    // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
    // behavior. The continuation byte check is included three times in the case
    // where all of the continuation bytes for a character exist in the same buffer.
    // It is also done this way as a slight performance increase instead of using a
    // loop.
    function(e, t, n) {
        if (128 != (192 & t[0])) return e.lastNeed = 0, "�";
        if (e.lastNeed > 1 && t.length > 1) {
            if (128 != (192 & t[1])) return e.lastNeed = 1, "�";
            if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, 
            "�";
        }
    }(this, e);
    return void 0 !== n ? n : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), 
    this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), 
    void (this.lastNeed -= e.length));
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function me(e, t) {
    if ((e.length - t) % 2 == 0) {
        var n = e.toString("utf16le", t);
        if (n) {
            var r = n.charCodeAt(n.length - 1);
            if (r >= 55296 && r <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], 
            this.lastChar[1] = e[e.length - 1], n.slice(0, -1);
        }
        return n;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], 
    e.toString("utf16le", t, e.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function ye(e) {
    var t = e && e.length ? this.write(e) : "";
    if (this.lastNeed) {
        var n = this.lastTotal - this.lastNeed;
        return t + this.lastChar.toString("utf16le", 0, n);
    }
    return t;
}

function we(e, t) {
    var n = (e.length - t) % 3;
    return 0 === n ? e.toString("base64", t) : (this.lastNeed = 3 - n, this.lastTotal = 3, 
    1 === n ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], 
    this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - n));
}

function Ee(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function ke(e) {
    return e.toString(this.encoding);
}

function Se(e) {
    return e && e.length ? this.write(e) : "";
}

be.prototype.write = function(e) {
    if (0 === e.length) return "";
    var t, n;
    if (this.lastNeed) {
        if (void 0 === (t = this.fillLast(e))) return "";
        n = this.lastNeed, this.lastNeed = 0;
    } else n = 0;
    return n < e.length ? t ? t + this.text(e, n) : this.text(e, n) : t || "";
}, be.prototype.end = 
// For UTF-8, a replacement character is added when ending on a partial
// character.
function(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed ? t + "�" : t;
}, 
// Returns only complete characters in a Buffer
be.prototype.text = function(e, t) {
    var n = function(e, t, n) {
        var r = t.length - 1;
        if (r < n) return 0;
        var i = ge(t[r]);
        if (i >= 0) return i > 0 && (e.lastNeed = i - 1), i;
        if (--r < n || -2 === i) return 0;
        if ((i = ge(t[r])) >= 0) return i > 0 && (e.lastNeed = i - 2), i;
        if (--r < n || -2 === i) return 0;
        if ((i = ge(t[r])) >= 0) return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3), 
        i;
        return 0;
    }(this, e, t);
    if (!this.lastNeed) return e.toString("utf8", t);
    this.lastTotal = n;
    var r = e.length - (n - this.lastNeed);
    return e.copy(this.lastChar, 0, r), e.toString("utf8", t, r);
}, 
// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
be.prototype.fillLast = function(e) {
    if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), 
    this.lastChar.toString(this.encoding, 0, this.lastTotal);
    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
};

var xe, je = {
    StringDecoder: ve
}, Te = Pe;

/*<replacement>*/
/*</replacement>*/
/*</replacement>*/
Pe.ReadableState = Le;

/*<replacement>*/
u.EventEmitter;

var Oe = function(e, t) {
    return e.listeners(t).length;
}, Ae = R.Buffer, Re = f.Uint8Array || function() {};

/*</replacement>*/
/*<replacement>*/
var Ce = Object.create(M);

Ce.inherits = I;

/*</replacement>*/
/*<replacement>*/
var Me, Ne = void 0;

Ne = l && l.debuglog ? l.debuglog("stream") : function() {}
/*</replacement>*/ , Ce.inherits(Pe, A);

var Ie = [ "error", "close", "destroy", "pause", "resume" ];

function Le(e, t) {
    e = e || {};
    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
    var n = t instanceof (xe = xe || oe);
    // object stream flag. Used to make read(n) ignore n and to
    // make all the buffer merging and length checks go away
        this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    // the point at which it stops calling _read() to fill the buffer
    // Note: 0 is a valid value, means "don't call _read preemptively ever"
    var r = e.highWaterMark, i = e.readableHighWaterMark, o = this.objectMode ? 16 : 16384;
    this.highWaterMark = r || 0 === r ? r : n && (i || 0 === i) ? i : o, 
    // cast to ints.
    this.highWaterMark = Math.floor(this.highWaterMark), 
    // A linked list is used to store data chunks instead of an array because the
    // linked list can remove elements from the beginning faster than
    // array.shift()
    this.buffer = new L, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, 
    this.ended = !1, this.endEmitted = !1, this.reading = !1, 
    // a flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    this.sync = !0, 
    // whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, 
    this.resumeScheduled = !1, 
    // has it been destroyed
    this.destroyed = !1, 
    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = e.defaultEncoding || "utf8", 
    // the number of writers that are awaiting a drain event in .pipe()s
    this.awaitDrain = 0, 
    // if true, a maybeReadMore has been scheduled
    this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (Me || (Me = je.StringDecoder), 
    this.decoder = new Me(e.encoding), this.encoding = e.encoding);
}

function Pe(e) {
    if (xe = xe || oe, !(this instanceof Pe)) return new Pe(e);
    this._readableState = new Le(e, this), 
    // legacy
    this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), 
    "function" == typeof e.destroy && (this._destroy = e.destroy)), A.call(this);
}

function De(e, t, n, r, i) {
    var o, a = e._readableState;
    null === t ? (a.reading = !1, function(e, t) {
        if (t.ended) return;
        if (t.decoder) {
            var n = t.decoder.end();
            n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length);
        }
        t.ended = !0, 
        // emit 'readable' now to make sure it gets picked up.
        $e(e);
    }
    // Don't emit readable right away in sync mode, because this can trigger
    // another read() call => stack overflow.  This way, it might trigger
    // a nextTick recursion warning, but that's not so bad.
    (e, a)) : (i || (o = function(e, t) {
        var n;
        r = t, Ae.isBuffer(r) || r instanceof Re || "string" == typeof t || void 0 === t || e.objectMode || (n = new TypeError("Invalid non-string/buffer chunk"));
        var r;
        return n;
    }
    // if it's past the high water mark, we can push in some more.
    // Also, if we have no data yet, we can stand some
    // more bytes.  This is to work around cases where hwm=0,
    // such as the repl.  Also, if the push() triggered a
    // readable event, and the user called read(largeNumber) such that
    // needReadable was set, then we ought to push more, so that another
    // 'readable' event will be triggered.
    (a, t)), o ? e.emit("error", o) : a.objectMode || t && t.length > 0 ? ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === Ae.prototype || (t = function(e) {
        return Ae.from(e);
    }(t)), r ? a.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : Be(e, a, t, !0) : a.ended ? e.emit("error", new Error("stream.push() after EOF")) : (a.reading = !1, 
    a.decoder && !n ? (t = a.decoder.write(t), a.objectMode || 0 !== t.length ? Be(e, a, t, !1) : qe(e, a)) : Be(e, a, t, !1))) : r || (a.reading = !1));
    return function(e) {
        return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
    }(a);
}

function Be(e, t, n, r) {
    t.flowing && 0 === t.length && !t.sync ? (e.emit("data", n), e.read(0)) : (
    // update the buffer info.
    t.length += t.objectMode ? 1 : n.length, r ? t.buffer.unshift(n) : t.buffer.push(n), 
    t.needReadable && $e(e)), qe(e, t);
}

Object.defineProperty(Pe.prototype, "destroyed", {
    get: function() {
        return void 0 !== this._readableState && this._readableState.destroyed;
    },
    set: function(e) {
        // we ignore the value if the stream
        // has not been initialized yet
        this._readableState && (
        // backward compatibility, the user is explicitly
        // managing destroyed
        this._readableState.destroyed = e);
    }
}), Pe.prototype.destroy = D, Pe.prototype._undestroy = B, Pe.prototype._destroy = function(e, t) {
    this.push(null), t(e);
}, 
// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Pe.prototype.push = function(e, t) {
    var n, r = this._readableState;
    return r.objectMode ? n = !0 : "string" == typeof e && ((t = t || r.defaultEncoding) !== r.encoding && (e = Ae.from(e, t), 
    t = ""), n = !0), De(this, e, t, !1, n);
}, 
// Unshift should *always* be something directly out of read()
Pe.prototype.unshift = function(e) {
    return De(this, e, null, !0, !1);
}, Pe.prototype.isPaused = function() {
    return !1 === this._readableState.flowing;
}, 
// backwards compatibility.
Pe.prototype.setEncoding = function(e) {
    return Me || (Me = je.StringDecoder), this._readableState.decoder = new Me(e), this._readableState.encoding = e, 
    this;
};

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function Ue(e, t) {
    return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? 
    // Only flow one buffer at a time
    t.flowing && t.length ? t.buffer.head.data.length : t.length : (
    // If we're asking for more than the current hwm, then raise the hwm.
    e > t.highWaterMark && (t.highWaterMark = function(e) {
        return e >= 8388608 ? e = 8388608 : (
        // Get the next highest power of 2 to prevent increasing hwm excessively in
        // tiny amounts
        e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), 
        e;
    }(e)), e <= t.length ? e : 
    // Don't have enough
    t.ended ? t.length : (t.needReadable = !0, 0));
}

// you can override either this method, or the async _read(n) below.
function $e(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (Ne("emitReadable", t.flowing), t.emittedReadable = !0, 
    t.sync ? j.nextTick(Ge, e) : Ge(e));
}

function Ge(e) {
    Ne("emit readable"), e.emit("readable"), ze(e);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function qe(e, t) {
    t.readingMore || (t.readingMore = !0, j.nextTick(We, e, t));
}

function We(e, t) {
    for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (Ne("maybeReadMore read 0"), 
    e.read(0), n !== t.length); ) n = t.length;
    t.readingMore = !1;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
function Fe(e) {
    Ne("readable nexttick read 0"), e.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
function He(e, t) {
    t.reading || (Ne("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, 
    e.emit("resume"), ze(e), t.flowing && !t.reading && e.read(0);
}

function ze(e) {
    var t = e._readableState;
    for (Ne("flow", t.flowing); t.flowing && null !== e.read(); ) ;
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function Ye(e, t) {
    // nothing buffered
    return 0 === t.length ? null : (t.objectMode ? n = t.buffer.shift() : !e || e >= t.length ? (
    // read it all, truncate the list
    n = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), 
    t.buffer.clear()) : 
    // read part of list
    n = 
    // Extracts only enough buffered data to satisfy the amount requested.
    // This function is designed to be inlinable, so please take care when making
    // changes to the function body.
    function(e, t, n) {
        var r;
        e < t.head.data.length ? (
        // slice is the same for buffers and strings
        r = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : 
        // first chunk is a perfect match
        r = e === t.head.data.length ? t.shift() : n ? 
        // Copies a specified amount of characters from the list of buffered data
        // chunks.
        // This function is designed to be inlinable, so please take care when making
        // changes to the function body.
        function(e, t) {
            var n = t.head, r = 1, i = n.data;
            e -= i.length;
            for (;n = n.next; ) {
                var o = n.data, a = e > o.length ? o.length : e;
                if (a === o.length ? i += o : i += o.slice(0, e), 0 === (e -= a)) {
                    a === o.length ? (++r, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, 
                    n.data = o.slice(a));
                    break;
                }
                ++r;
            }
            return t.length -= r, i;
        }
        // Copies a specified amount of bytes from the list of buffered data chunks.
        // This function is designed to be inlinable, so please take care when making
        // changes to the function body.
        (e, t) : function(e, t) {
            var n = Ae.allocUnsafe(e), r = t.head, i = 1;
            r.data.copy(n), e -= r.data.length;
            for (;r = r.next; ) {
                var o = r.data, a = e > o.length ? o.length : e;
                if (o.copy(n, n.length - e, 0, a), 0 === (e -= a)) {
                    a === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, 
                    r.data = o.slice(a));
                    break;
                }
                ++i;
            }
            return t.length -= i, n;
        }(e, t);
        return r;
    }(e, t.buffer, t.decoder), n);
    var n;
}

function Ve(e) {
    var t = e._readableState;
    // If we get here before consuming all the bytes, then that is a
    // bug in node.  Should never happen.
        if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, j.nextTick(Je, t, e));
}

function Je(e, t) {
    // Check that we didn't get one last unshift.
    e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
}

function Ze(e, t) {
    for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
    return -1;
}

Pe.prototype.read = function(e) {
    Ne("read", e), e = parseInt(e, 10);
    var t = this._readableState, n = e;
    // if we're doing read(0) to trigger a readable event, but we
    // already have a bunch of data in the buffer, then just trigger
    // the 'readable' event and move on.
    if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return Ne("read: emitReadable", t.length, t.ended), 
    0 === t.length && t.ended ? Ve(this) : $e(this), null;
    // if we've ended, and we're now clear, then finish it up.
    if (0 === (e = Ue(e, t)) && t.ended) return 0 === t.length && Ve(this), null;
    // All the actual chunk generation logic needs to be
    // *below* the call to _read.  The reason is that in certain
    // synthetic stream cases, such as passthrough streams, _read
    // may be a completely synchronous operation which may change
    // the state of the read buffer, providing enough data when
    // before there was *not* enough.
    
    // So, the steps are:
    // 1. Figure out what the state of things will be after we do
    // a read from the buffer.
    
    // 2. If that resulting state will trigger a _read, then call _read.
    // Note that this may be asynchronous, or synchronous.  Yes, it is
    // deeply ugly to write APIs this way, but that still doesn't mean
    // that the Readable class should behave improperly, as streams are
    // designed to be sync/async agnostic.
    // Take note if the _read call is sync or async (ie, if the read call
    // has returned yet), so that we know whether or not it's safe to emit
    // 'readable' etc.
    
    // 3. Actually pull the requested chunks out of the buffer and return.
    // if we need a readable event, then we need to do some reading.
        var r, i = t.needReadable;
    return Ne("need readable", i), 
    // if we currently have less than the highWaterMark, then also read some
    (0 === t.length || t.length - e < t.highWaterMark) && Ne("length less than watermark", i = !0), 
    // however, if we've ended, then there's no point, and if we're already
    // reading, then it's unnecessary.
    t.ended || t.reading ? Ne("reading or ended", i = !1) : i && (Ne("do read"), t.reading = !0, 
    t.sync = !0, 
    // if the length is currently zero, then we *need* a readable event.
    0 === t.length && (t.needReadable = !0), 
    // call internal read method
    this._read(t.highWaterMark), t.sync = !1, 
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    t.reading || (e = Ue(n, t))), null === (r = e > 0 ? Ye(e, t) : null) ? (t.needReadable = !0, 
    e = 0) : t.length -= e, 0 === t.length && (
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    t.ended || (t.needReadable = !0), 
    // If we tried to read() past the EOF, then emit end on the next tick.
    n !== e && t.ended && Ve(this)), null !== r && this.emit("data", r), r;
}, Pe.prototype._read = function(e) {
    this.emit("error", new Error("_read() is not implemented"));
}, Pe.prototype.pipe = function(e, t) {
    var n = this, r = this._readableState;
    switch (r.pipesCount) {
      case 0:
        r.pipes = e;
        break;

      case 1:
        r.pipes = [ r.pipes, e ];
        break;

      default:
        r.pipes.push(e);
    }
    r.pipesCount += 1, Ne("pipe count=%d opts=%j", r.pipesCount, t);
    var i = (!t || !1 !== t.end) && e !== process.stdout && e !== process.stderr ? a : p;
    function o(t, i) {
        Ne("onunpipe"), t === n && i && !1 === i.hasUnpiped && (i.hasUnpiped = !0, Ne("cleanup"), 
        // cleanup event handlers once the pipe is broken
        e.removeListener("close", d), e.removeListener("finish", f), e.removeListener("drain", s), 
        e.removeListener("error", h), e.removeListener("unpipe", o), n.removeListener("end", a), 
        n.removeListener("end", p), n.removeListener("data", c), l = !0, 
        // if the reader is waiting for a drain event from this
        // specific writer, then it would cause it to never start
        // flowing again.
        // So, if this is awaiting a drain, then we just call it now.
        // If we don't know, then assume that we are waiting for one.
        !r.awaitDrain || e._writableState && !e._writableState.needDrain || s());
    }
    function a() {
        Ne("onend"), e.end();
    }
    // when the dest drains, it reduces the awaitDrain counter
    // on the source.  This would be more elegant with a .once()
    // handler in flow(), but adding and removing repeatedly is
    // too slow.
        r.endEmitted ? j.nextTick(i) : n.once("end", i), e.on("unpipe", o);
    var s = function(e) {
        return function() {
            var t = e._readableState;
            Ne("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && Oe(e, "data") && (t.flowing = !0, 
            ze(e));
        };
    }(n);
    e.on("drain", s);
    var l = !1;
    // If the user pushes more data while we're writing to dest then we'll end up
    // in ondata again. However, we only want to increase awaitDrain once because
    // dest will only emit one 'drain' event for the multiple writes.
    // => Introduce a guard on increasing awaitDrain.
    var u = !1;
    function c(t) {
        Ne("ondata"), u = !1, !1 !== e.write(t) || u || (
        // If the user unpiped during `dest.write()`, it is possible
        // to get stuck in a permanently paused state if that write
        // also returned false.
        // => Check whether `dest` is still a piping destination.
        (1 === r.pipesCount && r.pipes === e || r.pipesCount > 1 && -1 !== Ze(r.pipes, e)) && !l && (Ne("false write response, pause", n._readableState.awaitDrain), 
        n._readableState.awaitDrain++, u = !0), n.pause());
    }
    // if the dest has an error, then stop piping into it.
    // however, don't suppress the throwing behavior for this.
        function h(t) {
        Ne("onerror", t), p(), e.removeListener("error", h), 0 === Oe(e, "error") && e.emit("error", t);
    }
    // Make sure our error handler is attached before userland ones.
        // Both close and finish should trigger unpipe, but only once.
    function d() {
        e.removeListener("finish", f), p();
    }
    function f() {
        Ne("onfinish"), e.removeListener("close", d), p();
    }
    function p() {
        Ne("unpipe"), n.unpipe(e);
    }
    // tell the dest that it's being piped to
        return n.on("data", c), function(e, t, n) {
        // Sadly this is not cacheable as some libraries bundle their own
        // event emitter implementation with them.
        if ("function" == typeof e.prependListener) return e.prependListener(t, n);
        // This is a hack to make sure that our error handler is attached before any
        // userland ones.  NEVER DO THIS. This is here only because this code needs
        // to continue to work with older versions of Node.js that do not include
        // the prependListener() method. The goal is to eventually remove this hack.
                e._events && e._events[t] ? O(e._events[t]) ? e._events[t].unshift(n) : e._events[t] = [ n, e._events[t] ] : e.on(t, n);
    }(e, "error", h), e.once("close", d), e.once("finish", f), e.emit("pipe", n), 
    // start the flow if it hasn't been started already.
    r.flowing || (Ne("pipe resume"), n.resume()), e;
}, Pe.prototype.unpipe = function(e) {
    var t = this._readableState, n = {
        hasUnpiped: !1
    };
    // if we're not piping anywhere, then do nothing.
    if (0 === t.pipesCount) return this;
    // just one destination.  most common case.
        if (1 === t.pipesCount) 
    // passed in one, but it's not the right one.
    return e && e !== t.pipes ? this : (e || (e = t.pipes), 
    // got a match.
    t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, n), 
    this);
    // slow case. multiple pipe destinations.
        if (!e) {
        // remove all.
        var r = t.pipes, i = t.pipesCount;
        t.pipes = null, t.pipesCount = 0, t.flowing = !1;
        for (var o = 0; o < i; o++) r[o].emit("unpipe", this, n);
        return this;
    }
    // try to find the right one.
        var a = Ze(t.pipes, e);
    return -1 === a ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), 
    e.emit("unpipe", this, n), this);
}, 
// set up data events if they are asked for
// Ensure readable listeners eventually get something
Pe.prototype.on = function(e, t) {
    var n = A.prototype.on.call(this, e, t);
    if ("data" === e) 
    // Start flowing on next tick if stream isn't explicitly paused
    !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) {
        var r = this._readableState;
        r.endEmitted || r.readableListening || (r.readableListening = r.needReadable = !0, 
        r.emittedReadable = !1, r.reading ? r.length && $e(this) : j.nextTick(Fe, this));
    }
    return n;
}, Pe.prototype.addListener = Pe.prototype.on, Pe.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (Ne("resume"), e.flowing = !0, function(e, t) {
        t.resumeScheduled || (t.resumeScheduled = !0, j.nextTick(He, e, t));
    }(this, e)), this;
}, Pe.prototype.pause = function() {
    return Ne("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (Ne("pause"), 
    this._readableState.flowing = !1, this.emit("pause")), this;
}, Pe.prototype.wrap = function(e) {
    var t = this, n = this._readableState, r = !1;
    // proxy all the other methods.
    // important when wrapping filters and duplexes.
    for (var i in e.on("end", (function() {
        if (Ne("wrapped end"), n.decoder && !n.ended) {
            var e = n.decoder.end();
            e && e.length && t.push(e);
        }
        t.push(null);
    })), e.on("data", (function(i) {
        // don't skip over falsy values in objectMode
        (Ne("wrapped data"), n.decoder && (i = n.decoder.write(i)), n.objectMode && null == i) || (n.objectMode || i && i.length) && (t.push(i) || (r = !0, 
        e.pause()));
    })), e) void 0 === this[i] && "function" == typeof e[i] && (this[i] = function(t) {
        return function() {
            return e[t].apply(e, arguments);
        };
    }(i));
    // proxy certain important events.
        for (var o = 0; o < Ie.length; o++) e.on(Ie[o], this.emit.bind(this, Ie[o]));
    // when we try to consume some more bytes, simply unpause the
    // underlying stream.
        return this._read = function(t) {
        Ne("wrapped _read", t), r && (r = !1, e.resume());
    }, this;
}, Object.defineProperty(Pe.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
        return this._readableState.highWaterMark;
    }
}), 
// exposed for testing purposes only.
Pe._fromList = Ye;

var Qe = et, Xe = Object.create(M);

/*<replacement>*/ function Ke(e, t) {
    var n = this._transformState;
    n.transforming = !1;
    var r = n.writecb;
    if (!r) return this.emit("error", new Error("write callback called multiple times"));
    n.writechunk = null, n.writecb = null, null != t && // single equals check for both `null` and `undefined`
    this.push(t), r(e);
    var i = this._readableState;
    i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
}

function et(e) {
    if (!(this instanceof et)) return new et(e);
    oe.call(this, e), this._transformState = {
        afterTransform: Ke.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null
    }, 
    // start out asking for a readable event once data is transformed.
    this._readableState.needReadable = !0, 
    // we have implemented the _read method, and done the other things
    // that Readable wants before the first _read call, so unset the
    // sync guard flag.
    this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), 
    "function" == typeof e.flush && (this._flush = e.flush)), 
    // When the writable side finishes, then flush out anything remaining.
    this.on("prefinish", tt);
}

function tt() {
    var e = this;
    "function" == typeof this._flush ? this._flush((function(t, n) {
        nt(e, t, n);
    })) : nt(this, null, null);
}

function nt(e, t, n) {
    if (t) return e.emit("error", t);
    // if there's nothing in the write buffer, then that means
    // that nothing more will ever be provided
    if (null != n && // single equals check for both `null` and `undefined`
    e.push(n), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null);
}

Xe.inherits = I, 
/*</replacement>*/
Xe.inherits(et, oe), et.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, oe.prototype.push.call(this, e, t);
}, 
// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
et.prototype._transform = function(e, t, n) {
    throw new Error("_transform() is not implemented");
}, et.prototype._write = function(e, t, n) {
    var r = this._transformState;
    if (r.writecb = n, r.writechunk = e, r.writeencoding = t, !r.transforming) {
        var i = this._readableState;
        (r.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }
}, 
// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
et.prototype._read = function(e) {
    var t = this._transformState;
    null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : 
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    t.needTransform = !0;
}, et.prototype._destroy = function(e, t) {
    var n = this;
    oe.prototype._destroy.call(this, e, (function(e) {
        t(e), n.emit("close");
    }));
};

var rt = ot, it = Object.create(M);

/*<replacement>*/ function ot(e) {
    if (!(this instanceof ot)) return new ot(e);
    Qe.call(this, e);
}

it.inherits = I, 
/*</replacement>*/
it.inherits(ot, Qe), ot.prototype._transform = function(e, t, n) {
    n(null, e);
};

var at = v((function(e, t) {
    "disable" === process.env.READABLE_STREAM && o ? (e.exports = o, (t = e.exports = o.Readable).Readable = o.Readable, 
    t.Writable = o.Writable, t.Duplex = o.Duplex, t.Transform = o.Transform, t.PassThrough = o.PassThrough, 
    t.Stream = o) : ((t = e.exports = Te).Stream = o || t, t.Readable = t, t.Writable = $, 
    t.Duplex = oe, t.Transform = Qe, t.PassThrough = rt);
})), st = (at.Readable, at.Writable, at.Duplex, at.Transform, at.PassThrough, at.Stream, 
lt);

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */
function lt(e, t) {
    if (!(this instanceof lt)) return new lt(e, t);
    this.proto = e, this.target = t, this.methods = [], this.getters = [], this.setters = [], 
    this.fluents = [];
}

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */ lt.prototype.method = function(e) {
    var t = this.proto, n = this.target;
    return this.methods.push(e), t[e] = function() {
        return this[n][e].apply(this[n], arguments);
    }, this;
}, 
/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
lt.prototype.access = function(e) {
    return this.getter(e).setter(e);
}, 
/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
lt.prototype.getter = function(e) {
    var t = this.proto, n = this.target;
    return this.getters.push(e), t.__defineGetter__(e, (function() {
        return this[n][e];
    })), this;
}, 
/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
lt.prototype.setter = function(e) {
    var t = this.proto, n = this.target;
    return this.setters.push(e), t.__defineSetter__(e, (function(t) {
        return this[n][e] = t;
    })), this;
}, 
/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */
lt.prototype.fluent = function(e) {
    var t = this.proto, n = this.target;
    return this.fluents.push(e), t[e] = function(t) {
        return void 0 !== t ? (this[n][e] = t, this) : this[n][e];
    }, this;
};

var ut = v((function(e) {
    var t = e.exports = function(e, t, n) {
        at.Transform.call(this, n), this.tracker = new x(e, t), this.name = e, this.id = this.tracker.id, 
        this.tracker.on("change", function(e) {
            return function(t, n, r) {
                e.emit("change", t, n, e);
            };
        }(this));
    };
    l.inherits(t, at.Transform), t.prototype._transform = function(e, t, n) {
        this.tracker.completeWork(e.length ? e.length : 1), this.push(e), n();
    }, t.prototype._flush = function(e) {
        this.tracker.finish(), e();
    }, st(t.prototype, "tracker").method("completed").method("addWork").method("finish");
})), ct = {
    TrackerGroup: v((function(e) {
        var t = e.exports = function(e) {
            S.call(this, e), this.parentGroup = null, this.trackers = [], this.completion = {}, 
            this.weight = {}, this.totalWeight = 0, this.finished = !1, this.bubbleChange = function(e) {
                return function(t, n, r) {
                    e.completion[r.id] = n, e.finished || e.emit("change", t || e.name, e.completed(), e);
                };
            }(this);
        };
        l.inherits(t, S), t.prototype.nameInTree = function() {
            for (var e = [], t = this; t; ) e.unshift(t.name), t = t.parentGroup;
            return e.join("/");
        }, t.prototype.addUnit = function(e, t) {
            if (e.addUnit) {
                for (var n = this; n; ) {
                    if (e === n) throw new Error("Attempted to add tracker group " + e.name + " to tree that already includes it " + this.nameInTree(this));
                    n = n.parentGroup;
                }
                e.parentGroup = this;
            }
            return this.weight[e.id] = t || 1, this.totalWeight += this.weight[e.id], this.trackers.push(e), 
            this.completion[e.id] = e.completed(), e.on("change", this.bubbleChange), this.finished || this.emit("change", e.name, this.completion[e.id], e), 
            e;
        }, t.prototype.completed = function() {
            if (0 === this.trackers.length) return 0;
            for (var e = 1 / this.totalWeight, t = 0, n = 0; n < this.trackers.length; n++) {
                var r = this.trackers[n].id;
                t += e * this.weight[r] * this.completion[r];
            }
            return t;
        }, t.prototype.newGroup = function(e, n) {
            return this.addUnit(new t(e), n);
        }, t.prototype.newItem = function(e, t, n) {
            return this.addUnit(new x(e, t), n);
        }, t.prototype.newStream = function(e, t, n) {
            return this.addUnit(new ut(e, t), n);
        }, t.prototype.finish = function() {
            this.finished = !0, this.trackers.length || this.addUnit(new x, 1, !0);
            for (var e = 0; e < this.trackers.length; e++) {
                var t = this.trackers[e];
                t.finish(), t.removeListener("change", this.bubbleChange);
            }
            this.emit("change", this.name, 1, this);
        };
        t.prototype.debug = function(e) {
            var n = (e = e || 0) ? "                                  ".substr(0, e) : "", r = n + (this.name || "top") + ": " + this.completed() + "\n";
            return this.trackers.forEach((function(i) {
                r += i instanceof t ? i.debug(e + 1) : n + " " + i.name + ": " + i.completed() + "\n";
            })), r;
        };
    })),
    Tracker: x,
    TrackerStream: ut
}, ht = {
    reset: 0,
    // styles
    bold: 1,
    italic: 3,
    underline: 4,
    inverse: 7,
    // resets
    stopBold: 22,
    stopItalic: 23,
    stopUnderline: 24,
    stopInverse: 27,
    // colors
    white: 37,
    black: 30,
    blue: 34,
    cyan: 36,
    green: 32,
    magenta: 35,
    red: 31,
    yellow: 33,
    bgWhite: 47,
    bgBlack: 40,
    bgBlue: 44,
    bgCyan: 46,
    bgGreen: 42,
    bgMagenta: 45,
    bgRed: 41,
    bgYellow: 43,
    grey: 90,
    brightBlack: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97,
    bgGrey: 100,
    bgBrightBlack: 100,
    bgBrightRed: 101,
    bgBrightGreen: 102,
    bgBrightYellow: 103,
    bgBrightBlue: 104,
    bgBrightMagenta: 105,
    bgBrightCyan: 106,
    bgBrightWhite: 107
};

function dt(e) {
    if (null != ht[e]) return ht[e];
    throw new Error("Unknown color or style name: " + e);
}

var ft = function() {
    return "[K";
}, pt = function() {
    return "\r";
}, vt = function() {
    return "";
}, bt = function() {
    return "[?25l";
}, gt = function() {
    return "[?25h";
}, _t = function(e) {
    return 1 === arguments.length && Array.isArray(e) || (e = Array.prototype.slice.call(arguments)), 
    "[" + e.map(dt).join(";") + "m";
}, mt = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g, yt = function(e) {
    return "string" == typeof e ? e.replace(mt, "") : e;
}, wt = function(e, t) {
    if (null == e) throw TypeError();
    var n = (e = String(e)).length, r = t ? Number(t) : 0;
    if (Number.isNaN(r) && (r = 0), !(r < 0 || r >= n)) {
        var i = e.charCodeAt(r);
        if (i >= 55296 && i <= 56319 && n > r + 1) {
            var o = e.charCodeAt(r + 1);
            if (o >= 56320 && o <= 57343) return 1024 * (i - 55296) + o - 56320 + 65536;
        }
        return i;
    }
}, Et = Number.isNaN || function(e) {
    return e != e;
}, kt = function(e) {
    if ("string" != typeof e || 0 === e.length) return 0;
    var t, n = 0;
    e = yt(e);
    for (var r = 0; r < e.length; r++) {
        var i = wt(e, r);
        // ignore control characters
                i <= 31 || i >= 127 && i <= 159 || (
        // surrogates
        i >= 65536 && r++, !Et(t = i) && t >= 4352 && (t <= 4447 || // Hangul Jamo
        9001 === t || // LEFT-POINTING ANGLE BRACKET
        9002 === t || // RIGHT-POINTING ANGLE BRACKET
        // CJK Radicals Supplement .. Enclosed CJK Letters and Months
        11904 <= t && t <= 12871 && 12351 !== t || 
        // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
        12880 <= t && t <= 19903 || 
        // CJK Unified Ideographs .. Yi Radicals
        19968 <= t && t <= 42182 || 
        // Hangul Jamo Extended-A
        43360 <= t && t <= 43388 || 
        // Hangul Syllables
        44032 <= t && t <= 55203 || 
        // CJK Compatibility Ideographs
        63744 <= t && t <= 64255 || 
        // Vertical Forms
        65040 <= t && t <= 65049 || 
        // CJK Compatibility Forms .. Small Form Variants
        65072 <= t && t <= 65131 || 
        // Halfwidth and Fullwidth Forms
        65281 <= t && t <= 65376 || 65504 <= t && t <= 65510 || 
        // Kana Supplement
        110592 <= t && t <= 110593 || 
        // Enclosed Ideographic Supplement
        127488 <= t && t <= 127569 || 
        // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
        131072 <= t && t <= 262141) ? n += 2 : n++);
    }
    return n;
};

// lodash's way of generating pad characters.
function St(e) {
    var t = "", n = " ", r = e;
    do {
        r % 2 && (t += n), r = Math.floor(r / 2), n += n;
    } while (r);
    return t;
}

var xt = {
    center: function(e, t) {
        var n = e.trim();
        if (0 === n.length && e.length >= t) return e;
        var r = "", i = "", o = kt(n);
        if (o < t) {
            var a = parseInt((t - o) / 2, 10);
            r = St(a), i = St(t - (o + a));
        }
        return r + n + i;
    },
    left: function(e, t) {
        var n = e.trimRight();
        if (0 === n.length && e.length >= t) return e;
        var r = "", i = kt(n);
        i < t && (r = St(t - i));
        return n + r;
    },
    right: function(e, t) {
        var n = e.trimLeft();
        if (0 === n.length && e.length >= t) return e;
        var r = "", i = kt(n);
        i < t && (r = St(t - i));
        return r + n;
    }
}, jt = v((function(e) {
    var t = {
        "*": {
            label: "any",
            check: function() {
                return !0;
            }
        },
        A: {
            label: "array",
            check: function(e) {
                return Array.isArray(e) || function(e) {
                    return null != e && "object" == typeof e && e.hasOwnProperty("callee");
                }(e);
            }
        },
        S: {
            label: "string",
            check: function(e) {
                return "string" == typeof e;
            }
        },
        N: {
            label: "number",
            check: function(e) {
                return "number" == typeof e;
            }
        },
        F: {
            label: "function",
            check: function(e) {
                return "function" == typeof e;
            }
        },
        O: {
            label: "object",
            check: function(e) {
                return "object" == typeof e && null != e && !t.A.check(e) && !t.E.check(e);
            }
        },
        B: {
            label: "boolean",
            check: function(e) {
                return "boolean" == typeof e;
            }
        },
        E: {
            label: "error",
            check: function(e) {
                return e instanceof Error;
            }
        },
        Z: {
            label: "null",
            check: function(e) {
                return null == e;
            }
        }
    };
    function n(e, t) {
        var n = t[e.length] = t[e.length] || [];
        -1 === n.indexOf(e) && n.push(e);
    }
    var r = e.exports = function(e, r) {
        if (2 !== arguments.length) throw l([ "SA" ], arguments.length);
        if (!e) throw i(0);
        if (!r) throw i(1);
        if (!t.S.check(e)) throw a(0, [ "string" ], e);
        if (!t.A.check(r)) throw a(1, [ "array" ], r);
        var s = e.split("|"), c = {};
        s.forEach((function(e) {
            for (var r = 0; r < e.length; ++r) {
                var i = e[r];
                if (!t[i]) throw o(r, i);
            }
            if (/E.*E/.test(e)) throw u(e);
            n(e, c), /E/.test(e) && (n(e.replace(/E.*$/, "E"), c), n(e.replace(/E/, "Z"), c), 
            1 === e.length && n("", c));
        }));
        var h = c[r.length];
        if (!h) throw l(Object.keys(c), r.length);
        for (var d = 0; d < r.length; ++d) {
            var f = h.filter((function(e) {
                var n = e[d];
                return (0, t[n].check)(r[d]);
            }));
            if (!f.length) {
                var p = h.map((function(e) {
                    return t[e[d]].label;
                })).filter((function(e) {
                    return null != e;
                }));
                throw a(d, p, r[d]);
            }
            h = f;
        }
    };
    function i(e) {
        return c("EMISSINGARG", "Missing required argument #" + (e + 1));
    }
    function o(e, t) {
        return c("EUNKNOWNTYPE", "Unknown type " + t + " in argument #" + (e + 1));
    }
    function a(e, n, r) {
        var i;
        return Object.keys(t).forEach((function(e) {
            t[e].check(r) && (i = t[e].label);
        })), c("EINVALIDTYPE", "Argument #" + (e + 1) + ": Expected " + s(n) + " but got " + i);
    }
    function s(e) {
        return e.join(", ").replace(/, ([^,]+)$/, " or $1");
    }
    function l(e, t) {
        return c("EWRONGARGCOUNT", "Expected " + s(e) + " " + (e.every((function(e) {
            return 1 === e.length;
        })) ? "argument" : "arguments") + " but got " + t);
    }
    function u(e) {
        return c("ETOOMANYERRORTYPES", 'Only one error type per argument signature is allowed, more than one found in "' + e + '"');
    }
    function c(e, t) {
        var n = new Error(t);
        return n.code = e, Error.captureStackTrace && Error.captureStackTrace(n, r), n;
    }
})), Tt = Object.getOwnPropertySymbols, Ot = Object.prototype.hasOwnProperty, At = Object.prototype.propertyIsEnumerable;

function Rt(e) {
    if (null == e) throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(e);
}

var Ct = function() {
    try {
        if (!Object.assign) return !1;
        // Detect buggy property enumeration order in older V8 versions.
        // https://bugs.chromium.org/p/v8/issues/detail?id=4118
                var e = new String("abc");
 // eslint-disable-line no-new-wrappers
                if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;
        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                for (var t = {}, n = 0; n < 10; n++) t["_" + String.fromCharCode(n)] = n;
        if ("0123456789" !== Object.getOwnPropertyNames(t).map((function(e) {
            return t[e];
        })).join("")) return !1;
        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                var r = {};
        return "abcdefghijklmnopqrst".split("").forEach((function(e) {
            r[e] = e;
        })), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, r)).join("");
    } catch (e) {
        // We don't expect any of the above to throw, but better to be safe.
        return !1;
    }
}() ? Object.assign : function(e, t) {
    for (var n, r, i = Rt(e), o = 1; o < arguments.length; o++) {
        for (var a in n = Object(arguments[o])) Ot.call(n, a) && (i[a] = n[a]);
        if (Tt) {
            r = Tt(n);
            for (var s = 0; s < r.length; s++) At.call(n, r[s]) && (i[r[s]] = n[r[s]]);
        }
    }
    return i;
}, Mt = function(e, t) {
    if (0 === kt(e)) return e;
    if (t <= 0) return "";
    if (kt(e) <= t) return e;
    // We compute the number of bytes of ansi sequences here and add
    // that to our initial truncation to ensure that we don't slice one
    // that we want to keep in half.
        var n = yt(e), r = e.length + n.length, i = e.slice(0, t + r);
    // we have to shrink the result to account for our ansi sequence buffer
    // (if an ansi sequence was truncated) and double width characters.
    for (;kt(i) > t; ) i = i.slice(0, -1);
    return i;
};

var Nt = v((function(e, t) {
    var n = t.User = function e(t) {
        var n = new Error(t);
        return Error.captureStackTrace(n, e), n.code = "EGAUGE", n;
    };
    t.MissingTemplateValue = function e(t, r) {
        var i = new n(l.format('Missing template value "%s"', t.type));
        return Error.captureStackTrace(i, e), i.template = t, i.values = r, i;
    }, t.Internal = function e(t) {
        var n = new Error(t);
        return Error.captureStackTrace(n, e), n.code = "EGAUGEINTERNAL", n;
    };
})), It = (Nt.User, Nt.MissingTemplateValue, Nt.Internal, Dt);

function Lt(e) {
    return "string" == typeof e && "%" === e.slice(-1);
}

function Pt(e) {
    return Number(e.slice(0, -1)) / 100;
}

function Dt(e, t) {
    if (this.overallOutputLength = t, this.finished = !1, this.type = null, this.value = null, 
    this.length = null, this.maxLength = null, this.minLength = null, this.kerning = null, 
    this.align = "left", this.padLeft = 0, this.padRight = 0, this.index = null, this.first = null, 
    this.last = null, "string" == typeof e) this.value = e; else for (var n in e) this[n] = e[n];
    // Realize percents
        return Lt(this.length) && (this.length = Math.round(this.overallOutputLength * Pt(this.length))), 
    Lt(this.minLength) && (this.minLength = Math.round(this.overallOutputLength * Pt(this.minLength))), 
    Lt(this.maxLength) && (this.maxLength = Math.round(this.overallOutputLength * Pt(this.maxLength))), 
    this;
}

Dt.prototype = {}, Dt.prototype.getBaseLength = function() {
    var e = this.length;
    return null == e && "string" == typeof this.value && null == this.maxLength && null == this.minLength && (e = kt(this.value)), 
    e;
}, Dt.prototype.getLength = function() {
    var e = this.getBaseLength();
    return null == e ? null : e + this.padLeft + this.padRight;
}, Dt.prototype.getMaxLength = function() {
    return null == this.maxLength ? null : this.maxLength + this.padLeft + this.padRight;
}, Dt.prototype.getMinLength = function() {
    return null == this.minLength ? null : this.minLength + this.padLeft + this.padRight;
};

var Bt = v((function(e) {
    function t(e) {
        return function(t) {
            return function(e, t) {
                var n = e.getBaseLength(), r = "function" == typeof e.value ? function(e, t, n) {
                    return jt("OON", arguments), e.type ? e.value(t, t[e.type + "Theme"] || {}, n) : e.value(t, {}, n);
                }(e, t, n) : e.value;
                if (null == r || "" === r) return "";
                var i = xt[e.align] || xt.left, o = e.padLeft ? xt.left("", e.padLeft) : "", a = e.padRight ? xt.right("", e.padRight) : "", s = Mt(String(r), n), l = i(s, n);
                return o + l + a;
            }(t, e);
        };
    }
    var n = e.exports = function(e, o, a) {
        var s = function(e, t, o) {
            var a = t.map((function(t, a, s) {
                var l = new It(t, e), u = l.type;
                if (null == l.value) if (u in o) l.value = o[u]; else {
                    if (null == l.default) throw new Nt.MissingTemplateValue(l, o);
                    l.value = l.default;
                }
                return null == l.value || "" === l.value ? null : (l.index = a, l.first = 0 === a, 
                l.last = a === s.length - 1, function(e, t) {
                    if (!e.type) return;
                    return t[r(e)] || t[i(e)];
                }(l, o) && (l.value = function(e, t) {
                    var o = Ct({}, e), a = Object.create(t), s = [], l = r(o), u = i(o);
                    a[l] && (s.push({
                        value: a[l]
                    }), a[l] = null);
                    o.minLength = null, o.length = null, o.maxLength = null, s.push(o), a[o.type] = a[o.type], 
                    a[u] && (s.push({
                        value: a[u]
                    }), a[u] = null);
                    return function(e, t, r) {
                        return n(r, s, a);
                    };
                }(l, o)), l);
            })).filter((function(e) {
                return null != e;
            })), s = e, l = a.length;
            function u(e, t) {
                if (e.finished) throw new Nt.Internal("Tried to finish template item that was already finished");
                if (t === 1 / 0) throw new Nt.Internal("Length of template item cannot be infinity");
                if (null != t && (e.length = t), e.minLength = null, e.maxLength = null, --l, e.finished = !0, 
                null == e.length && (e.length = e.getBaseLength()), null == e.length) throw new Nt.Internal("Finished template items must have a length");
                !function(e) {
                    e > s && (e = s), s -= e;
                }(e.getLength());
            }
            a.forEach((function(e) {
                if (e.kerning) {
                    var t = e.first ? 0 : a[e.index - 1].padRight;
                    !e.first && t < e.kerning && (e.padLeft = e.kerning - t), e.last || (e.padRight = e.kerning);
                }
            })), 
            // Finish any that have a fixed (literal or intuited) length
            a.forEach((function(e) {
                null != e.getBaseLength() && u(e);
            }));
            var c, h, d = 0;
            do {
                c = !1, h = Math.round(s / l), a.forEach((function(e) {
                    e.finished || e.maxLength && e.getMaxLength() < h && (u(e, e.maxLength), c = !0);
                }));
            } while (c && d++ < a.length);
            if (c) throw new Nt.Internal("Resize loop iterated too many times while determining maxLength");
            d = 0;
            do {
                c = !1, h = Math.round(s / l), a.forEach((function(e) {
                    e.finished || e.minLength && e.getMinLength() >= h && (u(e, e.minLength), c = !0);
                }));
            } while (c && d++ < a.length);
            if (c) throw new Nt.Internal("Resize loop iterated too many times while determining minLength");
            return h = Math.round(s / l), a.forEach((function(e) {
                e.finished || u(e, h);
            })), a;
        }(e, o, a).map(t(a)).join("");
        return xt.left(Mt(s, e), e);
    };
    function r(e) {
        return "pre" + (e.type[0].toUpperCase() + e.type.slice(1));
    }
    function i(e) {
        return "post" + (e.type[0].toUpperCase() + e.type.slice(1));
    }
})), Ut = v((function(e) {
    var t = e.exports = function(e, t, n) {
        n || (n = 80), jt("OAN", [ e, t, n ]), this.showing = !1, this.theme = e, this.width = n, 
        this.template = t;
    };
    t.prototype = {}, t.prototype.setTheme = function(e) {
        jt("O", [ e ]), this.theme = e;
    }, t.prototype.setTemplate = function(e) {
        jt("A", [ e ]), this.template = e;
    }, t.prototype.setWidth = function(e) {
        jt("N", [ e ]), this.width = e;
    }, t.prototype.hide = function() {
        return pt() + ft();
    }, t.prototype.hideCursor = bt, t.prototype.showCursor = gt, t.prototype.show = function(e) {
        var t = Object.create(this.theme);
        for (var n in e) t[n] = e[n];
        return Bt(this.width, this.template, t).trim() + _t("reset") + ft() + pt();
    };
})), $t = v((function(e) {
    e.exports = function() {
        // Recent Win32 platforms (>XP) CAN support unicode in the console but
        // don't have to, and in non-english locales often use traditional local
        // code pages. There's no way, short of windows system calls or execing
        // the chcp command line program to figure this out. As such, we default
        // this to false and encourage your users to override it via config if
        // appropriate.
        if ("Windows_NT" == s.type()) return !1;
        var e = process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG;
        return /UTF-?8$/i.test(e);
    };
})), Gt = "win32" === process.platform || !!process.env.COLORTERM || /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM);

var qt, Wt = v((function(e) {
    // This is not the set of all possible signals.
    // It IS, however, the set of all signals that trigger
    // an exit on either Linux or BSD systems.  Linux is a
    // superset of the signal names supported on BSD, and
    // the unknown signals just fail to register, so we can
    // catch that easily enough.
    // Don't bother with SIGKILL.  It's uncatchable, which
    // means that we can't fire any callbacks anyway.
    // If a user does happen to register a handler on a non-
    // fatal signal like SIGWINCH or something, and then
    // exit, it'll end up firing `process.emit('exit')`, so
    // the handler will be fired anyway.
    // SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
    // artificially, inherently leave the process in a
    // state from which it is not safe to try and enter JS
    // listeners.
    e.exports = [ "SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM" ], "win32" !== process.platform && e.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT"), 
    "linux" === process.platform && e.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
})), Ft = u;

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
/* istanbul ignore if */
"function" != typeof Ft && (Ft = Ft.EventEmitter), process.__signal_exit_emitter__ ? qt = process.__signal_exit_emitter__ : ((qt = process.__signal_exit_emitter__ = new Ft).count = 0, 
qt.emitted = {}), 
// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
qt.infinite || (qt.setMaxListeners(1 / 0), qt.infinite = !0);

var Ht = function(e, t) {
    h.equal(typeof e, "function", "a callback must be provided for exit handler"), !1 === Qt && Xt();
    var n = "exit";
    t && t.alwaysLast && (n = "afterexit");
    return qt.on(n, e), function() {
        qt.removeListener(n, e), 0 === qt.listeners("exit").length && 0 === qt.listeners("afterexit").length && Yt();
    };
}, zt = Yt;

function Yt() {
    Qt && (Qt = !1, Wt.forEach((function(e) {
        try {
            process.removeListener(e, Jt[e]);
        } catch (e) {}
    })), process.emit = tn, process.reallyExit = Kt, qt.count -= 1);
}

function Vt(e, t, n) {
    qt.emitted[e] || (qt.emitted[e] = !0, qt.emit(e, t, n));
}

// { <signal>: <listener fn>, ... }
var Jt = {};

Wt.forEach((function(e) {
    Jt[e] = function() {
        process.listeners(e).length === qt.count && (Yt(), Vt("exit", null, e), 
        /* istanbul ignore next */
        Vt("afterexit", null, e), 
        /* istanbul ignore next */
        process.kill(process.pid, e));
    };
}));

var Zt = Xt, Qt = !1;

function Xt() {
    Qt || (Qt = !0, 
    // This is the number of onSignalExit's that are in play.
    // It's important so that we can count the correct number of
    // listeners on signals, and don't wait for the other one to
    // handle it instead of us.
    qt.count += 1, Wt = Wt.filter((function(e) {
        try {
            return process.on(e, Jt[e]), !0;
        } catch (e) {
            return !1;
        }
    })), process.emit = nn, process.reallyExit = en);
}

var Kt = process.reallyExit;

function en(e) {
    process.exitCode = e || 0, Vt("exit", process.exitCode, null), 
    /* istanbul ignore next */
    Vt("afterexit", process.exitCode, null), 
    /* istanbul ignore next */
    Kt.call(process, process.exitCode);
}

var tn = process.emit;

function nn(e, t) {
    if ("exit" === e) {
        void 0 !== t && (process.exitCode = t);
        var n = tn.apply(this, arguments);
        return Vt("exit", process.exitCode, null), 
        /* istanbul ignore next */
        Vt("afterexit", process.exitCode, null), n;
    }
    return tn.apply(this, arguments);
}

Ht.unload = zt, Ht.signals = function() {
    return Wt;
}, Ht.load = Zt;

// lodash's way of repeating
function rn(e, t) {
    var n = "", r = t;
    do {
        r % 2 && (n += e), r = Math.floor(r / 2), 
        /*eslint no-self-assign: 0*/
        e += e;
    } while (r && kt(n) < t);
    return Mt(n, t);
}

var on = {
    activityIndicator: function(e, t, n) {
        var r, i;
        if (null != e.spun) return r = t, i = e.spun, r[i % r.length];
    },
    progressbar: function(e, t, n) {
        if (null != e.completed) return function(e, t, n) {
            if (jt("ONN", [ e, t, n ]), n < 0 && (n = 0), n > 1 && (n = 1), t <= 0) return "";
            var r = Math.round(t * n), i = t - r, o = [ {
                type: "complete",
                value: rn(e.complete, r),
                length: r
            }, {
                type: "remaining",
                value: rn(e.remaining, i),
                length: i
            } ];
            return Bt(t, o, e);
        }(t, n, e.completed);
    }
}, an = function() {
    return sn.newThemeSet();
}, sn = {};

sn.baseTheme = on, sn.newTheme = function(e, t) {
    return t || (t = e, e = this.baseTheme), Ct({}, e, t);
}, sn.getThemeNames = function() {
    return Object.keys(this.themes);
}, sn.addTheme = function(e, t, n) {
    this.themes[e] = this.newTheme(t, n);
}, sn.addToAllThemes = function(e) {
    var t = this.themes;
    Object.keys(t).forEach((function(n) {
        Ct(t[n], e);
    })), Ct(this.baseTheme, e);
}, sn.getTheme = function(e) {
    if (!this.themes[e]) throw this.newMissingThemeError(e);
    return this.themes[e];
}, sn.setDefault = function(e, t) {
    null == t && (t = e, e = {});
    var n = null == e.platform ? "fallback" : e.platform, r = !!e.hasUnicode, i = !!e.hasColor;
    this.defaults[n] || (this.defaults[n] = {
        true: {},
        false: {}
    }), this.defaults[n][r][i] = t;
}, sn.getDefault = function(e) {
    e || (e = {});
    var t = e.platform || process.platform, n = this.defaults[t] || this.defaults.fallback, r = !!e.hasUnicode, i = !!e.hasColor;
    if (!n) throw this.newMissingDefaultThemeError(t, r, i);
    if (!n[r][i]) if (r && i && n[!r][i]) r = !1; else if (r && i && n[r][!i]) i = !1; else if (r && i && n[!r][!i]) r = !1, 
    i = !1; else if (r && !i && n[!r][i]) r = !1; else if (!r && i && n[r][!i]) i = !1; else if (n === this.defaults.fallback) throw this.newMissingDefaultThemeError(t, r, i);
    return n[r][i] ? this.getTheme(n[r][i]) : this.getDefault(Ct({}, e, {
        platform: "fallback"
    }));
}, sn.newMissingThemeError = function e(t) {
    var n = new Error('Could not find a gauge theme named "' + t + '"');
    return Error.captureStackTrace.call(n, e), n.theme = t, n.code = "EMISSINGTHEME", 
    n;
}, sn.newMissingDefaultThemeError = function e(t, n, r) {
    var i = new Error("Could not find a gauge theme for your platform/unicode/color use combo:\n    platform = " + t + "\n    hasUnicode = " + n + "\n    hasColor = " + r);
    return Error.captureStackTrace.call(i, e), i.platform = t, i.hasUnicode = n, i.hasColor = r, 
    i.code = "EMISSINGTHEME", i;
}, sn.newThemeSet = function() {
    var e = function(t) {
        return e.getDefault(t);
    };
    return Ct(e, sn, {
        themes: Ct({}, this.themes),
        baseTheme: Ct({}, this.baseTheme),
        defaults: JSON.parse(JSON.stringify(this.defaults || {}))
    });
};

var ln = v((function(e) {
    var t = e.exports = new an;
    t.addTheme("ASCII", {
        preProgressbar: "[",
        postProgressbar: "]",
        progressbarTheme: {
            complete: "#",
            remaining: "."
        },
        activityIndicatorTheme: "-\\|/",
        preSubsection: ">"
    }), t.addTheme("colorASCII", t.getTheme("ASCII"), {
        progressbarTheme: {
            preComplete: _t("inverse"),
            complete: " ",
            postComplete: _t("stopInverse"),
            preRemaining: _t("brightBlack"),
            remaining: ".",
            postRemaining: _t("reset")
        }
    }), t.addTheme("brailleSpinner", {
        preProgressbar: "⸨",
        postProgressbar: "⸩",
        progressbarTheme: {
            complete: "░",
            remaining: "⠂"
        },
        activityIndicatorTheme: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏",
        preSubsection: ">"
    }), t.addTheme("colorBrailleSpinner", t.getTheme("brailleSpinner"), {
        progressbarTheme: {
            preComplete: _t("inverse"),
            complete: " ",
            postComplete: _t("stopInverse"),
            preRemaining: _t("brightBlack"),
            remaining: "░",
            postRemaining: _t("reset")
        }
    }), t.setDefault({}, "ASCII"), t.setDefault({
        hasColor: !0
    }, "colorASCII"), t.setDefault({
        platform: "darwin",
        hasUnicode: !0
    }, "brailleSpinner"), t.setDefault({
        platform: "darwin",
        hasUnicode: !0,
        hasColor: !0
    }, "colorBrailleSpinner");
})), un = setInterval, cn = process, hn = v((function(e) {
    try {
        e.exports = setImmediate;
    } catch (t) {
        e.exports = cn.nextTick;
    }
})), dn = pn;

// this exists so we can replace it during testing
function fn(e, t) {
    return function() {
        return t.call(e);
    };
}

function pn(e, t) {
    var n, r;
    e && e.write ? (r = e, n = t || {}) : t && t.write ? (r = t, n = e || {}) : (r = cn.stderr, 
    n = e || t || {}), this._status = {
        spun: 0,
        section: "",
        subsection: ""
    }, this._paused = !1, // are we paused for back pressure?
    this._disabled = !0, // are all progress bar updates disabled?
    this._showing = !1, // do we WANT the progress bar on screen
    this._onScreen = !1, // IS the progress bar on screen
    this._needsRedraw = !1, // should we print something at next tick?
    this._hideCursor = null == n.hideCursor || n.hideCursor, this._fixedFramerate = null == n.fixedFramerate ? !/^v0\.8\./.test(cn.version) : n.fixedFramerate, 
    this._lastUpdateAt = null, this._updateInterval = null == n.updateInterval ? 50 : n.updateInterval, 
    this._themes = n.themes || ln, this._theme = n.theme;
    var i = this._computeTheme(n.theme), o = n.template || [ {
        type: "progressbar",
        length: 20
    }, {
        type: "activityIndicator",
        kerning: 1,
        length: 1
    }, {
        type: "section",
        kerning: 1,
        default: ""
    }, {
        type: "subsection",
        kerning: 1,
        default: ""
    } ];
    this.setWriteTo(r, n.tty);
    var a = n.Plumbing || Ut;
    this._gauge = new a(i, o, this.getWidth()), this._$$doRedraw = fn(this, this._doRedraw), 
    this._$$handleSizeChange = fn(this, this._handleSizeChange), this._cleanupOnExit = null == n.cleanupOnExit || n.cleanupOnExit, 
    this._removeOnExit = null, n.enabled || null == n.enabled && this._tty && this._tty.isTTY ? this.enable() : this.disable();
}

pn.prototype = {}, pn.prototype.isEnabled = function() {
    return !this._disabled;
}, pn.prototype.setTemplate = function(e) {
    this._gauge.setTemplate(e), this._showing && this._requestRedraw();
}, pn.prototype._computeTheme = function(e) {
    if (e || (e = {}), "string" == typeof e) e = this._themes.getTheme(e); else if (e && (0 === Object.keys(e).length || null != e.hasUnicode || null != e.hasColor)) {
        var t = null == e.hasUnicode ? $t() : e.hasUnicode, n = null == e.hasColor ? Gt : e.hasColor;
        e = this._themes.getDefault({
            hasUnicode: t,
            hasColor: n,
            platform: e.platform
        });
    }
    return e;
}, pn.prototype.setThemeset = function(e) {
    this._themes = e, this.setTheme(this._theme);
}, pn.prototype.setTheme = function(e) {
    this._gauge.setTheme(this._computeTheme(e)), this._showing && this._requestRedraw(), 
    this._theme = e;
}, pn.prototype._requestRedraw = function() {
    this._needsRedraw = !0, this._fixedFramerate || this._doRedraw();
}, pn.prototype.getWidth = function() {
    return (this._tty && this._tty.columns || 80) - 1;
}, pn.prototype.setWriteTo = function(e, t) {
    var n = !this._disabled;
    n && this.disable(), this._writeTo = e, this._tty = t || e === cn.stderr && cn.stdout.isTTY && cn.stdout || e.isTTY && e || this._tty, 
    this._gauge && this._gauge.setWidth(this.getWidth()), n && this.enable();
}, pn.prototype.enable = function() {
    this._disabled && (this._disabled = !1, this._tty && this._enableEvents(), this._showing && this.show());
}, pn.prototype.disable = function() {
    this._disabled || (this._showing && (this._lastUpdateAt = null, this._showing = !1, 
    this._doRedraw(), this._showing = !0), this._disabled = !0, this._tty && this._disableEvents());
}, pn.prototype._enableEvents = function() {
    this._cleanupOnExit && (this._removeOnExit = Ht(fn(this, this.disable))), this._tty.on("resize", this._$$handleSizeChange), 
    this._fixedFramerate && (this.redrawTracker = un(this._$$doRedraw, this._updateInterval), 
    this.redrawTracker.unref && this.redrawTracker.unref());
}, pn.prototype._disableEvents = function() {
    this._tty.removeListener("resize", this._$$handleSizeChange), this._fixedFramerate && clearInterval(this.redrawTracker), 
    this._removeOnExit && this._removeOnExit();
}, pn.prototype.hide = function(e) {
    return this._disabled ? e && cn.nextTick(e) : this._showing ? (this._showing = !1, 
    this._doRedraw(), void (e && hn(e))) : e && cn.nextTick(e);
}, pn.prototype.show = function(e, t) {
    if (this._showing = !0, "string" == typeof e) this._status.section = e; else if ("object" == typeof e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) {
        var i = n[r];
        this._status[i] = e[i];
    }
    null != t && (this._status.completed = t), this._disabled || this._requestRedraw();
}, pn.prototype.pulse = function(e) {
    this._status.subsection = e || "", this._status.spun++, this._disabled || this._showing && this._requestRedraw();
}, pn.prototype._handleSizeChange = function() {
    this._gauge.setWidth(this._tty.columns - 1), this._requestRedraw();
}, pn.prototype._doRedraw = function() {
    if (!this._disabled && !this._paused) {
        if (!this._fixedFramerate) {
            var e = Date.now();
            if (this._lastUpdateAt && e - this._lastUpdateAt < this._updateInterval) return;
            this._lastUpdateAt = e;
        }
        if (!this._showing && this._onScreen) {
            this._onScreen = !1;
            var t = this._gauge.hide();
            return this._hideCursor && (t += this._gauge.showCursor()), this._writeTo.write(t);
        }
        (this._showing || this._onScreen) && (this._showing && !this._onScreen && (this._onScreen = !0, 
        this._needsRedraw = !0, this._hideCursor && this._writeTo.write(this._gauge.hideCursor())), 
        this._needsRedraw && (this._writeTo.write(this._gauge.show(this._status)) || (this._paused = !0, 
        this._writeTo.on("drain", fn(this, (function() {
            this._paused = !1, this._doRedraw();
        }))))));
    }
};

var vn = v((function(e, t) {
    var n, r = u.EventEmitter, i = e.exports = new r;
    n = !0, [ process.stdout, process.stderr ].forEach((function(e) {
        e._handle && e.isTTY && "function" == typeof e._handle.setBlocking && e._handle.setBlocking(n);
    }));
    var o, a, s = process.stderr;
    Object.defineProperty(i, "stream", {
        set: function(e) {
            s = e, this.gauge && this.gauge.setWriteTo(s, s);
        },
        get: function() {
            return s;
        }
    }), i.useColor = function() {
        return null != o ? o : s.isTTY;
    }, i.enableColor = function() {
        o = !0, this.gauge.setTheme({
            hasColor: o,
            hasUnicode: a
        });
    }, i.disableColor = function() {
        o = !1, this.gauge.setTheme({
            hasColor: o,
            hasUnicode: a
        });
    }, 
    // default level
    i.level = "info", i.gauge = new dn(s, {
        enabled: !1,
        // no progress bars unless asked
        theme: {
            hasColor: i.useColor()
        },
        template: [ {
            type: "progressbar",
            length: 20
        }, {
            type: "activityIndicator",
            kerning: 1,
            length: 1
        }, {
            type: "section",
            default: ""
        }, ":", {
            type: "logline",
            kerning: 1,
            default: ""
        } ]
    }), i.tracker = new ct.TrackerGroup, 
    // we track this separately as we may need to temporarily disable the
    // display of the status bar for our own loggy purposes.
    i.progressEnabled = i.gauge.isEnabled(), i.enableUnicode = function() {
        a = !0, this.gauge.setTheme({
            hasColor: this.useColor(),
            hasUnicode: a
        });
    }, i.disableUnicode = function() {
        a = !1, this.gauge.setTheme({
            hasColor: this.useColor(),
            hasUnicode: a
        });
    }, i.setGaugeThemeset = function(e) {
        this.gauge.setThemeset(e);
    }, i.setGaugeTemplate = function(e) {
        this.gauge.setTemplate(e);
    }, i.enableProgress = function() {
        this.progressEnabled || (this.progressEnabled = !0, this.tracker.on("change", this.showProgress), 
        this._pause || this.gauge.enable());
    }, i.disableProgress = function() {
        this.progressEnabled && (this.progressEnabled = !1, this.tracker.removeListener("change", this.showProgress), 
        this.gauge.disable());
    };
    var c = [ "newGroup", "newItem", "newStream" ], h = function(e) {
        // mixin the public methods from log into the tracker
        // (except: conflicts and one's we handle specially)
        return Object.keys(i).forEach((function(t) {
            if ("_" !== t[0] && !c.filter((function(e) {
                return e === t;
            })).length && !e[t] && "function" == typeof i[t]) {
                var n = i[t];
                e[t] = function() {
                    return n.apply(i, arguments);
                };
            }
        })), 
        // if the new tracker is a group, make sure any subtrackers get
        // mixed in too
        e instanceof ct.TrackerGroup && c.forEach((function(t) {
            var n = e[t];
            e[t] = function() {
                return h(n.apply(e, arguments));
            };
        })), e;
    };
    // Add tracker constructors to the top level log object
    c.forEach((function(e) {
        i[e] = function() {
            return h(this.tracker[e].apply(this.tracker, arguments));
        };
    })), i.clearProgress = function(e) {
        if (!this.progressEnabled) return e && process.nextTick(e);
        this.gauge.hide(e);
    }, i.showProgress = function(e, t) {
        if (this.progressEnabled) {
            var n = {};
            e && (n.section = e);
            var r = i.record[i.record.length - 1];
            if (r) {
                n.subsection = r.prefix;
                var o = i.disp[r.level] || r.level, a = this._format(o, i.style[r.level]);
                r.prefix && (a += " " + this._format(r.prefix, this.prefixStyle)), a += " " + r.message.split(/\r?\n/)[0], 
                n.logline = a;
            }
            n.completed = t || this.tracker.completed(), this.gauge.show(n);
        }
    }.bind(i), // bind for use in tracker's on-change listener
    // temporarily stop emitting, but don't drop
    i.pause = function() {
        this._paused = !0, this.progressEnabled && this.gauge.disable();
    }, i.resume = function() {
        if (this._paused) {
            this._paused = !1;
            var e = this._buffer;
            this._buffer = [], e.forEach((function(e) {
                this.emitLog(e);
            }), this), this.progressEnabled && this.gauge.enable();
        }
    }, i._buffer = [];
    var d = 0;
    i.record = [], i.maxRecordSize = 1e4, i.log = function(e, t, n) {
        var r = this.levels[e];
        if (void 0 === r) return this.emit("error", new Error(l.format("Undefined log level: %j", e)));
        for (var i = new Array(arguments.length - 2), o = null, a = 2; a < arguments.length; a++) {
            var s = i[a - 2] = arguments[a];
            // resolve stack traces to a plain string.
                        "object" == typeof s && s && s instanceof Error && s.stack && Object.defineProperty(s, "stack", {
                value: o = s.stack + "",
                enumerable: !0,
                writable: !0
            });
        }
        o && i.unshift(o + "\n"), n = l.format.apply(l, i);
        var u = {
            id: d++,
            level: e,
            prefix: String(t || ""),
            message: n,
            messageRaw: i
        };
        this.emit("log", u), this.emit("log." + e, u), u.prefix && this.emit(u.prefix, u), 
        this.record.push(u);
        var c = this.maxRecordSize, h = this.record.length - c;
        if (h > c / 10) {
            var f = Math.floor(.9 * c);
            this.record = this.record.slice(-1 * f);
        }
        this.emitLog(u);
    }.bind(i), i.emitLog = function(e) {
        if (this._paused) this._buffer.push(e); else {
            this.progressEnabled && this.gauge.pulse(e.prefix);
            var t = this.levels[e.level];
            if (void 0 !== t && !(t < this.levels[this.level]) && (!(t > 0) || isFinite(t))) {
                // If 'disp' is null or undefined, use the lvl as a default
                // Allows: '', 0 as valid disp
                var n = null != i.disp[e.level] ? i.disp[e.level] : e.level;
                this.clearProgress(), e.message.split(/\r?\n/).forEach((function(t) {
                    this.heading && (this.write(this.heading, this.headingStyle), this.write(" ")), 
                    this.write(n, i.style[e.level]);
                    var r = e.prefix || "";
                    r && this.write(" "), this.write(r, this.prefixStyle), this.write(" " + t + "\n");
                }), this), this.showProgress();
            }
        }
    }, i._format = function(e, t) {
        if (s) {
            var n = "";
            if (this.useColor()) {
                var r = [];
                (t = t || {}).fg && r.push(t.fg), t.bg && r.push("bg" + t.bg[0].toUpperCase() + t.bg.slice(1)), 
                t.bold && r.push("bold"), t.underline && r.push("underline"), t.inverse && r.push("inverse"), 
                r.length && (n += _t(r)), t.beep && (n += vt());
            }
            return n += e, this.useColor() && (n += _t("reset")), n;
        }
    }, i.write = function(e, t) {
        s && s.write(this._format(e, t));
    }, i.addLevel = function(e, t, n, r) {
        // If 'disp' is null or undefined, use the lvl as a default
        null == r && (r = e), this.levels[e] = t, this.style[e] = n, this[e] || (this[e] = function() {
            var t = new Array(arguments.length + 1);
            t[0] = e;
            for (var n = 0; n < arguments.length; n++) t[n + 1] = arguments[n];
            return this.log.apply(this, t);
        }.bind(this)), this.disp[e] = r;
    }, i.prefixStyle = {
        fg: "magenta"
    }, i.headingStyle = {
        fg: "white",
        bg: "black"
    }, i.style = {}, i.levels = {}, i.disp = {}, i.addLevel("silly", -1 / 0, {
        inverse: !0
    }, "sill"), i.addLevel("verbose", 1e3, {
        fg: "blue",
        bg: "black"
    }, "verb"), i.addLevel("info", 2e3, {
        fg: "green"
    }), i.addLevel("timing", 2500, {
        fg: "green",
        bg: "black"
    }), i.addLevel("http", 3e3, {
        fg: "green",
        bg: "black"
    }), i.addLevel("notice", 3500, {
        fg: "blue",
        bg: "black"
    }), i.addLevel("warn", 4e3, {
        fg: "black",
        bg: "yellow"
    }, "WARN"), i.addLevel("error", 5e3, {
        fg: "red",
        bg: "black"
    }, "ERR!"), i.addLevel("silent", 1 / 0), 
    // allow 'error' prefix
    i.on("error", (function() {}));
})), bn = "win32" === process.platform, gn = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function _n(e) {
    return "function" == typeof e ? e : function() {
        // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
        // is fairly slow to generate.
        var e;
        if (gn) {
            var t = new Error;
            e = function(e) {
                e && (t.message = e.message, n(e = t));
            };
        } else e = n;
        return e;
        function n(e) {
            if (e) {
                if (process.throwDeprecation) throw e;
 // Forgot a callback but don't know where? Use NODE_DEBUG=fs
                                if (!process.noDeprecation) {
                    var t = "fs: missing callback " + (e.stack || e.message);
                    process.traceDeprecation ? console.trace(t) : console.error(t);
                }
            }
        }
    }();
}

r.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (bn) var mn = /(.*?)(?:[\/\\]+|$)/g; else mn = /(.*?)(?:[\/]+|$)/g;

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (bn) var yn = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/; else yn = /^[\/]*/;

var wn = function(e, t) {
    if (
    // make p is absolute
    e = r.resolve(e), t && Object.prototype.hasOwnProperty.call(t, e)) return t[e];
    var i, o, a, s, l = e, u = {}, c = {};
    // current character position in p
        function h() {
        // Skip over roots
        var t = yn.exec(e);
        i = t[0].length, o = t[0], a = t[0], s = "", 
        // On windows, check that the root exists. On unix there is no need.
        bn && !c[a] && (n.lstatSync(a), c[a] = !0);
    }
    // walk down the path, swapping out linked pathparts for their real
    // values
    // NB: p.length changes.
        for (h(); i < e.length; ) {
        // find the next part
        mn.lastIndex = i;
        var d = mn.exec(e);
        // continue if not a symlink
        if (s = o, o += d[0], a = s + d[1], i = mn.lastIndex, !(c[a] || t && t[a] === a)) {
            var f;
            if (t && Object.prototype.hasOwnProperty.call(t, a)) 
            // some known symbolic link.  no need to stat again.
            f = t[a]; else {
                var p = n.lstatSync(a);
                if (!p.isSymbolicLink()) {
                    c[a] = !0, t && (t[a] = a);
                    continue;
                }
                // read the link if it wasn't read before
                // dev/ino always return 0 on windows, so skip the check.
                                var v = null;
                if (!bn) {
                    var b = p.dev.toString(32) + ":" + p.ino.toString(32);
                    u.hasOwnProperty(b) && (v = u[b]);
                }
                null === v && (n.statSync(a), v = n.readlinkSync(a)), f = r.resolve(s, v), 
                // track this, if given a cache.
                t && (t[a] = f), bn || (u[b] = v);
            }
            // resolve the link, then start over
                        e = r.resolve(f, e.slice(i)), h();
        }
    }
    return t && (t[l] = e), e;
}, En = function(e, t, i) {
    if ("function" != typeof i && (i = _n(t), t = null), 
    // make p is absolute
    e = r.resolve(e), t && Object.prototype.hasOwnProperty.call(t, e)) return process.nextTick(i.bind(null, null, t[e]));
    var o, a, s, l, u = e, c = {}, h = {};
    // current character position in p
        function d() {
        // Skip over roots
        var t = yn.exec(e);
        o = t[0].length, a = t[0], s = t[0], l = "", 
        // On windows, check that the root exists. On unix there is no need.
        bn && !h[s] ? n.lstat(s, (function(e) {
            if (e) return i(e);
            h[s] = !0, f();
        })) : process.nextTick(f);
    }
    // walk down the path, swapping out linked pathparts for their real
    // values
        function f() {
        // stop if scanned past end of path
        if (o >= e.length) return t && (t[u] = e), i(null, e);
        // find the next part
                mn.lastIndex = o;
        var r = mn.exec(e);
        // continue if not a symlink
        return l = a, a += r[0], s = l + r[1], o = mn.lastIndex, h[s] || t && t[s] === s ? process.nextTick(f) : t && Object.prototype.hasOwnProperty.call(t, s) ? b(t[s]) : n.lstat(s, p);
    }
    function p(e, r) {
        if (e) return i(e);
        // if not a symlink, skip to the next path part
                if (!r.isSymbolicLink()) return h[s] = !0, t && (t[s] = s), process.nextTick(f);
        // stat & read the link if not read before
        // call gotTarget as soon as the link target is known
        // dev/ino always return 0 on windows, so skip the check.
                if (!bn) {
            var o = r.dev.toString(32) + ":" + r.ino.toString(32);
            if (c.hasOwnProperty(o)) return v(null, c[o], s);
        }
        n.stat(s, (function(e) {
            if (e) return i(e);
            n.readlink(s, (function(e, t) {
                bn || (c[o] = t), v(e, t);
            }));
        }));
    }
    function v(e, n, o) {
        if (e) return i(e);
        var a = r.resolve(l, n);
        t && (t[o] = a), b(a);
    }
    function b(t) {
        // resolve the link, then start over
        e = r.resolve(t, e.slice(o)), d();
    }
    d();
}, kn = An;

An.realpath = An, An.sync = Rn, An.realpathSync = Rn, An.monkeypatch = function() {
    n.realpath = An, n.realpathSync = Rn;
}, An.unmonkeypatch = function() {
    n.realpath = Sn, n.realpathSync = xn;
};

var Sn = n.realpath, xn = n.realpathSync, jn = process.version, Tn = /^v[0-5]\./.test(jn);

function On(e) {
    return e && "realpath" === e.syscall && ("ELOOP" === e.code || "ENOMEM" === e.code || "ENAMETOOLONG" === e.code);
}

function An(e, t, n) {
    if (Tn) return Sn(e, t, n);
    "function" == typeof t && (n = t, t = null), Sn(e, t, (function(r, i) {
        On(r) ? En(e, t, n) : n(r, i);
    }));
}

function Rn(e, t) {
    if (Tn) return xn(e, t);
    try {
        return xn(e, t);
    } catch (n) {
        if (On(n)) return wn(e, t);
        throw n;
    }
}

var Cn = Array.isArray || function(e) {
    return "[object Array]" === Object.prototype.toString.call(e);
}, Mn = Nn;

function Nn(e, t, n) {
    e instanceof RegExp && (e = In(e, n)), t instanceof RegExp && (t = In(t, n));
    var r = Ln(e, t, n);
    return r && {
        start: r[0],
        end: r[1],
        pre: n.slice(0, r[0]),
        body: n.slice(r[0] + e.length, r[1]),
        post: n.slice(r[1] + t.length)
    };
}

function In(e, t) {
    var n = t.match(e);
    return n ? n[0] : null;
}

function Ln(e, t, n) {
    var r, i, o, a, s, l = n.indexOf(e), u = n.indexOf(t, l + 1), c = l;
    if (l >= 0 && u > 0) {
        for (r = [], o = n.length; c >= 0 && !s; ) c == l ? (r.push(c), l = n.indexOf(e, c + 1)) : 1 == r.length ? s = [ r.pop(), u ] : ((i = r.pop()) < o && (o = i, 
        a = u), u = n.indexOf(t, c + 1)), c = l < u && l >= 0 ? l : u;
        r.length && (s = [ o, a ]);
    }
    return s;
}

Nn.range = Ln;

var Pn = function(e) {
    if (!e) return [];
    // I don't know why Bash 4.3 does this, but it does.
    // Anything starting with {} will have the first two bytes preserved
    // but *only* at the top level, so {},a}b will not expand to anything,
    // but a{},b}c will be expanded to [a}c,abc].
    // One could argue that this is a bug in Bash, but since the goal of
    // this module is to match Bash's rules, we escape a leading {}
        "{}" === e.substr(0, 2) && (e = "\\{\\}" + e.substr(2));
    return function e(t, n) {
        var r = [], i = Mn("{", "}", t);
        if (!i || /\$$/.test(i.pre)) return [ t ];
        var o, a = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(i.body), s = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(i.body), l = a || s, u = i.body.indexOf(",") >= 0;
        if (!l && !u) 
        // {a},b}
        return i.post.match(/,.*\}/) ? (t = i.pre + "{" + i.body + Un + i.post, e(t)) : [ t ];
        if (l) o = i.body.split(/\.\./); else {
            if (1 === (o = 
            // Basically just str.split(","), but handling cases
            // where we have nested braced sections, which should be
            // treated as individual members, like {a,{b,c},d}
            function e(t) {
                if (!t) return [ "" ];
                var n = [], r = Mn("{", "}", t);
                if (!r) return t.split(",");
                var i = r.pre, o = r.body, a = r.post, s = i.split(",");
                s[s.length - 1] += "{" + o + "}";
                var l = e(a);
                a.length && (s[s.length - 1] += l.shift(), s.push.apply(s, l));
                return n.push.apply(n, s), n;
            }(i.body)).length) if (1 === (
            // x{{a,b}}y ==> x{a}y x{b}y
            o = e(o[0], !1).map(Fn)).length) return (d = i.post.length ? e(i.post, !1) : [ "" ]).map((function(e) {
                return i.pre + o[0] + e;
            }));
        }
        // at this point, n is the parts, and we know it's not a comma set
        // with a single entry.
        // no need to expand pre, since it is guaranteed to be free of brace-sets
                var c, h = i.pre, d = i.post.length ? e(i.post, !1) : [ "" ];
        if (l) {
            var f = qn(o[0]), p = qn(o[1]), v = Math.max(o[0].length, o[1].length), b = 3 == o.length ? Math.abs(qn(o[2])) : 1, g = zn;
            p < f && (b *= -1, g = Yn);
            var _ = o.some(Hn);
            c = [];
            for (var m = f; g(m, p); m += b) {
                var y;
                if (s) "\\" === (y = String.fromCharCode(m)) && (y = ""); else if (y = String(m), 
                _) {
                    var w = v - y.length;
                    if (w > 0) {
                        var E = new Array(w + 1).join("0");
                        y = m < 0 ? "-" + E + y.slice(1) : E + y;
                    }
                }
                c.push(y);
            }
        } else c = function(e, t) {
            for (var n = [], r = 0; r < e.length; r++) {
                var i = t(e[r], r);
                Cn(i) ? n.push.apply(n, i) : n.push(i);
            }
            return n;
        }(o, (function(t) {
            return e(t, !1);
        }));
        for (var k = 0; k < c.length; k++) for (var S = 0; S < d.length; S++) {
            var x = h + c[k] + d[S];
            (!n || l || x) && r.push(x);
        }
        return r;
    }(function(e) {
        return e.split("\\\\").join(Dn).split("\\{").join(Bn).split("\\}").join(Un).split("\\,").join($n).split("\\.").join(Gn);
    }(e), !0).map(Wn);
}, Dn = "\0SLASH" + Math.random() + "\0", Bn = "\0OPEN" + Math.random() + "\0", Un = "\0CLOSE" + Math.random() + "\0", $n = "\0COMMA" + Math.random() + "\0", Gn = "\0PERIOD" + Math.random() + "\0";

function qn(e) {
    return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
}

function Wn(e) {
    return e.split(Dn).join("\\").split(Bn).join("{").split(Un).join("}").split($n).join(",").split(Gn).join(".");
}

function Fn(e) {
    return "{" + e + "}";
}

function Hn(e) {
    return /^-?0\d/.test(e);
}

function zn(e, t) {
    return e <= t;
}

function Yn(e, t) {
    return e >= t;
}

var Vn = tr;

tr.Minimatch = nr;

var Jn = {
    sep: "/"
};

try {
    Jn = r;
} catch (e) {}

var Zn = tr.GLOBSTAR = nr.GLOBSTAR = {}, Qn = {
    "!": {
        open: "(?:(?!(?:",
        close: "))[^/]*?)"
    },
    "?": {
        open: "(?:",
        close: ")?"
    },
    "+": {
        open: "(?:",
        close: ")+"
    },
    "*": {
        open: "(?:",
        close: ")*"
    },
    "@": {
        open: "(?:",
        close: ")"
    }
}, Xn = "().*{}+?[]^$\\!".split("").reduce((function(e, t) {
    return e[t] = !0, e;
}), {});

// normalizes slashes.
var Kn = /\/+/;

function er(e, t) {
    e = e || {}, t = t || {};
    var n = {};
    return Object.keys(t).forEach((function(e) {
        n[e] = t[e];
    })), Object.keys(e).forEach((function(t) {
        n[t] = e[t];
    })), n;
}

function tr(e, t, n) {
    if ("string" != typeof t) throw new TypeError("glob pattern string required");
    // shortcut: comments match nothing.
    return n || (n = {}), !(!n.nocomment && "#" === t.charAt(0)) && (
    // "" only matches ""
    "" === t.trim() ? "" === e : new nr(t, n).match(e));
}

function nr(e, t) {
    if (!(this instanceof nr)) return new nr(e, t);
    if ("string" != typeof e) throw new TypeError("glob pattern string required");
    t || (t = {}), e = e.trim(), 
    // windows support: need to use /, not \
    "/" !== Jn.sep && (e = e.split(Jn.sep).join("/")), this.options = t, this.set = [], 
    this.pattern = e, this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, 
    // make the set of regexps etc.
    this.make();
}

function rr(e, t) {
    if (t || (t = this instanceof nr ? this.options : {}), void 0 === (e = void 0 === e ? this.pattern : e)) throw new TypeError("undefined pattern");
    return t.nobrace || !e.match(/\{.*\}/) ? [ e ] : Pn(e);
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.

// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
tr.filter = function(e, t) {
    return t = t || {}, function(n, r, i) {
        return tr(n, e, t);
    };
}, tr.defaults = function(e) {
    if (!e || !Object.keys(e).length) return tr;
    var t = tr, n = function(n, r, i) {
        return t.minimatch(n, r, er(e, i));
    };
    return n.Minimatch = function(n, r) {
        return new t.Minimatch(n, er(e, r));
    }, n;
}, nr.defaults = function(e) {
    return e && Object.keys(e).length ? tr.defaults(e).Minimatch : nr;
}, nr.prototype.debug = function() {}, nr.prototype.make = function() {
    // don't do it more than once.
    if (this._made) return;
    var e = this.pattern, t = this.options;
    // empty patterns and comments match nothing.
    if (!t.nocomment && "#" === e.charAt(0)) return void (this.comment = !0);
    if (!e) return void (this.empty = !0);
    // step 1: figure out negation, etc.
        this.parseNegate();
    // step 2: expand braces
    var n = this.globSet = this.braceExpand();
    t.debug && (this.debug = console.error);
    this.debug(this.pattern, n), 
    // step 3: now we have a set, so turn each one into a series of path-portion
    // matching patterns.
    // These will be regexps, except in the case of "**", which is
    // set to the GLOBSTAR object for globstar behavior,
    // and will not contain any / characters
    n = this.globParts = n.map((function(e) {
        return e.split(Kn);
    })), this.debug(this.pattern, n), 
    // glob --> regexps
    n = n.map((function(e, t, n) {
        return e.map(this.parse, this);
    }), this), this.debug(this.pattern, n), 
    // filter out everything that didn't compile properly.
    n = n.filter((function(e) {
        return -1 === e.indexOf(!1);
    })), this.debug(this.pattern, n), this.set = n;
}, nr.prototype.parseNegate = function() {
    var e = this.pattern, t = !1, n = this.options, r = 0;
    if (n.nonegate) return;
    for (var i = 0, o = e.length; i < o && "!" === e.charAt(i); i++) t = !t, r++;
    r && (this.pattern = e.substr(r));
    this.negate = t;
}
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg

// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
, tr.braceExpand = function(e, t) {
    return rr(e, t);
}, nr.prototype.braceExpand = rr, nr.prototype.parse = function(e, t) {
    if (e.length > 65536) throw new TypeError("pattern is too long");
    var n = this.options;
    // shortcuts
        if (!n.noglobstar && "**" === e) return Zn;
    if ("" === e) return "";
    var r, i = "", o = !!n.nocase, a = !1, s = [], l = [], u = !1, c = -1, h = -1, d = "." === e.charAt(0) ? "" : n.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", f = this;
    function p() {
        if (r) {
            // we had some state-tracking character
            // that wasn't consumed by this pass.
            switch (r) {
              case "*":
                i += "[^/]*?", o = !0;
                break;

              case "?":
                i += "[^/]", o = !0;
                break;

              default:
                i += "\\" + r;
            }
            f.debug("clearStateChar %j %j", r, i), r = !1;
        }
    }
    for (var v, b = 0, g = e.length; b < g && (v = e.charAt(b)); b++) 
    // skip over any that are escaped.
    if (this.debug("%s\t%s %s %j", e, b, i, v), a && Xn[v]) i += "\\" + v, a = !1; else switch (v) {
      case "/":
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return !1;

      case "\\":
        p(), a = !0;
        continue;

        // the various stateChar values
        // for the "extglob" stuff.
              case "?":
      case "*":
      case "+":
      case "@":
      case "!":
        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (this.debug("%s\t%s %s %j <-- stateChar", e, b, i, v), u) {
            this.debug("  in class"), "!" === v && b === h + 1 && (v = "^"), i += v;
            continue;
        }
        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
                f.debug("call clearStateChar %j", r), p(), r = v, 
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        n.noext && p();
        continue;

      case "(":
        if (u) {
            i += "(";
            continue;
        }
        if (!r) {
            i += "\\(";
            continue;
        }
        s.push({
            type: r,
            start: b - 1,
            reStart: i.length,
            open: Qn[r].open,
            close: Qn[r].close
        }), 
        // negation is (?:(?!js)[^/]*)
        i += "!" === r ? "(?:(?!(?:" : "(?:", this.debug("plType %j %j", r, i), r = !1;
        continue;

      case ")":
        if (u || !s.length) {
            i += "\\)";
            continue;
        }
        p(), o = !0;
        var _ = s.pop();
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
                i += _.close, "!" === _.type && l.push(_), _.reEnd = i.length;
        continue;

      case "|":
        if (u || !s.length || a) {
            i += "\\|", a = !1;
            continue;
        }
        p(), i += "|";
        continue;

        // these are mostly the same in regexp and glob
              case "[":
        if (
        // swallow any state-tracking char before the [
        p(), u) {
            i += "\\" + v;
            continue;
        }
        u = !0, h = b, c = i.length, i += v;
        continue;

      case "]":
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (b === h + 1 || !u) {
            i += "\\" + v, a = !1;
            continue;
        }
        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
                if (u) {
            // split where the last [ was, make sure we don't have
            // an invalid re. if so, re-walk the contents of the
            // would-be class to re-translate any characters that
            // were passed through as-is
            // TODO: It would probably be faster to determine this
            // without a try/catch and a new RegExp, but it's tricky
            // to do safely.  For now, this is safe and works.
            var m = e.substring(h + 1, b);
            try {
                RegExp("[" + m + "]");
            } catch (e) {
                // not a valid class!
                var y = this.parse(m, ir);
                i = i.substr(0, c) + "\\[" + y[0] + "\\]", o = o || y[1], u = !1;
                continue;
            }
        }
        // finish up the class.
                o = !0, u = !1, i += v;
        continue;

      default:
        // swallow any state char that wasn't consumed
        p(), a ? 
        // no need
        a = !1 : !Xn[v] || "^" === v && u || (i += "\\"), i += v;
    } // switch
    // for
    // handle the case where we left a class open.
    // "[abc" is valid, equivalent to "\[abc"
        u && (
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    m = e.substr(h + 1), y = this.parse(m, ir), i = i.substr(0, c) + "\\[" + y[0], o = o || y[1]);
    // handle the case where we had a +( thing at the *end*
    // of the pattern.
    // each pattern list stack adds 3 chars, and we need to go through
    // and escape any | chars that were passed through as-is for the regexp.
    // Go through and escape them, taking care not to double-escape any
    // | chars that were already escaped.
        for (_ = s.pop(); _; _ = s.pop()) {
        var w = i.slice(_.reStart + _.open.length);
        this.debug("setting tail", i, _), 
        // maybe some even number of \, then maybe 1 \, followed by a |
        w = w.replace(/((?:\\{2}){0,64})(\\?)\|/g, (function(e, t, n) {
            // need to escape all those slashes *again*, without escaping the
            // one that we need for escaping the | character.  As it works out,
            // escaping an even number of slashes can be done by simply repeating
            // it exactly after itself.  That's why this trick works.
            // I am sorry that you have to see this.
            return n || (
            // the | isn't already escaped, so escape it.
            n = "\\"), t + t + n + "|";
        })), this.debug("tail=%j\n   %s", w, w, _, i);
        var E = "*" === _.type ? "[^/]*?" : "?" === _.type ? "[^/]" : "\\" + _.type;
        o = !0, i = i.slice(0, _.reStart) + E + "\\(" + w;
    }
    // handle trailing things that only matter at the very end.
        p(), a && (
    // trailing \\
    i += "\\\\");
    // only need to apply the nodot start if the re starts with
    // something that could conceivably capture a dot
        var k = !1;
    switch (i.charAt(0)) {
      case ".":
      case "[":
      case "(":
        k = !0;
    }
    // Hack to work around lack of negative lookbehind in JS
    // A pattern like: *.!(x).!(y|z) needs to ensure that a name
    // like 'a.xyz.yz' doesn't match.  So, the first negative
    // lookahead, has to look ALL the way ahead, to the end of
    // the pattern.
        for (var S = l.length - 1; S > -1; S--) {
        var x = l[S], j = i.slice(0, x.reStart), T = i.slice(x.reStart, x.reEnd - 8), O = i.slice(x.reEnd - 8, x.reEnd), A = i.slice(x.reEnd);
        O += A;
        // Handle nested stuff like *(*.js|!(*.json)), where open parens
        // mean that we should *not* include the ) in the bit that is considered
        // "after" the negated section.
        var R = j.split("(").length - 1, C = A;
        for (b = 0; b < R; b++) C = C.replace(/\)[+*?]?/, "");
        var M = "";
        "" === (A = C) && t !== ir && (M = "$"), i = j + T + A + M + O;
    }
    // if the re is not "" at this point, then we need to make sure
    // it doesn't match against an empty path part.
    // Otherwise a/* will match a/, which it should not.
        "" !== i && o && (i = "(?=.)" + i);
    k && (i = d + i);
    // parsing just a piece of a larger pattern.
        if (t === ir) return [ i, o ];
    // skip the regexp for non-magical patterns
    // unescape anything in it, though, so that it'll be
    // an exact match against a file etc.
        if (!o) 
    // replace stuff like \* with *
    return function(e) {
        return e.replace(/\\(.)/g, "$1");
    }(e);
    var N = n.nocase ? "i" : "";
    try {
        var I = new RegExp("^" + i + "$", N);
    } catch (e) {
        // If it was an invalid regular expression, then it can't match
        // anything.  This trick looks for a character after the end of
        // the string, which is of course impossible, except in multi-line
        // mode, but it's not a /m regex.
        return new RegExp("$.");
    }
    return I._glob = e, I._src = i, I;
};

var ir = {};

function or(e) {
    return "/" === e.charAt(0);
}

function ar(e) {
    // https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
    var t = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(e), n = t[1] || "", r = Boolean(n && ":" !== n.charAt(1));
    // UNC paths are always absolute
    return Boolean(t[2] || r);
}

tr.makeRe = function(e, t) {
    return new nr(e, t || {}).makeRe();
}, nr.prototype.makeRe = function() {
    if (this.regexp || !1 === this.regexp) return this.regexp;
    // at this point, this.set is a 2d array of partial
    // pattern strings, or "**".
    
    // It's better to use .match().  This function shouldn't
    // be used, really, but it's pretty convenient sometimes,
    // when you just want to work with a regex.
        var e = this.set;
    if (!e.length) return this.regexp = !1, this.regexp;
    var t = this.options, n = t.noglobstar ? "[^/]*?" : t.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?", r = t.nocase ? "i" : "", i = e.map((function(e) {
        return e.map((function(e) {
            return e === Zn ? n : "string" == typeof e ? function(e) {
                return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            }(e) : e._src;
        })).join("\\/");
    })).join("|");
    // can match anything, as long as it's not this.
    // must match entire pattern
    // ending in a * or ** will make it less strict.
    i = "^(?:" + i + ")$", this.negate && (i = "^(?!" + i + ").*$");
    try {
        this.regexp = new RegExp(i, r);
    } catch (e) {
        this.regexp = !1;
    }
    return this.regexp;
}, tr.match = function(e, t, n) {
    var r = new nr(t, n = n || {});
    return e = e.filter((function(e) {
        return r.match(e);
    })), r.options.nonull && !e.length && e.push(t), e;
}, nr.prototype.match = function(e, t) {
    // short-circuit in the case of busted things.
    // comments, etc.
    if (this.debug("match", e, this.pattern), this.comment) return !1;
    if (this.empty) return "" === e;
    if ("/" === e && t) return !0;
    var n = this.options;
    // windows: need to use /, not \
        "/" !== Jn.sep && (e = e.split(Jn.sep).join("/"));
    // treat the test path as a set of pathparts.
        e = e.split(Kn), this.debug(this.pattern, "split", e);
    // just ONE of the pattern sets in this.set needs to match
    // in order for it to be valid.  If negating, then just one
    // match means that we have failed.
    // Either way, return on the first hit.
    var r, i, o = this.set;
    for (this.debug(this.pattern, "set", o), i = e.length - 1; i >= 0 && !(r = e[i]); i--) ;
    for (i = 0; i < o.length; i++) {
        var a = o[i], s = e;
        if (n.matchBase && 1 === a.length && (s = [ r ]), this.matchOne(s, a, t)) return !!n.flipNegate || !this.negate;
    }
    // didn't get any hits.  this is success if it's a negative
    // pattern, failure otherwise.
        return !n.flipNegate && this.negate;
}
// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
, nr.prototype.matchOne = function(e, t, n) {
    var r = this.options;
    this.debug("matchOne", {
        this: this,
        file: e,
        pattern: t
    }), this.debug("matchOne", e.length, t.length);
    for (var i = 0, o = 0, a = e.length, s = t.length; i < a && o < s; i++, o++) {
        this.debug("matchOne loop");
        var l, u = t[o], c = e[i];
        // should be impossible.
        // some invalid regexp stuff in the set.
        if (this.debug(t, u, c), !1 === u) return !1;
        if (u === Zn) {
            this.debug("GLOBSTAR", [ t, u, c ]);
            // "**"
            // a/**/b/**/c would match the following:
            // a/b/x/y/z/c
            // a/x/y/z/b/c
            // a/b/x/b/x/c
            // a/b/c
            // To do this, take the rest of the pattern after
            // the **, and see if it would match the file remainder.
            // If so, return success.
            // If not, the ** "swallows" a segment, and try again.
            // This is recursively awful.
            // a/**/b/**/c matching a/b/x/y/z/c
            // - a matches a
            // - doublestar
            //   - matchOne(b/x/y/z/c, b/**/c)
            //     - b matches b
            //     - doublestar
            //       - matchOne(x/y/z/c, c) -> no
            //       - matchOne(y/z/c, c) -> no
            //       - matchOne(z/c, c) -> no
            //       - matchOne(c, c) yes, hit
            var h = i, d = o + 1;
            if (d === s) {
                // a ** at the end will just swallow the rest.
                // We have found a match.
                // however, it will not swallow /.x, unless
                // options.dot is set.
                // . and .. are *never* matched by **, for explosively
                // exponential reasons.
                for (this.debug("** at the end"); i < a; i++) if ("." === e[i] || ".." === e[i] || !r.dot && "." === e[i].charAt(0)) return !1;
                return !0;
            }
            // ok, let's see if we can swallow whatever we can.
                        for (;h < a; ) {
                var f = e[h];
                // XXX remove this slice.  Just pass the start index.
                if (this.debug("\nglobstar while", e, h, t, d, f), this.matchOne(e.slice(h), t.slice(d), n)) 
                // found a match.
                return this.debug("globstar found match!", h, a, f), !0;
                // can't swallow "." or ".." ever.
                // can only swallow ".foo" when explicitly asked.
                if ("." === f || ".." === f || !r.dot && "." === f.charAt(0)) {
                    this.debug("dot detected!", e, h, t, d);
                    break;
                }
                // ** swallows a segment, and continue.
                                this.debug("globstar swallow a segment, and continue"), h++;
            }
            // no match was found.
            // However, in partial mode, we can't say this is necessarily over.
            // If there's more *pattern* left, then
                        return !(!n || (
            // ran out of file
            this.debug("\n>>> no match, partial?", e, h, t, d), h !== a));
        }
        // something other than **
        // non-magic patterns just have to match exactly
        // patterns with magic have been turned into regexps.
                if ("string" == typeof u ? (l = r.nocase ? c.toLowerCase() === u.toLowerCase() : c === u, 
        this.debug("string match", u, c, l)) : (l = c.match(u), this.debug("pattern match", u, c, l)), 
        !l) return !1;
    }
    // Note: ending in / means that we'll get a final ""
    // at the end of the pattern.  This can only match a
    // corresponding "" at the end of the file.
    // If the file ends in /, then it can only match a
    // a pattern that ends in /, unless the pattern just
    // doesn't have any more for it. But, a/b/ should *not*
    // match "a/b/*", even though "" matches against the
    // [^/]*? pattern, except in partial mode, where it might
    // simply not be reached yet.
    // However, a/b/ should still satisfy a/*
    // now either we fell off the end of the pattern, or we're done.
        if (i === a && o === s) 
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return !0;
    // should be unreachable.
        if (i === a) 
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return n;
    if (o === s) return i === a - 1 && "" === e[i];
    throw new Error("wtf?");
};

var sr = "win32" === process.platform ? ar : or, lr = or, ur = ar;

sr.posix = lr, sr.win32 = ur;

var cr = Er, hr = wr, dr = function(e, t, n) {
    n || (n = {});
    // base-matching: just use globstar for that.
        if (n.matchBase && -1 === t.indexOf("/")) {
        if (n.noglobstar) throw new Error("base matching requires globstar");
        t = "**/" + t;
    }
    e.silent = !!n.silent, e.pattern = t, e.strict = !1 !== n.strict, e.realpath = !!n.realpath, 
    e.realpathCache = n.realpathCache || Object.create(null), e.follow = !!n.follow, 
    e.dot = !!n.dot, e.mark = !!n.mark, e.nodir = !!n.nodir, e.nodir && (e.mark = !0);
    e.sync = !!n.sync, e.nounique = !!n.nounique, e.nonull = !!n.nonull, e.nosort = !!n.nosort, 
    e.nocase = !!n.nocase, e.stat = !!n.stat, e.noprocess = !!n.noprocess, e.absolute = !!n.absolute, 
    e.maxLength = n.maxLength || 1 / 0, e.cache = n.cache || Object.create(null), e.statCache = n.statCache || Object.create(null), 
    e.symlinks = n.symlinks || Object.create(null), function(e, t) {
        e.ignore = t.ignore || [], Array.isArray(e.ignore) || (e.ignore = [ e.ignore ]);
        e.ignore.length && (e.ignore = e.ignore.map(kr));
    }
    // ignore patterns are always in dot:true mode.
    (e, n), e.changedCwd = !1;
    var i = process.cwd();
    mr(n, "cwd") ? (e.cwd = r.resolve(n.cwd), e.changedCwd = e.cwd !== i) : e.cwd = i;
    e.root = n.root || r.resolve(e.cwd, "/"), e.root = r.resolve(e.root), "win32" === process.platform && (e.root = e.root.replace(/\\/g, "/"));
    // TODO: is an absolute `cwd` supposed to be resolved against `root`?
    // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
        e.cwdAbs = sr(e.cwd) ? e.cwd : Sr(e, e.cwd), "win32" === process.platform && (e.cwdAbs = e.cwdAbs.replace(/\\/g, "/"));
    e.nomount = !!n.nomount, 
    // disable comments and negation in Minimatch.
    // Note that they are not supported in Glob itself anyway.
    n.nonegate = !0, n.nocomment = !0, e.minimatch = new yr(t, n), e.options = e.minimatch.options;
}, fr = mr, pr = Sr, vr = function(e) {
    for (var t = e.nounique, n = t ? [] : Object.create(null), r = 0, i = e.matches.length; r < i; r++) {
        var o = e.matches[r];
        if (o && 0 !== Object.keys(o).length) {
            // had matches
            var a = Object.keys(o);
            t ? n.push.apply(n, a) : a.forEach((function(e) {
                n[e] = !0;
            }));
        } else if (e.nonull) {
            // do like the shell, and spit out the literal glob
            var s = e.minimatch.globSet[r];
            t ? n.push(s) : n[s] = !0;
        }
    }
    t || (n = Object.keys(n));
    e.nosort || (n = n.sort(e.nocase ? wr : Er));
    // at *some* point we statted all of these
        if (e.mark) {
        for (r = 0; r < n.length; r++) n[r] = e._mark(n[r]);
        e.nodir && (n = n.filter((function(t) {
            var n = !/\/$/.test(t), r = e.cache[t] || e.cache[Sr(e, t)];
            return n && r && (n = "DIR" !== r && !Array.isArray(r)), n;
        })));
    }
    e.ignore.length && (n = n.filter((function(t) {
        return !xr(e, t);
    })));
    e.found = n;
}, br = function(e, t) {
    var n = Sr(e, t), r = e.cache[n], i = t;
    if (r) {
        var o = "DIR" === r || Array.isArray(r), a = "/" === t.slice(-1);
        if (o && !a ? i += "/" : !o && a && (i = i.slice(0, -1)), i !== t) {
            var s = Sr(e, i);
            e.statCache[s] = e.statCache[n], e.cache[s] = e.cache[n];
        }
    }
    return i;
}
// lotta situps...
, gr = xr, _r = function(e, t) {
    return !!e.ignore.length && e.ignore.some((function(e) {
        return !(!e.gmatcher || !e.gmatcher.match(t));
    }));
};

function mr(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
}

var yr = Vn.Minimatch;

function wr(e, t) {
    return e.toLowerCase().localeCompare(t.toLowerCase());
}

function Er(e, t) {
    return e.localeCompare(t);
}

function kr(e) {
    var t = null;
    if ("/**" === e.slice(-3)) {
        var n = e.replace(/(\/\*\*)+$/, "");
        t = new yr(n, {
            dot: !0
        });
    }
    return {
        matcher: new yr(e, {
            dot: !0
        }),
        gmatcher: t
    };
}

function Sr(e, t) {
    var n = t;
    return n = "/" === t.charAt(0) ? r.join(e.root, t) : sr(t) || "" === t ? t : e.changedCwd ? r.resolve(e.cwd, t) : r.resolve(t), 
    "win32" === process.platform && (n = n.replace(/\\/g, "/")), n;
}

// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function xr(e, t) {
    return !!e.ignore.length && e.ignore.some((function(e) {
        return e.matcher.match(t) || !(!e.gmatcher || !e.gmatcher.match(t));
    }));
}

var jr = {
    alphasort: cr,
    alphasorti: hr,
    setopts: dr,
    ownProp: fr,
    makeAbs: pr,
    finish: vr,
    mark: br,
    isIgnored: gr,
    childrenIgnored: _r
}, Tr = Mr;

Mr.GlobSync = Nr;

var Or = jr.setopts, Ar = jr.ownProp, Rr = jr.childrenIgnored, Cr = jr.isIgnored;

function Mr(e, t) {
    if ("function" == typeof t || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
    return new Nr(e, t).found;
}

function Nr(e, t) {
    if (!e) throw new Error("must provide pattern");
    if ("function" == typeof t || 3 === arguments.length) throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
    if (!(this instanceof Nr)) return new Nr(e, t);
    if (Or(this, e, t), this.noprocess) return this;
    var n = this.minimatch.set.length;
    this.matches = new Array(n);
    for (var r = 0; r < n; r++) this._process(this.minimatch.set[r], r, !1);
    this._finish();
}

Nr.prototype._finish = function() {
    if (h(this instanceof Nr), this.realpath) {
        var e = this;
        this.matches.forEach((function(t, n) {
            var r = e.matches[n] = Object.create(null);
            for (var i in t) try {
                i = e._makeAbs(i), r[kn.realpathSync(i, e.realpathCache)] = !0;
            } catch (t) {
                if ("stat" !== t.syscall) throw t;
                r[e._makeAbs(i)] = !0;
            }
        }));
    }
    jr.finish(this);
}, Nr.prototype._process = function(e, t, n) {
    h(this instanceof Nr);
    for (
    // Get the first [n] parts of pattern that are all strings.
    var r, i = 0; "string" == typeof e[i]; ) i++;
    // now n is the index of the first one that is *not* a string.
    // See if there's anything else
        switch (i) {
      // if not, then this is rather simple
        case e.length:
        return void this._processSimple(e.join("/"), t);

      case 0:
        // pattern *starts* with some non-trivial item.
        // going to readdir(cwd), but not include the prefix in matches.
        r = null;
        break;

      default:
        // pattern has some string bits in the front.
        // whatever it starts with, whether that's 'absolute' like /foo/bar,
        // or 'relative' like '../baz'
        r = e.slice(0, i).join("/");
    }
    var o, a = e.slice(i);
    // get the list of entries.
        null === r ? o = "." : sr(r) || sr(e.join("/")) ? (r && sr(r) || (r = "/" + r), 
    o = r) : o = r;
    var s = this._makeAbs(o);
    //if ignored, skip processing
        Rr(this, o) || (a[0] === Vn.GLOBSTAR ? this._processGlobStar(r, o, s, a, t, n) : this._processReaddir(r, o, s, a, t, n));
}, Nr.prototype._processReaddir = function(e, t, n, i, o, a) {
    var s = this._readdir(n, a);
    // if the abs isn't a dir, then nothing can match!
        if (s) {
        for (
        // It will only match dot entries if it starts with a dot, or if
        // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
        var l = i[0], u = !!this.minimatch.negate, c = l._glob, h = this.dot || "." === c.charAt(0), d = [], f = 0; f < s.length; f++) {
            if ("." !== (b = s[f]).charAt(0) || h) (u && !e ? !b.match(l) : b.match(l)) && d.push(b);
        }
        var p = d.length;
        // If there are no matched entries, then nothing matches.
                if (0 !== p) 
        // if this is the last remaining pattern bit, then no need for
        // an additional stat *unless* the user has specified mark or
        // stat explicitly.  We know they exist, since readdir returned
        // them.
        if (1 !== i.length || this.mark || this.stat) {
            // now test all matched entries as stand-ins for that part
            // of the pattern.
            i.shift();
            for (f = 0; f < p; f++) {
                var v;
                b = d[f];
                v = e ? [ e, b ] : [ b ], this._process(v.concat(i), o, a);
            }
        } else {
            this.matches[o] || (this.matches[o] = Object.create(null));
            for (var f = 0; f < p; f++) {
                var b = d[f];
                e && (b = "/" !== e.slice(-1) ? e + "/" + b : e + b), "/" !== b.charAt(0) || this.nomount || (b = r.join(this.root, b)), 
                this._emitMatch(o, b);
            }
            // This was the last one, and no stats were needed
                }
    }
}, Nr.prototype._emitMatch = function(e, t) {
    if (!Cr(this, t)) {
        var n = this._makeAbs(t);
        if (this.mark && (t = this._mark(t)), this.absolute && (t = n), !this.matches[e][t]) {
            if (this.nodir) {
                var r = this.cache[n];
                if ("DIR" === r || Array.isArray(r)) return;
            }
            this.matches[e][t] = !0, this.stat && this._stat(t);
        }
    }
}, Nr.prototype._readdirInGlobStar = function(e) {
    // follow all symlinked directories forever
    // just proceed as if this is a non-globstar situation
    if (this.follow) return this._readdir(e, !1);
    var t, r;
    try {
        r = n.lstatSync(e);
    } catch (e) {
        if ("ENOENT" === e.code) 
        // lstat failed, doesn't exist
        return null;
    }
    var i = r && r.isSymbolicLink();
    return this.symlinks[e] = i, 
    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    i || !r || r.isDirectory() ? t = this._readdir(e, !1) : this.cache[e] = "FILE", 
    t;
}, Nr.prototype._readdir = function(e, t) {
    if (t && !Ar(this.symlinks, e)) return this._readdirInGlobStar(e);
    if (Ar(this.cache, e)) {
        var r = this.cache[e];
        if (!r || "FILE" === r) return null;
        if (Array.isArray(r)) return r;
    }
    try {
        return this._readdirEntries(e, n.readdirSync(e));
    } catch (t) {
        return this._readdirError(e, t), null;
    }
}, Nr.prototype._readdirEntries = function(e, t) {
    // if we haven't asked to stat everything, then just
    // assume that everything in there exists, so we can avoid
    // having to stat it a second time.
    if (!this.mark && !this.stat) for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r = "/" === e ? e + r : e + "/" + r, this.cache[r] = !0;
    }
    // mark and cache dir-ness
    return this.cache[e] = t, t;
}, Nr.prototype._readdirError = function(e, t) {
    // handle errors, and cache the information
    switch (t.code) {
      case "ENOTSUP":
 // https://github.com/isaacs/node-glob/issues/205
              case "ENOTDIR":
        // totally normal. means it *does* exist.
        var n = this._makeAbs(e);
        if (this.cache[n] = "FILE", n === this.cwdAbs) {
            var r = new Error(t.code + " invalid cwd " + this.cwd);
            throw r.path = this.cwd, r.code = t.code, r;
        }
        break;

      case "ENOENT":
 // not terribly unusual
              case "ELOOP":
      case "ENAMETOOLONG":
      case "UNKNOWN":
        this.cache[this._makeAbs(e)] = !1;
        break;

      default:
        if (// some unusual error.  Treat as failure.
        this.cache[this._makeAbs(e)] = !1, this.strict) throw t;
        this.silent || console.error("glob error", t);
    }
}, Nr.prototype._processGlobStar = function(e, t, n, r, i, o) {
    var a = this._readdir(n, o);
    // no entries means not a dir, so it can never have matches
    // foo.txt/** doesn't match foo.txt
        if (a) {
        // test without the globstar, and with every child both below
        // and replacing the globstar.
        var s = r.slice(1), l = e ? [ e ] : [], u = l.concat(s);
        // the noGlobStar pattern exits the inGlobStar state
        this._process(u, i, !1);
        var c = a.length;
        // If it's a symlink, and we're in a globstar, then stop
        if (!this.symlinks[n] || !o) for (var h = 0; h < c; h++) {
            if ("." !== a[h].charAt(0) || this.dot) {
                // these two cases enter the inGlobStar state
                var d = l.concat(a[h], s);
                this._process(d, i, !0);
                var f = l.concat(a[h], r);
                this._process(f, i, !0);
            }
        }
    }
}, Nr.prototype._processSimple = function(e, t) {
    // XXX review this.  Shouldn't it be doing the mounting etc
    // before doing stat?  kinda weird?
    var n = this._stat(e);
    // If it doesn't exist, then just mark the lack of results
    if (this.matches[t] || (this.matches[t] = Object.create(null)), n) {
        if (e && sr(e) && !this.nomount) {
            var i = /[\/\\]$/.test(e);
            "/" === e.charAt(0) ? e = r.join(this.root, e) : (e = r.resolve(this.root, e), i && (e += "/"));
        }
        "win32" === process.platform && (e = e.replace(/\\/g, "/")), 
        // Mark this as a match
        this._emitMatch(t, e);
    }
}, 
// Returns either 'DIR', 'FILE', or false
Nr.prototype._stat = function(e) {
    var t = this._makeAbs(e), r = "/" === e.slice(-1);
    if (e.length > this.maxLength) return !1;
    if (!this.stat && Ar(this.cache, t)) {
        var i = this.cache[t];
        // It exists, but maybe not how we need it
        if (Array.isArray(i) && (i = "DIR"), !r || "DIR" === i) return i;
        if (r && "FILE" === i) return !1;
        // otherwise we have to stat, because maybe c=true
        // if we know it exists, but not what it is.
        }
    var o = this.statCache[t];
    if (!o) {
        var a;
        try {
            a = n.lstatSync(t);
        } catch (e) {
            if (e && ("ENOENT" === e.code || "ENOTDIR" === e.code)) return this.statCache[t] = !1, 
            !1;
        }
        if (a && a.isSymbolicLink()) try {
            o = n.statSync(t);
        } catch (e) {
            o = a;
        } else o = a;
    }
    this.statCache[t] = o;
    i = !0;
    return o && (i = o.isDirectory() ? "DIR" : "FILE"), this.cache[t] = this.cache[t] || i, 
    (!r || "FILE" !== i) && i;
}, Nr.prototype._mark = function(e) {
    return jr.mark(this, e);
}, Nr.prototype._makeAbs = function(e) {
    return jr.makeAbs(this, e);
};

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var Ir = function e(t, n) {
    if (t && n) return e(t)(n);
    if ("function" != typeof t) throw new TypeError("need wrapper function");
    return Object.keys(t).forEach((function(e) {
        r[e] = t[e];
    })), r;
    function r() {
        for (var e = new Array(arguments.length), n = 0; n < e.length; n++) e[n] = arguments[n];
        var r = t.apply(this, e), i = e[e.length - 1];
        return "function" == typeof r && r !== i && Object.keys(i).forEach((function(e) {
            r[e] = i[e];
        })), r;
    }
};

var Lr = Ir(Dr), Pr = Ir(Br);

function Dr(e) {
    var t = function() {
        return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
    };
    return t.called = !1, t;
}

function Br(e) {
    var t = function() {
        if (t.called) throw new Error(t.onceError);
        return t.called = !0, t.value = e.apply(this, arguments);
    }, n = e.name || "Function wrapped with `once`";
    return t.onceError = n + " shouldn't be called more than once", t.called = !1, t;
}

Dr.proto = Dr((function() {
    Object.defineProperty(Function.prototype, "once", {
        value: function() {
            return Dr(this);
        },
        configurable: !0
    }), Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
            return Br(this);
        },
        configurable: !0
    });
})), Lr.strict = Pr;

var Ur = Object.create(null), $r = Ir((function(e, t) {
    return Ur[e] ? (Ur[e].push(t), null) : (Ur[e] = [ t ], function(e) {
        return Lr((function t() {
            var n = Ur[e], r = n.length, i = Gr(arguments);
            // XXX It's somewhat ambiguous whether a new callback added in this
            // pass should be queued for later execution if something in the
            // list of callbacks throws, or if it should just be discarded.
            // However, it's such an edge case that it hardly matters, and either
            // choice is likely as surprising as the other.
            // As it happens, we do go ahead and schedule it for later execution.
            try {
                for (var o = 0; o < r; o++) n[o].apply(null, i);
            } finally {
                n.length > r ? (
                // added more in the interim.
                // de-zalgo, just in case, but don't call again.
                n.splice(0, r), process.nextTick((function() {
                    t.apply(null, i);
                }))) : delete Ur[e];
            }
        }));
    }(e));
}));

function Gr(e) {
    for (var t = e.length, n = [], r = 0; r < t; r++) n[r] = e[r];
    return n;
}

// Approach:

// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them

// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.

// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END

// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)

//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])

// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.
var qr = Vr, Wr = u.EventEmitter, Fr = jr.setopts, Hr = jr.ownProp, zr = jr.childrenIgnored, Yr = jr.isIgnored;

function Vr(e, t, n) {
    if ("function" == typeof t && (n = t, t = {}), t || (t = {}), t.sync) {
        if (n) throw new TypeError("callback provided to sync glob");
        return Tr(e, t);
    }
    return new Zr(e, t, n);
}

Vr.sync = Tr;

var Jr = Vr.GlobSync = Tr.GlobSync;

// old api surface
function Zr(e, t, n) {
    if ("function" == typeof t && (n = t, t = null), t && t.sync) {
        if (n) throw new TypeError("callback provided to sync glob");
        return new Jr(e, t);
    }
    if (!(this instanceof Zr)) return new Zr(e, t, n);
    Fr(this, e, t), this._didRealPath = !1;
    // process each pattern in the minimatch set
    var r = this.minimatch.set.length;
    // The matches are stored as {<filename>: true,...} so that
    // duplicates are automagically pruned.
    // Later, we do an Object.keys() on these.
    // Keep them as a list so we can fill in when nonull is set.
        this.matches = new Array(r), "function" == typeof n && (n = Lr(n), this.on("error", n), 
    this.on("end", (function(e) {
        n(null, e);
    })));
    var i = this;
    if (this._processing = 0, this._emitQueue = [], this._processQueue = [], this.paused = !1, 
    this.noprocess) return this;
    if (0 === r) return a();
    for (var o = 0; o < r; o++) this._process(this.minimatch.set[o], o, !1, a);
    function a() {
        --i._processing, i._processing <= 0 && i._finish();
    }
}

Vr.glob = Vr, Vr.hasMagic = function(e, t) {
    var n = function(e, t) {
        if (null === t || "object" != typeof t) return e;
        for (var n = Object.keys(t), r = n.length; r--; ) e[n[r]] = t[n[r]];
        return e;
    }({}, t);
    n.noprocess = !0;
    var r = new Zr(e, n).minimatch.set;
    if (!e) return !1;
    if (r.length > 1) return !0;
    for (var i = 0; i < r[0].length; i++) if ("string" != typeof r[0][i]) return !0;
    return !1;
}, Vr.Glob = Zr, I(Zr, Wr), Zr.prototype._finish = function() {
    if (h(this instanceof Zr), !this.aborted) {
        if (this.realpath && !this._didRealpath) return this._realpath();
        jr.finish(this), this.emit("end", this.found);
    }
}, Zr.prototype._realpath = function() {
    if (!this._didRealpath) {
        this._didRealpath = !0;
        var e = this.matches.length;
        if (0 === e) return this._finish();
        for (var t = this, n = 0; n < this.matches.length; n++) this._realpathSet(n, r);
    }
    function r() {
        0 == --e && t._finish();
    }
}, Zr.prototype._realpathSet = function(e, t) {
    var n = this.matches[e];
    if (!n) return t();
    var r = Object.keys(n), i = this, o = r.length;
    if (0 === o) return t();
    var a = this.matches[e] = Object.create(null);
    r.forEach((function(n, r) {
        // If there's a problem with the stat, then it means that
        // one or more of the links in the realpath couldn't be
        // resolved.  just return the abs value in that case.
        n = i._makeAbs(n), kn.realpath(n, i.realpathCache, (function(r, s) {
            r ? "stat" === r.syscall ? a[n] = !0 : i.emit("error", r) : a[s] = !0, // srsly wtf right here
            0 == --o && (i.matches[e] = a, t());
        }));
    }));
}, Zr.prototype._mark = function(e) {
    return jr.mark(this, e);
}, Zr.prototype._makeAbs = function(e) {
    return jr.makeAbs(this, e);
}, Zr.prototype.abort = function() {
    this.aborted = !0, this.emit("abort");
}, Zr.prototype.pause = function() {
    this.paused || (this.paused = !0, this.emit("pause"));
}, Zr.prototype.resume = function() {
    if (this.paused) {
        if (this.emit("resume"), this.paused = !1, this._emitQueue.length) {
            var e = this._emitQueue.slice(0);
            this._emitQueue.length = 0;
            for (var t = 0; t < e.length; t++) {
                var n = e[t];
                this._emitMatch(n[0], n[1]);
            }
        }
        if (this._processQueue.length) {
            var r = this._processQueue.slice(0);
            this._processQueue.length = 0;
            for (t = 0; t < r.length; t++) {
                var i = r[t];
                this._processing--, this._process(i[0], i[1], i[2], i[3]);
            }
        }
    }
}, Zr.prototype._process = function(e, t, n, r) {
    if (h(this instanceof Zr), h("function" == typeof r), !this.aborted) if (this._processing++, 
    this.paused) this._processQueue.push([ e, t, n, r ]); else {
        for (
        //console.error('PROCESS %d', this._processing, pattern)
        // Get the first [n] parts of pattern that are all strings.
        var i, o = 0; "string" == typeof e[o]; ) o++;
        // now n is the index of the first one that is *not* a string.
        // see if there's anything else
                switch (o) {
          // if not, then this is rather simple
            case e.length:
            return void this._processSimple(e.join("/"), t, r);

          case 0:
            // pattern *starts* with some non-trivial item.
            // going to readdir(cwd), but not include the prefix in matches.
            i = null;
            break;

          default:
            // pattern has some string bits in the front.
            // whatever it starts with, whether that's 'absolute' like /foo/bar,
            // or 'relative' like '../baz'
            i = e.slice(0, o).join("/");
        }
        var a, s = e.slice(o);
        // get the list of entries.
                null === i ? a = "." : sr(i) || sr(e.join("/")) ? (i && sr(i) || (i = "/" + i), 
        a = i) : a = i;
        var l = this._makeAbs(a);
        //if ignored, skip _processing
                if (zr(this, a)) return r();
        s[0] === Vn.GLOBSTAR ? this._processGlobStar(i, a, l, s, t, n, r) : this._processReaddir(i, a, l, s, t, n, r);
    }
}, Zr.prototype._processReaddir = function(e, t, n, r, i, o, a) {
    var s = this;
    this._readdir(n, o, (function(l, u) {
        return s._processReaddir2(e, t, n, r, i, o, u, a);
    }));
}, Zr.prototype._processReaddir2 = function(e, t, n, i, o, a, s, l) {
    // if the abs isn't a dir, then nothing can match!
    if (!s) return l();
    // It will only match dot entries if it starts with a dot, or if
    // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
        for (var u = i[0], c = !!this.minimatch.negate, h = u._glob, d = this.dot || "." === h.charAt(0), f = [], p = 0; p < s.length; p++) {
        if ("." !== (b = s[p]).charAt(0) || d) (c && !e ? !b.match(u) : b.match(u)) && f.push(b);
    }
    //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)
        var v = f.length;
    // If there are no matched entries, then nothing matches.
        if (0 === v) return l();
    // if this is the last remaining pattern bit, then no need for
    // an additional stat *unless* the user has specified mark or
    // stat explicitly.  We know they exist, since readdir returned
    // them.
        if (1 === i.length && !this.mark && !this.stat) {
        this.matches[o] || (this.matches[o] = Object.create(null));
        for (p = 0; p < v; p++) {
            var b = f[p];
            e && (b = "/" !== e ? e + "/" + b : e + b), "/" !== b.charAt(0) || this.nomount || (b = r.join(this.root, b)), 
            this._emitMatch(o, b);
        }
        // This was the last one, and no stats were needed
                return l();
    }
    // now test all matched entries as stand-ins for that part
    // of the pattern.
        i.shift();
    for (p = 0; p < v; p++) {
        b = f[p];
        e && (b = "/" !== e ? e + "/" + b : e + b), this._process([ b ].concat(i), o, a, l);
    }
    l();
}, Zr.prototype._emitMatch = function(e, t) {
    if (!this.aborted && !Yr(this, t)) if (this.paused) this._emitQueue.push([ e, t ]); else {
        var n = sr(t) ? t : this._makeAbs(t);
        if (this.mark && (t = this._mark(t)), this.absolute && (t = n), !this.matches[e][t]) {
            if (this.nodir) {
                var r = this.cache[n];
                if ("DIR" === r || Array.isArray(r)) return;
            }
            this.matches[e][t] = !0;
            var i = this.statCache[n];
            i && this.emit("stat", t, i), this.emit("match", t);
        }
    }
}, Zr.prototype._readdirInGlobStar = function(e, t) {
    if (!this.aborted) {
        // follow all symlinked directories forever
        // just proceed as if this is a non-globstar situation
        if (this.follow) return this._readdir(e, !1, t);
        var r = this, i = $r("lstat\0" + e, (function(n, i) {
            if (n && "ENOENT" === n.code) return t();
            var o = i && i.isSymbolicLink();
            // If it's not a symlink or a dir, then it's definitely a regular file.
            // don't bother doing a readdir in that case.
            r.symlinks[e] = o, o || !i || i.isDirectory() ? r._readdir(e, !1, t) : (r.cache[e] = "FILE", 
            t());
        }));
        i && n.lstat(e, i);
    }
}, Zr.prototype._readdir = function(e, t, r) {
    if (!this.aborted && (r = $r("readdir\0" + e + "\0" + t, r))) {
        //console.error('RD %j %j', +inGlobStar, abs)
        if (t && !Hr(this.symlinks, e)) return this._readdirInGlobStar(e, r);
        if (Hr(this.cache, e)) {
            var i = this.cache[e];
            if (!i || "FILE" === i) return r();
            if (Array.isArray(i)) return r(null, i);
        }
        n.readdir(e, function(e, t, n) {
            return function(r, i) {
                r ? e._readdirError(t, r, n) : e._readdirEntries(t, i, n);
            };
        }(this, e, r));
    }
}, Zr.prototype._readdirEntries = function(e, t, n) {
    if (!this.aborted) {
        // if we haven't asked to stat everything, then just
        // assume that everything in there exists, so we can avoid
        // having to stat it a second time.
        if (!this.mark && !this.stat) for (var r = 0; r < t.length; r++) {
            var i = t[r];
            i = "/" === e ? e + i : e + "/" + i, this.cache[i] = !0;
        }
        return this.cache[e] = t, n(null, t);
    }
}, Zr.prototype._readdirError = function(e, t, n) {
    if (!this.aborted) {
        // handle errors, and cache the information
        switch (t.code) {
          case "ENOTSUP":
 // https://github.com/isaacs/node-glob/issues/205
                      case "ENOTDIR":
            // totally normal. means it *does* exist.
            var r = this._makeAbs(e);
            if (this.cache[r] = "FILE", r === this.cwdAbs) {
                var i = new Error(t.code + " invalid cwd " + this.cwd);
                i.path = this.cwd, i.code = t.code, this.emit("error", i), this.abort();
            }
            break;

          case "ENOENT":
 // not terribly unusual
                      case "ELOOP":
          case "ENAMETOOLONG":
          case "UNKNOWN":
            this.cache[this._makeAbs(e)] = !1;
            break;

          default:
            // some unusual error.  Treat as failure.
            this.cache[this._makeAbs(e)] = !1, this.strict && (this.emit("error", t), 
            // If the error is handled, then we abort
            // if not, we threw out of here
            this.abort()), this.silent || console.error("glob error", t);
        }
        return n();
    }
}, Zr.prototype._processGlobStar = function(e, t, n, r, i, o, a) {
    var s = this;
    this._readdir(n, o, (function(l, u) {
        s._processGlobStar2(e, t, n, r, i, o, u, a);
    }));
}, Zr.prototype._processGlobStar2 = function(e, t, n, r, i, o, a, s) {
    //console.error('pgs2', prefix, remain[0], entries)
    // no entries means not a dir, so it can never have matches
    // foo.txt/** doesn't match foo.txt
    if (!a) return s();
    // test without the globstar, and with every child both below
    // and replacing the globstar.
        var l = r.slice(1), u = e ? [ e ] : [], c = u.concat(l);
    // the noGlobStar pattern exits the inGlobStar state
    this._process(c, i, !1, s);
    var h = this.symlinks[n], d = a.length;
    // If it's a symlink, and we're in a globstar, then stop
    if (h && o) return s();
    for (var f = 0; f < d; f++) {
        if ("." !== a[f].charAt(0) || this.dot) {
            // these two cases enter the inGlobStar state
            var p = u.concat(a[f], l);
            this._process(p, i, !0, s);
            var v = u.concat(a[f], r);
            this._process(v, i, !0, s);
        }
    }
    s();
}, Zr.prototype._processSimple = function(e, t, n) {
    // XXX review this.  Shouldn't it be doing the mounting etc
    // before doing stat?  kinda weird?
    var r = this;
    this._stat(e, (function(i, o) {
        r._processSimple2(e, t, i, o, n);
    }));
}, Zr.prototype._processSimple2 = function(e, t, n, i, o) {
    // If it doesn't exist, then just mark the lack of results
    if (
    //console.error('ps2', prefix, exists)
    this.matches[t] || (this.matches[t] = Object.create(null)), !i) return o();
    if (e && sr(e) && !this.nomount) {
        var a = /[\/\\]$/.test(e);
        "/" === e.charAt(0) ? e = r.join(this.root, e) : (e = r.resolve(this.root, e), a && (e += "/"));
    }
    "win32" === process.platform && (e = e.replace(/\\/g, "/")), 
    // Mark this as a match
    this._emitMatch(t, e), o();
}, 
// Returns either 'DIR', 'FILE', or false
Zr.prototype._stat = function(e, t) {
    var r = this._makeAbs(e), i = "/" === e.slice(-1);
    if (e.length > this.maxLength) return t();
    if (!this.stat && Hr(this.cache, r)) {
        var o = this.cache[r];
        // It exists, but maybe not how we need it
        if (Array.isArray(o) && (o = "DIR"), !i || "DIR" === o) return t(null, o);
        if (i && "FILE" === o) return t();
        // otherwise we have to stat, because maybe c=true
        // if we know it exists, but not what it is.
        }
    var a = this.statCache[r];
    if (void 0 !== a) {
        if (!1 === a) return t(null, a);
        var s = a.isDirectory() ? "DIR" : "FILE";
        return i && "FILE" === s ? t() : t(null, s, a);
    }
    var l = this, u = $r("stat\0" + r, (function(i, o) {
        if (o && o.isSymbolicLink()) 
        // If it's a symlink, then treat it as the target, unless
        // the target does not exist, then treat it as a file.
        return n.stat(r, (function(n, i) {
            n ? l._stat2(e, r, null, o, t) : l._stat2(e, r, n, i, t);
        }));
        l._stat2(e, r, i, o, t);
    }));
    u && n.lstat(r, u);
}, Zr.prototype._stat2 = function(e, t, n, r, i) {
    if (n && ("ENOENT" === n.code || "ENOTDIR" === n.code)) return this.statCache[t] = !1, 
    i();
    var o = "/" === e.slice(-1);
    if (this.statCache[t] = r, "/" === t.slice(-1) && r && !r.isDirectory()) return i(null, !1, r);
    var a = !0;
    return r && (a = r.isDirectory() ? "DIR" : "FILE"), this.cache[t] = this.cache[t] || a, 
    o && "FILE" === a ? i() : i(null, a, r);
};

var Qr = ii;

ii.sync = ui;

var Xr = void 0;

try {
    Xr = qr;
} catch (e) {
    // treat glob as optional.
}

var Kr = parseInt("666", 8), ei = {
    nosort: !0,
    silent: !0
}, ti = 0, ni = "win32" === process.platform;

function ri(e) {
    if ([ "unlink", "chmod", "stat", "lstat", "rmdir", "readdir" ].forEach((function(t) {
        e[t] = e[t] || n[t], e[t += "Sync"] = e[t] || n[t];
    })), e.maxBusyTries = e.maxBusyTries || 3, e.emfileWait = e.emfileWait || 1e3, !1 === e.glob && (e.disableGlob = !0), 
    !0 !== e.disableGlob && void 0 === Xr) throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
    e.disableGlob = e.disableGlob || !1, e.glob = e.glob || ei;
}

function ii(e, t, n) {
    "function" == typeof t && (n = t, t = {}), h(e, "rimraf: missing path"), h.equal(typeof e, "string", "rimraf: path should be a string"), 
    h.equal(typeof n, "function", "rimraf: callback function required"), h(t, "rimraf: invalid options argument provided"), 
    h.equal(typeof t, "object", "rimraf: options should be object"), ri(t);
    var r = 0, i = null, o = 0;
    if (t.disableGlob || !Xr.hasMagic(e)) return a(null, [ e ]);
    function a(e, a) {
        return e ? n(e) : 0 === (o = a.length) ? n() : void a.forEach((function(e) {
            oi(e, t, (function a(s) {
                if (s) {
                    if (("EBUSY" === s.code || "ENOTEMPTY" === s.code || "EPERM" === s.code) && r < t.maxBusyTries) 
                    // try again, with the same exact callback as this one.
                    return r++, setTimeout((function() {
                        oi(e, t, a);
                    }), 100 * r);
                    // this one won't happen if graceful-fs is used.
                                        if ("EMFILE" === s.code && ti < t.emfileWait) return setTimeout((function() {
                        oi(e, t, a);
                    }), ti++);
                    // already gone
                                        "ENOENT" === s.code && (s = null);
                }
                ti = 0, function(e) {
                    i = i || e, 0 == --o && n(i);
                }(s);
            }));
        }));
    }
    t.lstat(e, (function(n, r) {
        if (!n) return a(null, [ e ]);
        Xr(e, t.glob, a);
    }));
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR

// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.

// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function oi(e, t, n) {
    h(e), h(t), h("function" == typeof n), 
    // sunos lets the root user unlink directories, which is... weird.
    // so we have to lstat here and make sure it's not a dir.
    t.lstat(e, (function(r, i) {
        return r && "ENOENT" === r.code ? n(null) : (
        // Windows can EPERM on stat.  Life is suffering.
        r && "EPERM" === r.code && ni && ai(e, t, r, n), i && i.isDirectory() ? li(e, t, r, n) : void t.unlink(e, (function(r) {
            if (r) {
                if ("ENOENT" === r.code) return n(null);
                if ("EPERM" === r.code) return ni ? ai(e, t, r, n) : li(e, t, r, n);
                if ("EISDIR" === r.code) return li(e, t, r, n);
            }
            return n(r);
        })));
    }));
}

function ai(e, t, n, r) {
    h(e), h(t), h("function" == typeof r), n && h(n instanceof Error), t.chmod(e, Kr, (function(i) {
        i ? r("ENOENT" === i.code ? null : n) : t.stat(e, (function(i, o) {
            i ? r("ENOENT" === i.code ? null : n) : o.isDirectory() ? li(e, t, n, r) : t.unlink(e, r);
        }));
    }));
}

function si(e, t, n) {
    h(e), h(t), n && h(n instanceof Error);
    try {
        t.chmodSync(e, Kr);
    } catch (e) {
        if ("ENOENT" === e.code) return;
        throw n;
    }
    try {
        var r = t.statSync(e);
    } catch (e) {
        if ("ENOENT" === e.code) return;
        throw n;
    }
    r.isDirectory() ? ci(e, t, n) : t.unlinkSync(e);
}

function li(e, t, n, i) {
    h(e), h(t), n && h(n instanceof Error), h("function" == typeof i), 
    // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
    // if we guessed wrong, and it's not a directory, then
    // raise the original error.
    t.rmdir(e, (function(o) {
        !o || "ENOTEMPTY" !== o.code && "EEXIST" !== o.code && "EPERM" !== o.code ? o && "ENOTDIR" === o.code ? i(n) : i(o) : function(e, t, n) {
            h(e), h(t), h("function" == typeof n), t.readdir(e, (function(i, o) {
                if (i) return n(i);
                var a, s = o.length;
                if (0 === s) return t.rmdir(e, n);
                o.forEach((function(i) {
                    ii(r.join(e, i), t, (function(r) {
                        if (!a) return r ? n(a = r) : void (0 == --s && t.rmdir(e, n));
                    }));
                }));
            }));
        }
        // this looks simpler, and is strictly *faster*, but will
        // tie up the JavaScript thread and fail on excessively
        // deep directory trees.
        (e, t, i);
    }));
}

function ui(e, t) {
    var n;
    if (ri(t = t || {}), h(e, "rimraf: missing path"), h.equal(typeof e, "string", "rimraf: path should be a string"), 
    h(t, "rimraf: missing options"), h.equal(typeof t, "object", "rimraf: options should be object"), 
    t.disableGlob || !Xr.hasMagic(e)) n = [ e ]; else try {
        t.lstatSync(e), n = [ e ];
    } catch (r) {
        n = Xr.sync(e, t.glob);
    }
    if (n.length) for (var r = 0; r < n.length; r++) {
        e = n[r];
        try {
            var i = t.lstatSync(e);
        } catch (n) {
            if ("ENOENT" === n.code) return;
            // Windows can EPERM on stat.  Life is suffering.
                        "EPERM" === n.code && ni && si(e, t, n);
        }
        try {
            // sunos lets the root user unlink directories, which is... weird.
            i && i.isDirectory() ? ci(e, t, null) : t.unlinkSync(e);
        } catch (n) {
            if ("ENOENT" === n.code) return;
            if ("EPERM" === n.code) return ni ? si(e, t, n) : ci(e, t, n);
            if ("EISDIR" !== n.code) throw n;
            ci(e, t, n);
        }
    }
}

function ci(e, t, n) {
    h(e), h(t), n && h(n instanceof Error);
    try {
        t.rmdirSync(e);
    } catch (i) {
        if ("ENOENT" === i.code) return;
        if ("ENOTDIR" === i.code) throw n;
        "ENOTEMPTY" !== i.code && "EEXIST" !== i.code && "EPERM" !== i.code || function(e, t) {
            h(e), h(t), t.readdirSync(e).forEach((function(n) {
                ui(r.join(e, n), t);
            }));
            // We only end up here once we got ENOTEMPTY at least once, and
            // at this point, we are guaranteed to have removed all the kids.
            // So, we know that it won't be ENOENT or ENOTDIR or anything else.
            // try really hard to delete stuff on windows, because it has a
            // PROFOUNDLY annoying habit of not closing handles promptly when
            // files are deleted, resulting in spurious ENOTEMPTY errors.
            var n = ni ? 100 : 1, i = 0;
            for (;;) {
                var o = !0;
                try {
                    var a = t.rmdirSync(e, t);
                    return o = !1, a;
                } finally {
                    if (++i < n && o) continue;
                }
            }
        }(e, t);
    }
}

var hi = v((function(e, t) {
    e.exports = t;
    var r = process.version.substr(1).replace(/-.*$/, "").split(".").map((function(e) {
        return +e;
    })), i = [ "build", "clean", "configure", "package", "publish", "reveal", "testbinary", "testpackage", "unpublish" ];
    function o(e) {
        return e && (-1 !== e.indexOf("{napi_build_version}") || -1 !== e.indexOf("{node_napi_label}"));
    }
    e.exports.get_napi_version = function(e) {
        // target may be undefined
        // returns the non-zero numeric napi version or undefined if napi is not supported.
        // correctly supporting target requires an updated cross-walk
        var t = process.versions.napi;
 // can be undefined
                return t || (// this code should never need to be updated
        9 === r[0] && r[1] >= 3 ? t = 2 : 8 === r[0] && (t = 1)), t;
    }, e.exports.get_napi_version_as_string = function(t) {
        // returns the napi version as a string or an empty string if napi is not supported.
        var n = e.exports.get_napi_version(t);
        return n ? "" + n : "";
    }, e.exports.validate_package_json = function(t, n) {
        // throws Error
        var r = t.binary, i = o(r.module_path), a = o(r.remote_path), s = o(r.package_name), l = e.exports.get_napi_build_versions(t, n, !0), u = e.exports.get_napi_build_versions_raw(t);
        if (l && l.forEach((function(e) {
            if (!(parseInt(e, 10) === e && e > 0)) throw new Error("All values specified in napi_versions must be positive integers.");
        })), l && (!i || !a && !s)) throw new Error("When napi_versions is specified; module_path and either remote_path or package_name must contain the substitution string '{napi_build_version}`.");
        if ((i || a || s) && !u) throw new Error("When the substitution string '{napi_build_version}` is specified in module_path, remote_path, or package_name; napi_versions must also be specified.");
        if (l && !e.exports.get_best_napi_build_version(t, n) && e.exports.build_napi_only(t)) throw new Error("The N-API version of this Node instance is " + e.exports.get_napi_version(n ? n.target : void 0) + ". This module supports N-API version(s) " + e.exports.get_napi_build_versions_raw(t) + ". This Node instance cannot run this module.");
        if (u && !l && e.exports.build_napi_only(t)) throw new Error("The N-API version of this Node instance is " + e.exports.get_napi_version(n ? n.target : void 0) + ". This module supports N-API version(s) " + e.exports.get_napi_build_versions_raw(t) + ". This Node instance cannot run this module.");
    }, e.exports.expand_commands = function(t, n, r) {
        var o = [], a = e.exports.get_napi_build_versions(t, n);
        return r.forEach((function(r) {
            if (a && "install" === r.name) {
                var s = e.exports.get_best_napi_build_version(t, n), l = s ? [ "napi_build_version=" + s ] : [];
                o.push({
                    name: r.name,
                    args: l
                });
            } else a && -1 !== i.indexOf(r.name) ? a.forEach((function(e) {
                var t = r.args.slice();
                t.push("napi_build_version=" + e), o.push({
                    name: r.name,
                    args: t
                });
            })) : o.push(r);
        })), o;
    }, e.exports.get_napi_build_versions = function(t, n, r) {
        // opts may be undefined
        var i = vn, o = [], a = e.exports.get_napi_version(n ? n.target : void 0);
        if (
        // remove duplicates, verify each napi version can actaully be built
        t.binary && t.binary.napi_versions && t.binary.napi_versions.forEach((function(e) {
            var t = -1 !== o.indexOf(e);
            !t && a && e <= a ? o.push(e) : r && !t && a && i.info("This Node instance does not support builds for N-API version", e);
        })), n && n["build-latest-napi-version-only"]) {
            var s = 0;
            o.forEach((function(e) {
                e > s && (s = e);
            })), o = s ? [ s ] : [];
        }
        return o.length ? o : void 0;
    }, e.exports.get_napi_build_versions_raw = function(e) {
        var t = [];
        // remove duplicates
                return e.binary && e.binary.napi_versions && e.binary.napi_versions.forEach((function(e) {
            -1 === t.indexOf(e) && t.push(e);
        })), t.length ? t : void 0;
    }, e.exports.get_command_arg = function(e) {
        return "napi_build_version=" + e;
    }, e.exports.get_napi_build_version_from_command_args = function(e) {
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            if (0 === n.indexOf("napi_build_version=")) return parseInt(n.substr("napi_build_version=".length), 10);
        }
    }, e.exports.swap_build_dir_out = function(t) {
        t && (Qr.sync(e.exports.get_build_dir(t)), n.renameSync("build", e.exports.get_build_dir(t)));
    }, e.exports.swap_build_dir_in = function(t) {
        t && (Qr.sync("build"), n.renameSync(e.exports.get_build_dir(t), "build"));
    }, e.exports.get_build_dir = function(e) {
        return "build-tmp-napi-v" + e;
    }, e.exports.get_best_napi_build_version = function(t, n) {
        var r = 0, i = e.exports.get_napi_build_versions(t, n);
        if (i) {
            var o = e.exports.get_napi_version(n ? n.target : void 0);
            i.forEach((function(e) {
                e > r && e <= o && (r = e);
            }));
        }
        return 0 === r ? void 0 : r;
    }, e.exports.build_napi_only = function(e) {
        return e.binary && e.binary.package_name && -1 === e.binary.package_name.indexOf("{node_napi_label}");
    };
})), di = (hi.get_napi_version, hi.get_napi_version_as_string, hi.validate_package_json, 
hi.expand_commands, hi.get_napi_build_versions, hi.get_napi_build_versions_raw, 
hi.get_command_arg, hi.get_napi_build_version_from_command_args, hi.swap_build_dir_out, 
hi.swap_build_dir_in, hi.get_build_dir, hi.get_best_napi_build_version, hi.build_napi_only, 
v((function(e, t) {
    var n;
    /* istanbul ignore next */    t = e.exports = z, n = "object" == typeof process && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? function() {
        var e = Array.prototype.slice.call(arguments, 0);
        e.unshift("SEMVER"), console.log.apply(console, e);
    } : function() {}, 
    // Note: this is the semver.org version of the spec that it implements
    // Not necessarily the package version of this code.
    t.SEMVER_SPEC_VERSION = "2.0.0";
    var r = Number.MAX_SAFE_INTEGER || 
    /* istanbul ignore next */ 9007199254740991, i = t.re = [], o = t.src = [], a = 0, s = a++;
    o[s] = "0|[1-9]\\d*";
    var l = a++;
    o[l] = "[0-9]+";
    // ## Non-numeric Identifier
    // Zero or more digits, followed by a letter or hyphen, and then zero or
    // more letters, digits, or hyphens.
    var u = a++;
    o[u] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
    // ## Main Version
    // Three dot-separated numeric identifiers.
    var c = a++;
    o[c] = "(" + o[s] + ")\\.(" + o[s] + ")\\.(" + o[s] + ")";
    var h = a++;
    o[h] = "(" + o[l] + ")\\.(" + o[l] + ")\\.(" + o[l] + ")";
    // ## Pre-release Version Identifier
    // A numeric identifier, or a non-numeric identifier.
    var d = a++;
    o[d] = "(?:" + o[s] + "|" + o[u] + ")";
    var f = a++;
    o[f] = "(?:" + o[l] + "|" + o[u] + ")";
    // ## Pre-release Version
    // Hyphen, followed by one or more dot-separated pre-release version
    // identifiers.
    var p = a++;
    o[p] = "(?:-(" + o[d] + "(?:\\." + o[d] + ")*))";
    var v = a++;
    o[v] = "(?:-?(" + o[f] + "(?:\\." + o[f] + ")*))";
    // ## Build Metadata Identifier
    // Any combination of digits, letters, or hyphens.
    var b = a++;
    o[b] = "[0-9A-Za-z-]+";
    // ## Build Metadata
    // Plus sign, followed by one or more period-separated build metadata
    // identifiers.
    var g = a++;
    o[g] = "(?:\\+(" + o[b] + "(?:\\." + o[b] + ")*))";
    // ## Full Version String
    // A main version, followed optionally by a pre-release version and
    // build metadata.
    // Note that the only major, minor, patch, and pre-release sections of
    // the version string are capturing groups.  The build metadata is not a
    // capturing group, because it should not ever be used in version
    // comparison.
    var _ = a++, m = "v?" + o[c] + o[p] + "?" + o[g] + "?";
    o[_] = "^" + m + "$";
    // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
    // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
    // common in the npm registry.
    var y = "[v=\\s]*" + o[h] + o[v] + "?" + o[g] + "?", w = a++;
    o[w] = "^" + y + "$";
    var E = a++;
    o[E] = "((?:<|>)?=?)";
    // Something like "2.*" or "1.2.x".
    // Note that "x.x" is a valid xRange identifer, meaning "any version"
    // Only the first item is strictly required.
    var k = a++;
    o[k] = o[l] + "|x|X|\\*";
    var S = a++;
    o[S] = o[s] + "|x|X|\\*";
    var x = a++;
    o[x] = "[v=\\s]*(" + o[S] + ")(?:\\.(" + o[S] + ")(?:\\.(" + o[S] + ")(?:" + o[p] + ")?" + o[g] + "?)?)?";
    var j = a++;
    o[j] = "[v=\\s]*(" + o[k] + ")(?:\\.(" + o[k] + ")(?:\\.(" + o[k] + ")(?:" + o[v] + ")?" + o[g] + "?)?)?";
    var T = a++;
    o[T] = "^" + o[E] + "\\s*" + o[x] + "$";
    var O = a++;
    o[O] = "^" + o[E] + "\\s*" + o[j] + "$";
    // Coercion.
    // Extract anything that could conceivably be a part of a valid semver
    var A = a++;
    o[A] = "(?:^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])";
    // Tilde ranges.
    // Meaning is "reasonably at or greater than"
    var R = a++;
    o[R] = "(?:~>?)";
    var C = a++;
    o[C] = "(\\s*)" + o[R] + "\\s+", i[C] = new RegExp(o[C], "g");
    var M = a++;
    o[M] = "^" + o[R] + o[x] + "$";
    var N = a++;
    o[N] = "^" + o[R] + o[j] + "$";
    // Caret ranges.
    // Meaning is "at least and backwards compatible with"
    var I = a++;
    o[I] = "(?:\\^)";
    var L = a++;
    o[L] = "(\\s*)" + o[I] + "\\s+", i[L] = new RegExp(o[L], "g");
    var P = a++;
    o[P] = "^" + o[I] + o[x] + "$";
    var D = a++;
    o[D] = "^" + o[I] + o[j] + "$";
    // A simple gt/lt/eq thing, or just "" to indicate "any version"
    var B = a++;
    o[B] = "^" + o[E] + "\\s*(" + y + ")$|^$";
    var U = a++;
    o[U] = "^" + o[E] + "\\s*(" + m + ")$|^$";
    // An expression to strip any whitespace between the gtlt and the thing
    // it modifies, so that `> 1.2.3` ==> `>1.2.3`
    var $ = a++;
    o[$] = "(\\s*)" + o[E] + "\\s*(" + y + "|" + o[x] + ")", 
    // this one has to use the /g flag
    i[$] = new RegExp(o[$], "g");
    var G = a++;
    // Something like `1.2.3 - 1.2.4`
    // Note that these all use the loose form, because they'll be
    // checked against either the strict or loose comparator form
    // later.
        o[G] = "^\\s*(" + o[x] + ")\\s+-\\s+(" + o[x] + ")\\s*$";
    var q = a++;
    o[q] = "^\\s*(" + o[j] + ")\\s+-\\s+(" + o[j] + ")\\s*$";
    // Star ranges basically just allow anything at all.
    var W = a++;
    o[W] = "(<|>)?=?\\s*\\*";
    // Compile to actual regexp objects.
    // All are flag-free, unless they were created above with a flag.
    for (var F = 0; F < 35; F++) n(F, o[F]), i[F] || (i[F] = new RegExp(o[F]));
    function H(e, t) {
        if (t && "object" == typeof t || (t = {
            loose: !!t,
            includePrerelease: !1
        }), e instanceof z) return e;
        if ("string" != typeof e) return null;
        if (e.length > 256) return null;
        if (!(t.loose ? i[w] : i[_]).test(e)) return null;
        try {
            return new z(e, t);
        } catch (e) {
            return null;
        }
    }
    function z(e, t) {
        if (t && "object" == typeof t || (t = {
            loose: !!t,
            includePrerelease: !1
        }), e instanceof z) {
            if (e.loose === t.loose) return e;
            e = e.version;
        } else if ("string" != typeof e) throw new TypeError("Invalid Version: " + e);
        if (e.length > 256) throw new TypeError("version is longer than 256 characters");
        if (!(this instanceof z)) return new z(e, t);
        n("SemVer", e, t), this.options = t, this.loose = !!t.loose;
        var o = e.trim().match(t.loose ? i[w] : i[_]);
        if (!o) throw new TypeError("Invalid Version: " + e);
        if (this.raw = e, 
        // these are actually numbers
        this.major = +o[1], this.minor = +o[2], this.patch = +o[3], this.major > r || this.major < 0) throw new TypeError("Invalid major version");
        if (this.minor > r || this.minor < 0) throw new TypeError("Invalid minor version");
        if (this.patch > r || this.patch < 0) throw new TypeError("Invalid patch version");
        // numberify any prerelease numeric ids
                o[4] ? this.prerelease = o[4].split(".").map((function(e) {
            if (/^[0-9]+$/.test(e)) {
                var t = +e;
                if (t >= 0 && t < r) return t;
            }
            return e;
        })) : this.prerelease = [], this.build = o[5] ? o[5].split(".") : [], this.format();
    }
    t.parse = H, t.valid = function(e, t) {
        var n = H(e, t);
        return n ? n.version : null;
    }, t.clean = function(e, t) {
        var n = H(e.trim().replace(/^[=v]+/, ""), t);
        return n ? n.version : null;
    }, t.SemVer = z, z.prototype.format = function() {
        return this.version = this.major + "." + this.minor + "." + this.patch, this.prerelease.length && (this.version += "-" + this.prerelease.join(".")), 
        this.version;
    }, z.prototype.toString = function() {
        return this.version;
    }, z.prototype.compare = function(e) {
        return n("SemVer.compare", this.version, this.options, e), e instanceof z || (e = new z(e, this.options)), 
        this.compareMain(e) || this.comparePre(e);
    }, z.prototype.compareMain = function(e) {
        return e instanceof z || (e = new z(e, this.options)), V(this.major, e.major) || V(this.minor, e.minor) || V(this.patch, e.patch);
    }, z.prototype.comparePre = function(e) {
        // NOT having a prerelease is > having one
        if (e instanceof z || (e = new z(e, this.options)), this.prerelease.length && !e.prerelease.length) return -1;
        if (!this.prerelease.length && e.prerelease.length) return 1;
        if (!this.prerelease.length && !e.prerelease.length) return 0;
        var t = 0;
        do {
            var r = this.prerelease[t], i = e.prerelease[t];
            if (n("prerelease compare", t, r, i), void 0 === r && void 0 === i) return 0;
            if (void 0 === i) return 1;
            if (void 0 === r) return -1;
            if (r !== i) return V(r, i);
        } while (++t);
    }, 
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    z.prototype.inc = function(e, t) {
        switch (e) {
          case "premajor":
            this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", t);
            break;

          case "preminor":
            this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", t);
            break;

          case "prepatch":
            // If this is already a prerelease, it will bump to the next version
            // drop any prereleases that might already exist, since they are not
            // relevant at this point.
            this.prerelease.length = 0, this.inc("patch", t), this.inc("pre", t);
            break;

            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
                      case "prerelease":
            0 === this.prerelease.length && this.inc("patch", t), this.inc("pre", t);
            break;

          case "major":
            // If this is a pre-major version, bump up to the same major version.
            // Otherwise increment major.
            // 1.0.0-5 bumps to 1.0.0
            // 1.1.0 bumps to 2.0.0
            0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length || this.major++, 
            this.minor = 0, this.patch = 0, this.prerelease = [];
            break;

          case "minor":
            // If this is a pre-minor version, bump up to the same minor version.
            // Otherwise increment minor.
            // 1.2.0-5 bumps to 1.2.0
            // 1.2.1 bumps to 1.3.0
            0 === this.patch && 0 !== this.prerelease.length || this.minor++, this.patch = 0, 
            this.prerelease = [];
            break;

          case "patch":
            // If this is not a pre-release version, it will increment the patch.
            // If it is a pre-release it will bump up to the same patch version.
            // 1.2.0-5 patches to 1.2.0
            // 1.2.0 patches to 1.2.1
            0 === this.prerelease.length && this.patch++, this.prerelease = [];
            break;

            // This probably shouldn't be used publicly.
            // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
                      case "pre":
            if (0 === this.prerelease.length) this.prerelease = [ 0 ]; else {
                for (var n = this.prerelease.length; --n >= 0; ) "number" == typeof this.prerelease[n] && (this.prerelease[n]++, 
                n = -2);
                -1 === n && 
                // didn't increment anything
                this.prerelease.push(0);
            }
            t && (
            // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
            // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
            this.prerelease[0] === t ? isNaN(this.prerelease[1]) && (this.prerelease = [ t, 0 ]) : this.prerelease = [ t, 0 ]);
            break;

          default:
            throw new Error("invalid increment argument: " + e);
        }
        return this.format(), this.raw = this.version, this;
    }, t.inc = function(e, t, n, r) {
        "string" == typeof n && (r = n, n = void 0);
        try {
            return new z(e, n).inc(t, r).version;
        } catch (e) {
            return null;
        }
    }, t.diff = function(e, t) {
        if (X(e, t)) return null;
        var n = H(e), r = H(t), i = "";
        if (n.prerelease.length || r.prerelease.length) {
            i = "pre";
            var o = "prerelease";
        }
        for (var a in n) if (("major" === a || "minor" === a || "patch" === a) && n[a] !== r[a]) return i + a;
        return o;
 // may be undefined
        }, t.compareIdentifiers = V;
    var Y = /^[0-9]+$/;
    function V(e, t) {
        var n = Y.test(e), r = Y.test(t);
        return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
    }
    function J(e, t, n) {
        return new z(e, n).compare(new z(t, n));
    }
    function Z(e, t, n) {
        return J(e, t, n) > 0;
    }
    function Q(e, t, n) {
        return J(e, t, n) < 0;
    }
    function X(e, t, n) {
        return 0 === J(e, t, n);
    }
    function K(e, t, n) {
        return 0 !== J(e, t, n);
    }
    function ee(e, t, n) {
        return J(e, t, n) >= 0;
    }
    function te(e, t, n) {
        return J(e, t, n) <= 0;
    }
    function ne(e, t, n, r) {
        switch (t) {
          case "===":
            return "object" == typeof e && (e = e.version), "object" == typeof n && (n = n.version), 
            e === n;

          case "!==":
            return "object" == typeof e && (e = e.version), "object" == typeof n && (n = n.version), 
            e !== n;

          case "":
          case "=":
          case "==":
            return X(e, n, r);

          case "!=":
            return K(e, n, r);

          case ">":
            return Z(e, n, r);

          case ">=":
            return ee(e, n, r);

          case "<":
            return Q(e, n, r);

          case "<=":
            return te(e, n, r);

          default:
            throw new TypeError("Invalid operator: " + t);
        }
    }
    function re(e, t) {
        if (t && "object" == typeof t || (t = {
            loose: !!t,
            includePrerelease: !1
        }), e instanceof re) {
            if (e.loose === !!t.loose) return e;
            e = e.value;
        }
        if (!(this instanceof re)) return new re(e, t);
        n("comparator", e, t), this.options = t, this.loose = !!t.loose, this.parse(e), 
        this.semver === ie ? this.value = "" : this.value = this.operator + this.semver.version, 
        n("comp", this);
    }
    t.rcompareIdentifiers = function(e, t) {
        return V(t, e);
    }, t.major = function(e, t) {
        return new z(e, t).major;
    }, t.minor = function(e, t) {
        return new z(e, t).minor;
    }, t.patch = function(e, t) {
        return new z(e, t).patch;
    }, t.compare = J, t.compareLoose = function(e, t) {
        return J(e, t, !0);
    }, t.rcompare = function(e, t, n) {
        return J(t, e, n);
    }, t.sort = function(e, n) {
        return e.sort((function(e, r) {
            return t.compare(e, r, n);
        }));
    }, t.rsort = function(e, n) {
        return e.sort((function(e, r) {
            return t.rcompare(e, r, n);
        }));
    }, t.gt = Z, t.lt = Q, t.eq = X, t.neq = K, t.gte = ee, t.lte = te, t.cmp = ne, 
    t.Comparator = re;
    var ie = {};
    function oe(e, t) {
        if (t && "object" == typeof t || (t = {
            loose: !!t,
            includePrerelease: !1
        }), e instanceof oe) return e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease ? e : new oe(e.raw, t);
        if (e instanceof re) return new oe(e.value, t);
        if (!(this instanceof oe)) return new oe(e, t);
        if (this.options = t, this.loose = !!t.loose, this.includePrerelease = !!t.includePrerelease, 
        // First, split based on boolean or ||
        this.raw = e, this.set = e.split(/\s*\|\|\s*/).map((function(e) {
            return this.parseRange(e.trim());
        }), this).filter((function(e) {
            // throw out any that are not relevant for whatever reason
            return e.length;
        })), !this.set.length) throw new TypeError("Invalid SemVer Range: " + e);
        this.format();
    }
    function ae(e) {
        return !e || "x" === e.toLowerCase() || "*" === e;
    }
    // ~, ~> --> * (any, kinda silly)
    // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
    // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
    // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
    // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
    // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
        // This function is passed to string.replace(re[HYPHENRANGE])
    // M, m, patch, prerelease, build
    // 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
    // 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
    // 1.2 - 3.4 => >=1.2.0 <3.5.0
    function se(e, t, n, r, i, o, a, s, l, u, c, h, d) {
        return ((t = ae(n) ? "" : ae(r) ? ">=" + n + ".0.0" : ae(i) ? ">=" + n + "." + r + ".0" : ">=" + t) + " " + (s = ae(l) ? "" : ae(u) ? "<" + (+l + 1) + ".0.0" : ae(c) ? "<" + l + "." + (+u + 1) + ".0" : h ? "<=" + l + "." + u + "." + c + "-" + h : "<=" + s)).trim();
    }
    // if ANY of the sets match ALL of its comparators, then pass
        function le(e, t, r) {
        for (var i = 0; i < e.length; i++) if (!e[i].test(t)) return !1;
        if (t.prerelease.length && !r.includePrerelease) {
            // Find the set of versions that are allowed to have prereleases
            // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
            // That should allow `1.2.3-pr.2` to pass.
            // However, `1.2.4-alpha.notready` should NOT be allowed,
            // even though it's within the range set by the comparators.
            for (i = 0; i < e.length; i++) if (n(e[i].semver), e[i].semver !== ie && e[i].semver.prerelease.length > 0) {
                var o = e[i].semver;
                if (o.major === t.major && o.minor === t.minor && o.patch === t.patch) return !0;
            }
            // Version has a -pre, but it's not one of the ones we like.
                        return !1;
        }
        return !0;
    }
    function ue(e, t, n) {
        try {
            t = new oe(t, n);
        } catch (e) {
            return !1;
        }
        return t.test(e);
    }
    function ce(e, t, n, r) {
        var i, o, a, s, l;
        switch (e = new z(e, r), t = new oe(t, r), n) {
          case ">":
            i = Z, o = te, a = Q, s = ">", l = ">=";
            break;

          case "<":
            i = Q, o = ee, a = Z, s = "<", l = "<=";
            break;

          default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
        }
        // If it satisifes the range it is not outside
                if (ue(e, t, r)) return !1;
        // From now on, variable terms are as if we're in "gtr" mode.
        // but note that everything is flipped for the "ltr" function.
                for (var u = 0; u < t.set.length; ++u) {
            var c = t.set[u], h = null, d = null;
            // If the edge version comparator has a operator then our version
            // isn't outside it
            if (c.forEach((function(e) {
                e.semver === ie && (e = new re(">=0.0.0")), h = h || e, d = d || e, i(e.semver, h.semver, r) ? h = e : a(e.semver, d.semver, r) && (d = e);
            })), h.operator === s || h.operator === l) return !1;
            // If the lowest version comparator has an operator and our version
            // is less than it then it isn't higher than the range
                        if ((!d.operator || d.operator === s) && o(e, d.semver)) return !1;
            if (d.operator === l && a(e, d.semver)) return !1;
        }
        return !0;
    }
    re.prototype.parse = function(e) {
        var t = this.options.loose ? i[B] : i[U], n = e.match(t);
        if (!n) throw new TypeError("Invalid comparator: " + e);
        this.operator = n[1], "=" === this.operator && (this.operator = ""), 
        // if it literally is just '>' or '' then allow anything.
        n[2] ? this.semver = new z(n[2], this.options.loose) : this.semver = ie;
    }, re.prototype.toString = function() {
        return this.value;
    }, re.prototype.test = function(e) {
        return n("Comparator.test", e, this.options.loose), this.semver === ie || ("string" == typeof e && (e = new z(e, this.options)), 
        ne(e, this.operator, this.semver, this.options));
    }, re.prototype.intersects = function(e, t) {
        if (!(e instanceof re)) throw new TypeError("a Comparator is required");
        var n;
        if (t && "object" == typeof t || (t = {
            loose: !!t,
            includePrerelease: !1
        }), "" === this.operator) return n = new oe(e.value, t), ue(this.value, n, t);
        if ("" === e.operator) return n = new oe(this.value, t), ue(e.semver, n, t);
        var r = !(">=" !== this.operator && ">" !== this.operator || ">=" !== e.operator && ">" !== e.operator), i = !("<=" !== this.operator && "<" !== this.operator || "<=" !== e.operator && "<" !== e.operator), o = this.semver.version === e.semver.version, a = !(">=" !== this.operator && "<=" !== this.operator || ">=" !== e.operator && "<=" !== e.operator), s = ne(this.semver, "<", e.semver, t) && (">=" === this.operator || ">" === this.operator) && ("<=" === e.operator || "<" === e.operator), l = ne(this.semver, ">", e.semver, t) && ("<=" === this.operator || "<" === this.operator) && (">=" === e.operator || ">" === e.operator);
        return r || i || o && a || s || l;
    }, t.Range = oe, oe.prototype.format = function() {
        return this.range = this.set.map((function(e) {
            return e.join(" ").trim();
        })).join("||").trim(), this.range;
    }, oe.prototype.toString = function() {
        return this.range;
    }, oe.prototype.parseRange = function(e) {
        var t = this.options.loose;
        e = e.trim();
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        var r = t ? i[q] : i[G];
        e = e.replace(r, se), n("hyphen replace", e), 
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        e = e.replace(i[$], "$1$2$3"), n("comparator trim", e, i[$]), 
        // normalize spaces
        e = (
        // `^ 1.2.3` => `^1.2.3`
        e = (
        // `~ 1.2.3` => `~1.2.3`
        e = e.replace(i[C], "$1~")).replace(i[L], "$1^")).split(/\s+/).join(" ");
        // At this point, the range is completely trimmed and
        // ready to be split into comparators.
        var o = t ? i[B] : i[U], a = e.split(" ").map((function(e) {
            // comprised of xranges, tildes, stars, and gtlt's at this point.
            // already replaced the hyphen ranges
            // turn into a set of JUST comparators.
            return function(e, t) {
                return n("comp", e, t), e = 
                // ^ --> * (any, kinda silly)
                // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
                // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
                // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
                // ^1.2.3 --> >=1.2.3 <2.0.0
                // ^1.2.0 --> >=1.2.0 <2.0.0
                function(e, t) {
                    return e.trim().split(/\s+/).map((function(e) {
                        return function(e, t) {
                            n("caret", e, t);
                            var r = t.loose ? i[D] : i[P];
                            return e.replace(r, (function(t, r, i, o, a) {
                                var s;
                                return n("caret", e, t, r, i, o, a), ae(r) ? s = "" : ae(i) ? s = ">=" + r + ".0.0 <" + (+r + 1) + ".0.0" : ae(o) ? s = "0" === r ? ">=" + r + "." + i + ".0 <" + r + "." + (+i + 1) + ".0" : ">=" + r + "." + i + ".0 <" + (+r + 1) + ".0.0" : a ? (n("replaceCaret pr", a), 
                                s = "0" === r ? "0" === i ? ">=" + r + "." + i + "." + o + "-" + a + " <" + r + "." + i + "." + (+o + 1) : ">=" + r + "." + i + "." + o + "-" + a + " <" + r + "." + (+i + 1) + ".0" : ">=" + r + "." + i + "." + o + "-" + a + " <" + (+r + 1) + ".0.0") : (n("no pr"), 
                                s = "0" === r ? "0" === i ? ">=" + r + "." + i + "." + o + " <" + r + "." + i + "." + (+o + 1) : ">=" + r + "." + i + "." + o + " <" + r + "." + (+i + 1) + ".0" : ">=" + r + "." + i + "." + o + " <" + (+r + 1) + ".0.0"), 
                                n("caret return", s), s;
                            }));
                        }(e, t);
                    })).join(" ");
                }(e, t), n("caret", e), e = function(e, t) {
                    return e.trim().split(/\s+/).map((function(e) {
                        return function(e, t) {
                            var r = t.loose ? i[N] : i[M];
                            return e.replace(r, (function(t, r, i, o, a) {
                                var s;
                                return n("tilde", e, t, r, i, o, a), ae(r) ? s = "" : ae(i) ? s = ">=" + r + ".0.0 <" + (+r + 1) + ".0.0" : ae(o) ? 
                                // ~1.2 == >=1.2.0 <1.3.0
                                s = ">=" + r + "." + i + ".0 <" + r + "." + (+i + 1) + ".0" : a ? (n("replaceTilde pr", a), 
                                s = ">=" + r + "." + i + "." + o + "-" + a + " <" + r + "." + (+i + 1) + ".0") : 
                                // ~1.2.3 == >=1.2.3 <1.3.0
                                s = ">=" + r + "." + i + "." + o + " <" + r + "." + (+i + 1) + ".0", n("tilde return", s), 
                                s;
                            }));
                        }(e, t);
                    })).join(" ");
                }(e, t), n("tildes", e), e = function(e, t) {
                    return n("replaceXRanges", e, t), e.split(/\s+/).map((function(e) {
                        return function(e, t) {
                            e = e.trim();
                            var r = t.loose ? i[O] : i[T];
                            return e.replace(r, (function(t, r, i, o, a, s) {
                                n("xRange", e, t, r, i, o, a, s);
                                var l = ae(i), u = l || ae(o), c = u || ae(a);
                                return "=" === r && c && (r = ""), l ? 
                                // nothing is allowed
                                t = ">" === r || "<" === r ? "<0.0.0" : "*" : r && c ? (
                                // we know patch is an x, because we have any x at all.
                                // replace X with 0
                                u && (o = 0), a = 0, ">" === r ? (
                                // >1 => >=2.0.0
                                // >1.2 => >=1.3.0
                                // >1.2.3 => >= 1.2.4
                                r = ">=", u ? (i = +i + 1, o = 0, a = 0) : (o = +o + 1, a = 0)) : "<=" === r && (
                                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                                r = "<", u ? i = +i + 1 : o = +o + 1), t = r + i + "." + o + "." + a) : u ? t = ">=" + i + ".0.0 <" + (+i + 1) + ".0.0" : c && (t = ">=" + i + "." + o + ".0 <" + i + "." + (+o + 1) + ".0"), 
                                n("xRange return", t), t;
                            }));
                        }
                        // Because * is AND-ed with everything else in the comparator,
                        // and '' means "any version", just remove the *s entirely.
                        (e, t);
                    })).join(" ");
                }(e, t), n("xrange", e), e = function(e, t) {
                    // Looseness is ignored here.  star is always as loose as it gets!
                    return n("replaceStars", e, t), e.trim().replace(i[W], "");
                }(e, t), n("stars", e), e;
            }(e, this.options);
        }), this).join(" ").split(/\s+/);
        return this.options.loose && (
        // in loose mode, throw out any that are not valid comparators
        a = a.filter((function(e) {
            return !!e.match(o);
        }))), a = a.map((function(e) {
            return new re(e, this.options);
        }), this);
    }, oe.prototype.intersects = function(e, t) {
        if (!(e instanceof oe)) throw new TypeError("a Range is required");
        return this.set.some((function(n) {
            return n.every((function(n) {
                return e.set.some((function(e) {
                    return e.every((function(e) {
                        return n.intersects(e, t);
                    }));
                }));
            }));
        }));
    }, 
    // Mostly just for testing and legacy API reasons
    t.toComparators = function(e, t) {
        return new oe(e, t).set.map((function(e) {
            return e.map((function(e) {
                return e.value;
            })).join(" ").trim().split(" ");
        }));
    }, oe.prototype.test = function(e) {
        if (!e) return !1;
        "string" == typeof e && (e = new z(e, this.options));
        for (var t = 0; t < this.set.length; t++) if (le(this.set[t], e, this.options)) return !0;
        return !1;
    }, t.satisfies = ue, t.maxSatisfying = function(e, t, n) {
        var r = null, i = null;
        try {
            var o = new oe(t, n);
        } catch (e) {
            return null;
        }
        return e.forEach((function(e) {
            o.test(e) && (
            // satisfies(v, range, options)
            r && -1 !== i.compare(e) || (i = new z(
            // compare(max, v, true)
            r = e, n)));
        })), r;
    }, t.minSatisfying = function(e, t, n) {
        var r = null, i = null;
        try {
            var o = new oe(t, n);
        } catch (e) {
            return null;
        }
        return e.forEach((function(e) {
            o.test(e) && (
            // satisfies(v, range, options)
            r && 1 !== i.compare(e) || (i = new z(
            // compare(min, v, true)
            r = e, n)));
        })), r;
    }, t.minVersion = function(e, t) {
        e = new oe(e, t);
        var n = new z("0.0.0");
        if (e.test(n)) return n;
        if (n = new z("0.0.0-0"), e.test(n)) return n;
        n = null;
        for (var r = 0; r < e.set.length; ++r) {
            e.set[r].forEach((function(e) {
                // Clone to avoid manipulating the comparator's semver object.
                var t = new z(e.semver.version);
                switch (e.operator) {
                  case ">":
                    0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0), t.raw = t.format();

 /* fallthrough */                  case "":
                  case ">=":
                    n && !Z(n, t) || (n = t);
                    break;

                  case "<":
                  case "<=":
                    /* Ignore maximum versions */
                    break;

                    /* istanbul ignore next */                  default:
                    throw new Error("Unexpected operation: " + e.operator);
                }
            }));
        }
        if (n && e.test(n)) return n;
        return null;
    }, t.validRange = function(e, t) {
        try {
            // Return '*' instead of '' so that truthiness works.
            // This will throw if it's invalid anyway
            return new oe(e, t).range || "*";
        } catch (e) {
            return null;
        }
    }
    // Determine if version is less than all the versions possible in the range
    , t.ltr = function(e, t, n) {
        return ce(e, t, "<", n);
    }
    // Determine if version is greater than all the versions possible in the range.
    , t.gtr = function(e, t, n) {
        return ce(e, t, ">", n);
    }, t.outside = ce, t.prerelease = function(e, t) {
        var n = H(e, t);
        return n && n.prerelease.length ? n.prerelease : null;
    }, t.intersects = function(e, t, n) {
        return e = new oe(e, n), t = new oe(t, n), e.intersects(t);
    }, t.coerce = function(e) {
        if (e instanceof z) return e;
        if ("string" != typeof e) return null;
        var t = e.match(i[A]);
        if (null == t) return null;
        return H(t[1] + "." + (t[2] || "0") + "." + (t[3] || "0"));
    };
}))), fi = (di.SEMVER_SPEC_VERSION, di.re, di.src, di.parse, di.valid, di.clean, 
di.SemVer, di.inc, di.diff, di.compareIdentifiers, di.rcompareIdentifiers, di.major, 
di.minor, di.patch, di.compare, di.compareLoose, di.rcompare, di.sort, di.rsort, 
di.gt, di.lt, di.eq, di.neq, di.gte, di.lte, di.cmp, di.Comparator, di.Range, di.toComparators, 
di.satisfies, di.maxSatisfying, di.minSatisfying, di.minVersion, di.validRange, 
di.ltr, di.gtr, di.outside, di.prerelease, di.intersects, di.coerce, s.platform()), pi = a.spawnSync, vi = n.readdirSync, bi = "musl", gi = {
    encoding: "utf8",
    env: process.env
};

function _i(e) {
    return function(t) {
        return -1 !== t.indexOf(e);
    };
}

function mi(e) {
    return e.split(/[\r\n]+/)[1].trim().split(/\s/)[1];
}

function yi(e) {
    try {
        return vi(e);
    } catch (e) {}
    return [];
}

pi || (pi = function() {
    return {
        status: 126,
        stdout: "",
        stderr: ""
    };
});

var wi = "", Ei = "", ki = "";

if ("linux" === fi) {
    // Try getconf
    var Si = pi("getconf", [ "GNU_LIBC_VERSION" ], gi);
    if (0 === Si.status) wi = "glibc", Ei = Si.stdout.trim().split(" ")[1], ki = "getconf"; else {
        // Try ldd
        var xi = pi("ldd", [ "--version" ], gi);
        if (0 === xi.status && -1 !== xi.stdout.indexOf(bi)) wi = bi, Ei = mi(xi.stdout), 
        ki = "ldd"; else if (1 === xi.status && -1 !== xi.stderr.indexOf(bi)) wi = bi, Ei = mi(xi.stderr), 
        ki = "ldd"; else {
            // Try filesystem (family only)
            var ji = yi("/lib");
            if (ji.some(_i("-linux-gnu"))) wi = "glibc", ki = "filesystem"; else if (ji.some(_i("libc.musl-"))) wi = bi, 
            ki = "filesystem"; else if (ji.some(_i("ld-musl-"))) wi = bi, ki = "filesystem"; else {
                yi("/usr/sbin").some(_i("glibc")) && (wi = "glibc", ki = "filesystem");
            }
        }
    }
}

var Ti = {
    GLIBC: "glibc",
    MUSL: bi,
    family: wi,
    version: Ei,
    method: ki,
    isNonGlibcLinux: "" !== wi && "glibc" !== wi
}, Oi = b( Object.freeze({
    __proto__: null,
    default: {
        "0.1.14": {
            node_abi: null,
            v8: "1.3"
        },
        "0.1.15": {
            node_abi: null,
            v8: "1.3"
        },
        "0.1.16": {
            node_abi: null,
            v8: "1.3"
        },
        "0.1.17": {
            node_abi: null,
            v8: "1.3"
        },
        "0.1.18": {
            node_abi: null,
            v8: "1.3"
        },
        "0.1.19": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.20": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.21": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.22": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.23": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.24": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.25": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.26": {
            node_abi: null,
            v8: "2.0"
        },
        "0.1.27": {
            node_abi: null,
            v8: "2.1"
        },
        "0.1.28": {
            node_abi: null,
            v8: "2.1"
        },
        "0.1.29": {
            node_abi: null,
            v8: "2.1"
        },
        "0.1.30": {
            node_abi: null,
            v8: "2.1"
        },
        "0.1.31": {
            node_abi: null,
            v8: "2.1"
        },
        "0.1.32": {
            node_abi: null,
            v8: "2.1"
        },
        "0.1.33": {
            node_abi: null,
            v8: "2.1"
        },
        "0.1.90": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.91": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.92": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.93": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.94": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.95": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.96": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.97": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.98": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.99": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.100": {
            node_abi: null,
            v8: "2.2"
        },
        "0.1.101": {
            node_abi: null,
            v8: "2.3"
        },
        "0.1.102": {
            node_abi: null,
            v8: "2.3"
        },
        "0.1.103": {
            node_abi: null,
            v8: "2.3"
        },
        "0.1.104": {
            node_abi: null,
            v8: "2.3"
        },
        "0.2.0": {
            node_abi: 1,
            v8: "2.3"
        },
        "0.2.1": {
            node_abi: 1,
            v8: "2.3"
        },
        "0.2.2": {
            node_abi: 1,
            v8: "2.3"
        },
        "0.2.3": {
            node_abi: 1,
            v8: "2.3"
        },
        "0.2.4": {
            node_abi: 1,
            v8: "2.3"
        },
        "0.2.5": {
            node_abi: 1,
            v8: "2.3"
        },
        "0.2.6": {
            node_abi: 1,
            v8: "2.3"
        },
        "0.3.0": {
            node_abi: 1,
            v8: "2.5"
        },
        "0.3.1": {
            node_abi: 1,
            v8: "2.5"
        },
        "0.3.2": {
            node_abi: 1,
            v8: "3.0"
        },
        "0.3.3": {
            node_abi: 1,
            v8: "3.0"
        },
        "0.3.4": {
            node_abi: 1,
            v8: "3.0"
        },
        "0.3.5": {
            node_abi: 1,
            v8: "3.0"
        },
        "0.3.6": {
            node_abi: 1,
            v8: "3.0"
        },
        "0.3.7": {
            node_abi: 1,
            v8: "3.0"
        },
        "0.3.8": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.0": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.1": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.2": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.3": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.4": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.5": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.6": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.7": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.8": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.9": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.10": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.11": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.4.12": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.5.0": {
            node_abi: 1,
            v8: "3.1"
        },
        "0.5.1": {
            node_abi: 1,
            v8: "3.4"
        },
        "0.5.2": {
            node_abi: 1,
            v8: "3.4"
        },
        "0.5.3": {
            node_abi: 1,
            v8: "3.4"
        },
        "0.5.4": {
            node_abi: 1,
            v8: "3.5"
        },
        "0.5.5": {
            node_abi: 1,
            v8: "3.5"
        },
        "0.5.6": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.5.7": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.5.8": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.5.9": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.5.10": {
            node_abi: 1,
            v8: "3.7"
        },
        "0.6.0": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.1": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.2": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.3": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.4": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.5": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.6": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.7": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.8": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.9": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.10": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.11": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.12": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.13": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.14": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.15": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.16": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.17": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.18": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.19": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.20": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.6.21": {
            node_abi: 1,
            v8: "3.6"
        },
        "0.7.0": {
            node_abi: 1,
            v8: "3.8"
        },
        "0.7.1": {
            node_abi: 1,
            v8: "3.8"
        },
        "0.7.2": {
            node_abi: 1,
            v8: "3.8"
        },
        "0.7.3": {
            node_abi: 1,
            v8: "3.9"
        },
        "0.7.4": {
            node_abi: 1,
            v8: "3.9"
        },
        "0.7.5": {
            node_abi: 1,
            v8: "3.9"
        },
        "0.7.6": {
            node_abi: 1,
            v8: "3.9"
        },
        "0.7.7": {
            node_abi: 1,
            v8: "3.9"
        },
        "0.7.8": {
            node_abi: 1,
            v8: "3.9"
        },
        "0.7.9": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.7.10": {
            node_abi: 1,
            v8: "3.9"
        },
        "0.7.11": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.7.12": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.0": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.1": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.2": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.3": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.4": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.5": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.6": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.7": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.8": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.9": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.10": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.11": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.12": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.13": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.14": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.15": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.16": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.17": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.18": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.19": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.20": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.21": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.22": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.23": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.24": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.25": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.26": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.27": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.8.28": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.9.0": {
            node_abi: 1,
            v8: "3.11"
        },
        "0.9.1": {
            node_abi: 10,
            v8: "3.11"
        },
        "0.9.2": {
            node_abi: 10,
            v8: "3.11"
        },
        "0.9.3": {
            node_abi: 10,
            v8: "3.13"
        },
        "0.9.4": {
            node_abi: 10,
            v8: "3.13"
        },
        "0.9.5": {
            node_abi: 10,
            v8: "3.13"
        },
        "0.9.6": {
            node_abi: 10,
            v8: "3.15"
        },
        "0.9.7": {
            node_abi: 10,
            v8: "3.15"
        },
        "0.9.8": {
            node_abi: 10,
            v8: "3.15"
        },
        "0.9.9": {
            node_abi: 11,
            v8: "3.15"
        },
        "0.9.10": {
            node_abi: 11,
            v8: "3.15"
        },
        "0.9.11": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.9.12": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.0": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.1": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.2": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.3": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.4": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.5": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.6": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.7": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.8": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.9": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.10": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.11": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.12": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.13": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.14": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.15": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.16": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.17": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.18": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.19": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.20": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.21": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.22": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.23": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.24": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.25": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.26": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.27": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.28": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.29": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.30": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.31": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.32": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.33": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.34": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.35": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.36": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.37": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.38": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.39": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.40": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.41": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.42": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.43": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.44": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.45": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.46": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.47": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.10.48": {
            node_abi: 11,
            v8: "3.14"
        },
        "0.11.0": {
            node_abi: 12,
            v8: "3.17"
        },
        "0.11.1": {
            node_abi: 12,
            v8: "3.18"
        },
        "0.11.2": {
            node_abi: 12,
            v8: "3.19"
        },
        "0.11.3": {
            node_abi: 12,
            v8: "3.19"
        },
        "0.11.4": {
            node_abi: 12,
            v8: "3.20"
        },
        "0.11.5": {
            node_abi: 12,
            v8: "3.20"
        },
        "0.11.6": {
            node_abi: 12,
            v8: "3.20"
        },
        "0.11.7": {
            node_abi: 12,
            v8: "3.20"
        },
        "0.11.8": {
            node_abi: 13,
            v8: "3.21"
        },
        "0.11.9": {
            node_abi: 13,
            v8: "3.22"
        },
        "0.11.10": {
            node_abi: 13,
            v8: "3.22"
        },
        "0.11.11": {
            node_abi: 14,
            v8: "3.22"
        },
        "0.11.12": {
            node_abi: 14,
            v8: "3.22"
        },
        "0.11.13": {
            node_abi: 14,
            v8: "3.25"
        },
        "0.11.14": {
            node_abi: 14,
            v8: "3.26"
        },
        "0.11.15": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.11.16": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.0": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.1": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.2": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.3": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.4": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.5": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.6": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.7": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.8": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.9": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.10": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.11": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.12": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.13": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.14": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.15": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.16": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.17": {
            node_abi: 14,
            v8: "3.28"
        },
        "0.12.18": {
            node_abi: 14,
            v8: "3.28"
        },
        "1.0.0": {
            node_abi: 42,
            v8: "3.31"
        },
        "1.0.1": {
            node_abi: 42,
            v8: "3.31"
        },
        "1.0.2": {
            node_abi: 42,
            v8: "3.31"
        },
        "1.0.3": {
            node_abi: 42,
            v8: "4.1"
        },
        "1.0.4": {
            node_abi: 42,
            v8: "4.1"
        },
        "1.1.0": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.2.0": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.3.0": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.4.1": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.4.2": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.4.3": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.5.0": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.5.1": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.6.0": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.6.1": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.6.2": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.6.3": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.6.4": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.7.1": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.8.1": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.8.2": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.8.3": {
            node_abi: 43,
            v8: "4.1"
        },
        "1.8.4": {
            node_abi: 43,
            v8: "4.1"
        },
        "2.0.0": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.0.1": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.0.2": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.1.0": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.2.0": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.2.1": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.3.0": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.3.1": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.3.2": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.3.3": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.3.4": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.4.0": {
            node_abi: 44,
            v8: "4.2"
        },
        "2.5.0": {
            node_abi: 44,
            v8: "4.2"
        },
        "3.0.0": {
            node_abi: 45,
            v8: "4.4"
        },
        "3.1.0": {
            node_abi: 45,
            v8: "4.4"
        },
        "3.2.0": {
            node_abi: 45,
            v8: "4.4"
        },
        "3.3.0": {
            node_abi: 45,
            v8: "4.4"
        },
        "3.3.1": {
            node_abi: 45,
            v8: "4.4"
        },
        "4.0.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.1.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.1.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.1.2": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.2.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.2.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.2.2": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.2.3": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.2.4": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.2.5": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.2.6": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.3.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.3.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.3.2": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.2": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.3": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.4": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.5": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.6": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.4.7": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.5.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.6.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.6.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.6.2": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.7.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.7.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.7.2": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.7.3": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.2": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.3": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.4": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.5": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.6": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.8.7": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.9.0": {
            node_abi: 46,
            v8: "4.5"
        },
        "4.9.1": {
            node_abi: 46,
            v8: "4.5"
        },
        "5.0.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.1.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.1.1": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.2.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.3.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.4.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.4.1": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.5.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.6.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.7.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.7.1": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.8.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.9.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.9.1": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.10.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.10.1": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.11.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.11.1": {
            node_abi: 47,
            v8: "4.6"
        },
        "5.12.0": {
            node_abi: 47,
            v8: "4.6"
        },
        "6.0.0": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.1.0": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.2.0": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.2.1": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.2.2": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.3.0": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.3.1": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.4.0": {
            node_abi: 48,
            v8: "5.0"
        },
        "6.5.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.6.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.7.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.8.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.8.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.9.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.9.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.9.2": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.9.3": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.9.4": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.9.5": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.10.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.10.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.10.2": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.10.3": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.11.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.11.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.11.2": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.11.3": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.11.4": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.11.5": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.12.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.12.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.12.2": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.12.3": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.13.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.13.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.14.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.14.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.14.2": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.14.3": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.14.4": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.15.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.15.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.16.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.17.0": {
            node_abi: 48,
            v8: "5.1"
        },
        "6.17.1": {
            node_abi: 48,
            v8: "5.1"
        },
        "7.0.0": {
            node_abi: 51,
            v8: "5.4"
        },
        "7.1.0": {
            node_abi: 51,
            v8: "5.4"
        },
        "7.2.0": {
            node_abi: 51,
            v8: "5.4"
        },
        "7.2.1": {
            node_abi: 51,
            v8: "5.4"
        },
        "7.3.0": {
            node_abi: 51,
            v8: "5.4"
        },
        "7.4.0": {
            node_abi: 51,
            v8: "5.4"
        },
        "7.5.0": {
            node_abi: 51,
            v8: "5.4"
        },
        "7.6.0": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.7.0": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.7.1": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.7.2": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.7.3": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.7.4": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.8.0": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.9.0": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.10.0": {
            node_abi: 51,
            v8: "5.5"
        },
        "7.10.1": {
            node_abi: 51,
            v8: "5.5"
        },
        "8.0.0": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.1.0": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.1.1": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.1.2": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.1.3": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.1.4": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.2.0": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.2.1": {
            node_abi: 57,
            v8: "5.8"
        },
        "8.3.0": {
            node_abi: 57,
            v8: "6.0"
        },
        "8.4.0": {
            node_abi: 57,
            v8: "6.0"
        },
        "8.5.0": {
            node_abi: 57,
            v8: "6.0"
        },
        "8.6.0": {
            node_abi: 57,
            v8: "6.0"
        },
        "8.7.0": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.8.0": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.8.1": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.9.0": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.9.1": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.9.2": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.9.3": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.9.4": {
            node_abi: 57,
            v8: "6.1"
        },
        "8.10.0": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.11.0": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.11.1": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.11.2": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.11.3": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.11.4": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.12.0": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.13.0": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.14.0": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.14.1": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.15.0": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.15.1": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.16.0": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.16.1": {
            node_abi: 57,
            v8: "6.2"
        },
        "8.16.2": {
            node_abi: 57,
            v8: "6.2"
        },
        "9.0.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.1.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.2.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.2.1": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.3.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.4.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.5.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.6.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.6.1": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.7.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.7.1": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.8.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.9.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.10.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.10.1": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.11.0": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.11.1": {
            node_abi: 59,
            v8: "6.2"
        },
        "9.11.2": {
            node_abi: 59,
            v8: "6.2"
        },
        "10.0.0": {
            node_abi: 64,
            v8: "6.6"
        },
        "10.1.0": {
            node_abi: 64,
            v8: "6.6"
        },
        "10.2.0": {
            node_abi: 64,
            v8: "6.6"
        },
        "10.2.1": {
            node_abi: 64,
            v8: "6.6"
        },
        "10.3.0": {
            node_abi: 64,
            v8: "6.6"
        },
        "10.4.0": {
            node_abi: 64,
            v8: "6.7"
        },
        "10.4.1": {
            node_abi: 64,
            v8: "6.7"
        },
        "10.5.0": {
            node_abi: 64,
            v8: "6.7"
        },
        "10.6.0": {
            node_abi: 64,
            v8: "6.7"
        },
        "10.7.0": {
            node_abi: 64,
            v8: "6.7"
        },
        "10.8.0": {
            node_abi: 64,
            v8: "6.7"
        },
        "10.9.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.10.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.11.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.12.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.13.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.14.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.14.1": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.14.2": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.15.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.15.1": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.15.2": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.15.3": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.16.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.16.1": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.16.2": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.16.3": {
            node_abi: 64,
            v8: "6.8"
        },
        "10.17.0": {
            node_abi: 64,
            v8: "6.8"
        },
        "11.0.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.1.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.2.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.3.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.4.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.5.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.6.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.7.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.8.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.9.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.10.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.10.1": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.11.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.12.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.13.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.14.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "11.15.0": {
            node_abi: 67,
            v8: "7.0"
        },
        "12.0.0": {
            node_abi: 72,
            v8: "7.4"
        },
        "12.1.0": {
            node_abi: 72,
            v8: "7.4"
        },
        "12.2.0": {
            node_abi: 72,
            v8: "7.4"
        },
        "12.3.0": {
            node_abi: 72,
            v8: "7.4"
        },
        "12.3.1": {
            node_abi: 72,
            v8: "7.4"
        },
        "12.4.0": {
            node_abi: 72,
            v8: "7.4"
        },
        "12.5.0": {
            node_abi: 72,
            v8: "7.5"
        },
        "12.6.0": {
            node_abi: 72,
            v8: "7.5"
        },
        "12.7.0": {
            node_abi: 72,
            v8: "7.5"
        },
        "12.8.0": {
            node_abi: 72,
            v8: "7.5"
        },
        "12.8.1": {
            node_abi: 72,
            v8: "7.5"
        },
        "12.9.0": {
            node_abi: 72,
            v8: "7.6"
        },
        "12.9.1": {
            node_abi: 72,
            v8: "7.6"
        },
        "12.10.0": {
            node_abi: 72,
            v8: "7.6"
        },
        "12.11.0": {
            node_abi: 72,
            v8: "7.7"
        },
        "12.11.1": {
            node_abi: 72,
            v8: "7.7"
        },
        "12.12.0": {
            node_abi: 72,
            v8: "7.7"
        },
        "12.13.0": {
            node_abi: 72,
            v8: "7.7"
        },
        "13.0.0": {
            node_abi: 79,
            v8: "7.8"
        },
        "13.0.1": {
            node_abi: 79,
            v8: "7.8"
        }
    }
})), Ai = v((function(e, t) {
    var n;
    // This is used for unit testing to provide a fake
    // ABI crosswalk that emulates one that is not updated
    // for the current version
        e.exports = t, n = process.env.NODE_PRE_GYP_ABI_CROSSWALK ? p(process.env.NODE_PRE_GYP_ABI_CROSSWALK) : Oi;
    var o = {};
    function a(e, t) {
        if (!e) throw new Error("get_electron_abi requires valid runtime arg");
        if (void 0 === t) 
        // erroneous CLI call
        throw new Error("Empty target version is not supported if electron is the target.");
        // Electron guarantees that patch version update won't break native modules.
                var n = di.parse(t);
        return e + "-v" + n.major + "." + n.minor;
    }
    function s(e, t) {
        if (!e) throw new Error("get_node_webkit_abi requires valid runtime arg");
        if (void 0 === t) 
        // erroneous CLI call
        throw new Error("Empty target version is not supported if node-webkit is the target.");
        return e + "-v" + t;
    }
    function l(e, t) {
        if (!e) throw new Error("get_node_abi requires valid runtime arg");
        if (!t) throw new Error("get_node_abi requires valid process.versions object");
        var n = di.parse(t.node);
        return 0 === n.major && n.minor % 2 ? e + "-v" + t.node : t.modules ? e + "-v" + +t.modules : "v8-" + t.v8.split(".").slice(0, 2).join(".");
    }
    function u(e, t) {
        if (!e) throw new Error("get_runtime_abi requires valid runtime arg");
        if ("node-webkit" === e) return s(e, t || process.versions["node-webkit"]);
        if ("electron" === e) return a(e, t || process.versions.electron);
        if ("node" != e) throw new Error("Unknown Runtime: '" + e + "'");
        if (t) {
            var r;
            // abi_crosswalk generated with ./scripts/abi_crosswalk.js
                        if (n[t]) r = n[t]; else {
                var i = t.split(".").map((function(e) {
                    return +e;
                }));
                if (3 != i.length) // parse failed
                throw new Error("Unknown target version: " + t);
                /*
                    The below code tries to infer the last known ABI compatible version
                    that we have recorded in the abi_crosswalk.json when an exact match
                    is not possible. The reasons for this to exist are complicated:

                       - We support passing --target to be able to allow developers to package binaries for versions of node
                         that are not the same one as they are running. This might also be used in combination with the
                         --target_arch or --target_platform flags to also package binaries for alternative platforms
                       - When --target is passed we can't therefore determine the ABI (process.versions.modules) from the node
                         version that is running in memory
                       - So, therefore node-pre-gyp keeps an "ABI crosswalk" (lib/util/abi_crosswalk.json) to be able to look
                         this info up for all versions
                       - But we cannot easily predict what the future ABI will be for released versions
                       - And node-pre-gyp needs to be a `bundledDependency` in apps that depend on it in order to work correctly
                         by being fully available at install time.
                       - So, the speed of node releases and the bundled nature of node-pre-gyp mean that a new node-pre-gyp release
                         need to happen for every node.js/io.js/node-webkit/nw.js/atom-shell/etc release that might come online if
                         you want the `--target` flag to keep working for the latest version
                       - Which is impractical ^^
                       - Hence the below code guesses about future ABI to make the need to update node-pre-gyp less demanding.

                    In practice then you can have a dependency of your app like `node-sqlite3` that bundles a `node-pre-gyp` that
                    only knows about node v0.10.33 in the `abi_crosswalk.json` but target node v0.10.34 (which is assumed to be
                    ABI compatible with v0.10.33).

                    TODO: use semver module instead of custom version parsing
                */                var u = i[0], c = i[1], h = i[2];
                // io.js: yeah if node.js ever releases 1.x this will break
                // but that is unlikely to happen: https://github.com/iojs/io.js/pull/253#issuecomment-69432616
                if (1 === u) 
                // look for last release that is the same major version
                // e.g. we assume io.js 1.x is ABI compatible with >= 1.0.0
                for (;;) {
                    c > 0 && --c, h > 0 && --h;
                    var d = u + "." + c + "." + h;
                    if (n[d]) {
                        r = n[d], console.log("Warning: node-pre-gyp could not find exact match for " + t), 
                        console.log("Warning: but node-pre-gyp successfully choose " + d + " as ABI compatible target");
                        break;
                    }
                    if (0 === c && 0 === h) break;
                } else if (u >= 2) 
                // look for last release that is the same major version
                o[u] && (r = n[o[u]], console.log("Warning: node-pre-gyp could not find exact match for " + t), 
                console.log("Warning: but node-pre-gyp successfully choose " + o[u] + " as ABI compatible target")); else if (0 === u && i[1] % 2 == 0) // for stable/even node.js series
                // look for the last release that is the same minor release
                // e.g. we assume node 0.10.x is ABI compatible with >= 0.10.0
                for (;--h > 0; ) {
                    var f = u + "." + c + "." + h;
                    if (n[f]) {
                        r = n[f], console.log("Warning: node-pre-gyp could not find exact match for " + t), 
                        console.log("Warning: but node-pre-gyp successfully choose " + f + " as ABI compatible target");
                        break;
                    }
                }
            }
            if (!r) throw new Error("Unsupported target version: " + t);
            // emulate process.versions
                        return l(e, {
                node: t,
                v8: r.v8 + ".0",
                // abi_crosswalk uses 1 for node versions lacking process.versions.modules
                // process.versions.modules added in >= v0.10.4 and v0.11.7
                modules: r.node_abi > 1 ? r.node_abi : void 0
            });
        }
        return l(e, process.versions);
    }
    Object.keys(n).forEach((function(e) {
        var t = e.split(".")[0];
        o[t] || (o[t] = e);
    })), e.exports.get_electron_abi = a, e.exports.get_node_webkit_abi = s, e.exports.get_node_abi = l, 
    e.exports.get_runtime_abi = u;
    var c = [ "module_name", "module_path", "host" ];
    function h(e, t) {
        var n = e.name + " package.json is not node-pre-gyp ready:\n", r = [];
        e.main || r.push("main"), e.version || r.push("version"), e.name || r.push("name"), 
        e.binary || r.push("binary");
        var o = e.binary;
        if (c.forEach((function(e) {
            r.indexOf("binary") > -1 && r.pop("binary"), o && void 0 !== o[e] && "" !== o[e] || r.push("binary." + e);
        })), r.length >= 1) throw new Error(n + "package.json must declare these properties: \n" + r.join("\n"));
        if (o) {
            // enforce https over http
            var a = i.parse(o.host).protocol;
            if ("http:" === a) throw new Error("'host' protocol (" + a + ") is invalid - only 'https:' is accepted");
        }
        hi.validate_package_json(e, t);
    }
    function d(e, t) {
        return Object.keys(t).forEach((function(n) {
            for (var r = "{" + n + "}"; e.indexOf(r) > -1; ) e = e.replace(r, t[n]);
        })), e;
    }
    // url.resolve needs single trailing slash
    // to behave correctly, otherwise a double slash
    // may end up in the url which breaks requests
    // and a lacking slash may not lead to proper joining
        function f(e) {
        return "/" != e.slice(-1) ? e + "/" : e;
    }
    // remove double slashes
    // note: path.normalize will not work because
    // it will convert forward to back slashes
        function v(e) {
        var t = "node";
        return e["node-webkit"] ? t = "node-webkit" : e.electron && (t = "electron"), t;
    }
    e.exports.validate_config = h, e.exports.get_process_runtime = v;
    e.exports.evaluate = function(e, t, n) {
        h(e, t = t || {});
        // options is a suitable substitute for opts in this case
        var o = e.version, a = di.parse(o), s = t.runtime || v(process.versions), l = {
            name: e.name,
            configuration: Boolean(t.debug) ? "Debug" : "Release",
            debug: t.debug,
            module_name: e.binary.module_name,
            version: a.version,
            prerelease: a.prerelease.length ? a.prerelease.join(".") : "",
            build: a.build.length ? a.build.join(".") : "",
            major: a.major,
            minor: a.minor,
            patch: a.patch,
            runtime: s,
            node_abi: u(s, t.target),
            node_abi_napi: hi.get_napi_version(t.target) ? "napi" : u(s, t.target),
            napi_version: hi.get_napi_version(t.target),
            // non-zero numeric, undefined if unsupported
            napi_build_version: n || "",
            node_napi_label: n ? "napi-v" + n : u(s, t.target),
            target: t.target || "",
            platform: t.target_platform || process.platform,
            target_platform: t.target_platform || process.platform,
            arch: t.target_arch || process.arch,
            target_arch: t.target_arch || process.arch,
            libc: t.target_libc || Ti.family || "unknown",
            module_main: e.main,
            toolset: t.toolset || ""
        }, c = process.env["npm_config_" + l.module_name + "_binary_host_mirror"] || e.binary.host;
        l.host = f(d(c, l)), l.module_path = d(e.binary.module_path, l), 
        // now we resolve the module_path to ensure it is absolute so that binding.gyp variables work predictably
        t.module_root ? 
        // resolve relative to known module root: works for pre-binding require
        l.module_path = r.join(t.module_root, l.module_path) : 
        // resolve relative to current working directory: works for node-pre-gyp commands
        l.module_path = r.resolve(l.module_path), l.module = r.join(l.module_path, l.module_name + ".node"), 
        l.remote_path = e.binary.remote_path ? f(d(e.binary.remote_path, l)).replace(/\/\//g, "/") : "";
        var p = e.binary.package_name ? e.binary.package_name : "{module_name}-v{version}-{node_abi}-{platform}-{arch}.tar.gz";
        return l.package_name = d(p, l), l.staged_tarball = r.join("build/stage", l.remote_path, l.package_name), 
        l.hosted_path = i.resolve(l.host, l.remote_path), l.hosted_tarball = i.resolve(l.hosted_path, l.package_name), 
        l;
    };
})), Ri = (Ai.get_electron_abi, Ai.get_node_webkit_abi, Ai.get_node_abi, Ai.get_runtime_abi, 
Ai.validate_config, Ai.get_process_runtime, Ai.evaluate, v((function(e, t) {
    var i = n.existsSync || r.existsSync, o = r;
    e.exports = t, t.usage = "Finds the require path for the node-pre-gyp installed module", 
    t.validate = function(e, t) {
        Ai.validate_config(e, t);
    }, t.find = function(e, t) {
        if (!i(e)) throw new Error("package.json does not exist at " + e);
        var n, r = p();
        return Ai.validate_config(r, t), hi.get_napi_build_versions(r, t) && (n = hi.get_best_napi_build_version(r, t)), 
        (t = t || {}).module_root || (t.module_root = o.dirname(e)), Ai.evaluate(r, t, n).module;
    };
}))), Ci = (Ri.usage, Ri.validate, Ri.find, "node-pre-gyp@0.14.0"), Mi = "node-pre-gyp@0.14.0", Ni = "sha512-+CvDC7ZttU/sSt9rFjix/P05iS43qHCOOGzcr3Ry99bXG7VX953+vFyEuph/tfqoYu8dttBkE86JSKBO2OzcxA==", Ii = {}, Li = {
    type: "version",
    registry: !0,
    raw: "node-pre-gyp@0.14.0",
    name: "node-pre-gyp",
    escapedName: "node-pre-gyp",
    rawSpec: "0.14.0",
    saveSpec: null,
    fetchSpec: "0.14.0"
}, Pi = [ "/bcrypt" ], Di = "https://registry.npmjs.org/node-pre-gyp/-/node-pre-gyp-0.14.0.tgz", Bi = "9a0596533b877289bcad4e143982ca3d904ddc83", Ui = "node-pre-gyp@0.14.0", $i = "C:\\Users\\skinn\\OneDrive\\Documents\\GitHub\\Circuit-MUD\\v2\\server\\node_modules\\bcrypt", Gi = {
    name: "Dane Springmeyer",
    email: "dane@mapbox.com"
}, qi = {
    "node-pre-gyp": "bin/node-pre-gyp"
}, Wi = {
    url: "https://github.com/mapbox/node-pre-gyp/issues"
}, Fi = {
    "detect-libc": "^1.0.2",
    mkdirp: "^0.5.1",
    needle: "^2.2.1",
    nopt: "^4.0.1",
    "npm-packlist": "^1.1.6",
    npmlog: "^4.0.2",
    rc: "^1.2.7",
    rimraf: "^2.6.1",
    semver: "^5.3.0",
    tar: "^4.4.2"
}, Hi = "Node.js native addon binary install tool", zi = {
    "aws-sdk": "^2.28.0",
    jshint: "^2.9.5",
    nock: "^9.2.3",
    tape: "^4.6.3"
}, Yi = "https://github.com/mapbox/node-pre-gyp#readme", Vi = {
    node: !0,
    globalstrict: !0,
    undef: !0,
    unused: !1,
    noarg: !0
}, Ji = [ "native", "addon", "module", "c", "c++", "bindings", "binary" ], Zi = "./lib/node-pre-gyp.js", Qi = {
    type: "git",
    url: "git://github.com/mapbox/node-pre-gyp.git"
}, Xi = {
    pretest: "jshint test/build.test.js test/s3_setup.test.js test/versioning.test.js test/fetch.test.js lib lib/util scripts bin/node-pre-gyp",
    test: "jshint lib lib/util scripts bin/node-pre-gyp && tape test/*test.js",
    "update-crosswalk": "node scripts/abi_crosswalk.js"
}, Ki = {
    _from: Ci,
    _id: Mi,
    _inBundle: !1,
    _integrity: Ni,
    _location: "/node-pre-gyp",
    _phantomChildren: Ii,
    _requested: Li,
    _requiredBy: Pi,
    _resolved: Di,
    _shasum: Bi,
    _spec: Ui,
    _where: $i,
    author: Gi,
    bin: qi,
    bugs: Wi,
    bundleDependencies: !1,
    dependencies: Fi,
    deprecated: !1,
    description: Hi,
    devDependencies: zi,
    homepage: Yi,
    jshintConfig: Vi,
    keywords: Ji,
    license: "BSD-3-Clause",
    main: Zi,
    name: "node-pre-gyp",
    repository: Qi,
    scripts: Xi,
    version: "0.14.0"
}, eo = b( Object.freeze({
    __proto__: null,
    _from: Ci,
    _id: Mi,
    _inBundle: !1,
    _integrity: Ni,
    _location: "/node-pre-gyp",
    _phantomChildren: Ii,
    _requested: Li,
    _requiredBy: Pi,
    _resolved: Di,
    _shasum: Bi,
    _spec: Ui,
    _where: $i,
    author: Gi,
    bin: qi,
    bugs: Wi,
    bundleDependencies: !1,
    dependencies: Fi,
    deprecated: !1,
    description: Hi,
    devDependencies: zi,
    homepage: Yi,
    jshintConfig: Vi,
    keywords: Ji,
    license: "BSD-3-Clause",
    main: Zi,
    name: "node-pre-gyp",
    repository: Qi,
    scripts: Xi,
    version: "0.14.0",
    default: Ki
})), to = v((function(e, t) {
    /**
 * Module exports.
 */
    e.exports = t, 
    /**
 * Module dependencies.
 */
    vn.disableProgress();
    var i = u.EventEmitter, o = l.inherits, a = [ "clean", "install", "reinstall", "build", "rebuild", "package", "testpackage", "publish", "unpublish", "info", "testbinary", "reveal", "configure" ];
    function s() {
        var e = this;
        this.commands = {}, a.forEach((function(t) {
            e.commands[t] = function(n, r) {
                return vn.verbose("command", t, n), p()(e, n, r);
            };
        }));
    }
    // differentiate node-pre-gyp's logs from npm's
    vn.heading = "node-pre-gyp", t.find = Ri.find, o(s, i), t.Run = s;
    var c = s.prototype;
    /**
 * Export the contents of the package.json.
 */    c.package = eo, 
    /**
 * nopt configuration definitions
 */
    c.configDefs = {
        help: Boolean,
        // everywhere
        arch: String,
        // 'configure'
        debug: Boolean,
        // 'build'
        directory: String,
        // bin
        proxy: String,
        // 'install'
        loglevel: String
    }, 
    /**
 * nopt shorthands
 */
    c.shorthands = {
        release: "--no-debug",
        C: "--directory",
        debug: "--debug",
        j: "--jobs",
        silent: "--loglevel=silent",
        silly: "--loglevel=silly",
        verbose: "--loglevel=verbose"
    }, 
    /**
 * expose the command aliases for the bin file to use.
 */
    c.aliases = {}, 
    /**
 * Parses the given argv array and sets the 'opts',
 * 'argv' and 'command' properties.
 */
    c.parseArgv = function(e) {
        this.opts = k(this.configDefs, this.shorthands, e), this.argv = this.opts.argv.remain.slice();
        var t = this.todo = [];
        // create a copy of the argv array with aliases mapped
                // process the mapped args into "command" objects ("name" and "args" props)
        (e = this.argv.map((function(e) {
            // is this an alias?
            return e in this.aliases && (e = this.aliases[e]), e;
        }), this)).slice().forEach((function(n) {
            if (n in this.commands) {
                var r = e.splice(0, e.indexOf(n));
                e.shift(), t.length > 0 && (t[t.length - 1].args = r), t.push({
                    name: n,
                    args: []
                });
            }
        }), this), t.length > 0 && (t[t.length - 1].args = e.splice(0));
        // expand commands entries for multiple napi builds
        var i = this.opts.directory;
        null == i && (i = process.cwd());
        var o = JSON.parse(n.readFileSync(r.join(i, "package.json")));
        this.todo = hi.expand_commands(o, this.opts, t);
        Object.keys(process.env).forEach((function(e) {
            if (0 === e.indexOf("npm_config_")) {
                var t = process.env[e];
                "npm_config_loglevel" === e ? vn.level = t : 
                // avoid npm argv clobber already present args
                // which avoids problem of 'npm test' calling
                // script that runs unique npm install commands
                "argv" === (
                // add the user-defined options to the config
                e = e.substring("npm_config_".length)) && this.opts.argv && this.opts.argv.remain && this.opts.argv.remain.length || (this.opts[e] = t);
            }
        }), this), this.opts.loglevel && (vn.level = this.opts.loglevel), vn.resume();
    }, 
    /**
 * Returns the usage instructions for node-pre-gyp.
 */
    c.usage = function() {
        return [ "", "  Usage: node-pre-gyp <command> [options]", "", "  where <command> is one of:", a.map((function(e) {
            return "    - " + e + " - " + p().usage;
        })).join("\n"), "", "node-pre-gyp@" + this.version + "  " + r.resolve(__dirname, ".."), "node@" + process.versions.node ].join("\n");
    }, 
    /**
 * Version number getter.
 */
    Object.defineProperty(c, "version", {
        get: function() {
            return this.package.version;
        },
        enumerable: !0
    });
})), no = (to.find, to.Run, f.Promise), ro = function(e, t, n) {
    return Array.isArray(n) || (n = Array.prototype.slice.call(n)), "function" != typeof e ? no.reject(new Error("fn must be a function")) : new no((function(r, i) {
        n.push((function(e, t) {
            e ? i(e) : r(t);
        })), e.apply(t, n);
    }));
}, io = function(e) {
    return no.reject(e);
}, oo = v((function(e) {
    to.find(r.resolve(r.join(__dirname, "./package.json")));
    var t = p();
    /// generate a salt (sync)
    /// @param {Number} [rounds] number of rounds (default 10)
    /// @return {String} salt
    e.exports.genSaltSync = function(e, n) {
        // default 10 rounds
        if (e) {
            if ("number" != typeof e) throw new Error("rounds must be a number");
        } else e = 10;
        if (n) {
            if ("b" !== n && "a" !== n) throw console.log(n, typeof n), new Error('minor must be either "a" or "b"');
        } else n = "b";
        return t.gen_salt_sync(n, e, d.randomBytes(16));
    }, 
    /// generate a salt
    /// @param {Number} [rounds] number of rounds (default 10)
    /// @param {Function} cb callback(err, salt)
    e.exports.genSalt = function e(n, r, i) {
        var o;
        // if callback is first argument, then use defaults for others
                if ("function" == typeof arguments[0] ? (
        // have to set callback first otherwise arguments are overriden
        i = arguments[0], n = 10, r = "b") : "function" == typeof arguments[1] && (
        // have to set callback first otherwise arguments are overriden
        i = arguments[1], r = "b"), !i) return ro(e, this, [ n, r ]);
        // default 10 rounds
                if (n) {
            if ("number" != typeof n) 
            // callback error asynchronously
            return o = new Error("rounds must be a number"), process.nextTick((function() {
                i(o);
            }));
        } else n = 10;
        if (r) {
            if ("b" !== r && "a" !== r) return o = new Error('minor must be either "a" or "b"'), 
            process.nextTick((function() {
                i(o);
            }));
        } else r = "b";
        d.randomBytes(16, (function(e, o) {
            e ? i(e) : t.gen_salt(r, n, o, i);
        }));
    }, 
    /// hash data using a salt
    /// @param {String} data the data to encrypt
    /// @param {String} salt the salt to use when hashing
    /// @return {String} hash
    e.exports.hashSync = function(n, r) {
        if (null == n || null == r) throw new Error("data and salt arguments required");
        if ("string" != typeof n || "string" != typeof r && "number" != typeof r) throw new Error("data must be a string and salt must either be a salt string or a number of rounds");
        return "number" == typeof r && (r = e.exports.genSaltSync(r)), t.encrypt_sync(n, r);
    }, 
    /// hash data using a salt
    /// @param {String} data the data to encrypt
    /// @param {String} salt the salt to use when hashing
    /// @param {Function} cb callback(err, hash)
    e.exports.hash = function n(r, i, o) {
        var a;
        return "function" == typeof r ? (a = new Error("data must be a string and salt must either be a salt string or a number of rounds"), 
        process.nextTick((function() {
            r(a);
        }))) : "function" == typeof i ? (a = new Error("data must be a string and salt must either be a salt string or a number of rounds"), 
        process.nextTick((function() {
            i(a);
        }))) : 
        // cb exists but is not a function
        // return a rejecting promise
        o && "function" != typeof o ? io(new Error("cb must be a function or null to return a Promise")) : o ? null == r || null == i ? (a = new Error("data and salt arguments required"), 
        process.nextTick((function() {
            o(a);
        }))) : "string" != typeof r || "string" != typeof i && "number" != typeof i ? (a = new Error("data must be a string and salt must either be a salt string or a number of rounds"), 
        process.nextTick((function() {
            o(a);
        }))) : "number" == typeof i ? e.exports.genSalt(i, (function(e, n) {
            return t.encrypt(r, n, o);
        })) : t.encrypt(r, i, o) : ro(n, this, [ r, i ]);
    }, 
    /// compare raw data to hash
    /// @param {String} data the data to hash and compare
    /// @param {String} hash expected hash
    /// @return {bool} true if hashed data matches hash
    e.exports.compareSync = function(e, n) {
        if (null == e || null == n) throw new Error("data and hash arguments required");
        if ("string" != typeof e || "string" != typeof n) throw new Error("data and hash must be strings");
        return t.compare_sync(e, n);
    }, 
    /// compare raw data to hash
    /// @param {String} data the data to hash and compare
    /// @param {String} hash expected hash
    /// @param {Function} cb callback(err, matched) - matched is true if hashed data matches hash
    e.exports.compare = function e(n, r, i) {
        var o;
        return "function" == typeof n ? (o = new Error("data and hash arguments required"), 
        process.nextTick((function() {
            n(o);
        }))) : "function" == typeof r ? (o = new Error("data and hash arguments required"), 
        process.nextTick((function() {
            r(o);
        }))) : 
        // cb exists but is not a function
        // return a rejecting promise
        i && "function" != typeof i ? io(new Error("cb must be a function or null to return a Promise")) : i ? null == n || null == r ? (o = new Error("data and hash arguments required"), 
        process.nextTick((function() {
            i(o);
        }))) : "string" != typeof n || "string" != typeof r ? (o = new Error("data and hash must be strings"), 
        process.nextTick((function() {
            i(o);
        }))) : t.compare(n, r, i) : ro(e, this, [ n, r ]);
    }, 
    /// @param {String} hash extract rounds from this hash
    /// @return {Number} the number of rounds used to encrypt a given hash
    e.exports.getRounds = function(e) {
        if (null == e) throw new Error("hash argument required");
        if ("string" != typeof e) throw new Error("hash must be a string");
        return t.get_rounds(e);
    };
}));

oo.genSaltSync, oo.genSalt, oo.hashSync, oo.hash, oo.compareSync, oo.compare, oo.getRounds;

function ao(e, t) {
    let n = e;
    if (t.includes("\n")) t.split("\n").forEach(e => {
        let r = 0;
        for (let t = 0; t < Math.ceil(e.length / 60); t++) r++;
        for (let i = 0; i < Math.ceil(e.length / 60) + r; i++) {
            let r = 0;
            Math.floor((60 - t.substr(0, 60).length) % 2 == 0) || (r = 1), n += "|" + " ".repeat(Math.floor((60 - e.substr(0, 60).length) / 2 - r)) + e.substr(0, 60) + " ".repeat(Math.floor((60 - e.substr(0, 60).length) / 2 - r)) + "|\n", 
            e = e.substr(60, e.length);
        }
    }); else {
        console.log(t);
        let e = 0;
        for (let n = 0; n < Math.ceil(t.length / 60); n++) e++;
        for (let r = 0; r < Math.ceil(t.length / 60) + e; r++) {
            let e = 0;
            Math.floor((60 - t.substr(0, 60).length) / 2) % 2 != 0 && (e = 1), n += "|" + " ".repeat(Math.floor((60 - t.substr(0, 60).length) / 2)) + t.substr(0, 60) + " ".repeat(Math.floor((60 - t.substr(0, 60).length) / 2 - e)) + "|\n", 
            t = t.substr(60, t.length);
        }
    }
    return n;
}

class so {
    constructor() {
        this.stories = [], this.categories = [], this.hobbies = [], this.entities = [];
    }
    Story(e) {
        let t = new uo(e);
        return this.stories.push(t), t;
    }
    Category(e) {
        let t = new co(e);
        return this.categories.push(t), t;
    }
    Hobby(e) {
        let t = new ho(e);
        return this.categories.push(t), t;
    }
    Action(e, t) {
        return new fo(e, t);
    }
    Item(e) {
        return new po(e);
    }
}

class lo {
    constructor(e) {
        this.title = e, this.body = "", this.author = "", this.footer = "";
    }
}

class uo extends lo {
    constructor(e) {
        super(e);
    }
    editBody(e) {
        this.body = "", Array.isArray(e) && (this.body = e.join("\n"));
    }
    create(e, t) {
        if (t && null != e.categories.find(e => e.title == t)) {
            this.body = "";
            let n = e.categories.find(e => e.title == t);
            try {
                for (let e of n.parts) null != e && (this.body += e.text + "\n");
            } catch (e) {
                for (let e of n.actions) null != e && (this.body += e.name + "-" + e.description + "\n");
            }
        }
        let n = "";
        return n += "-".repeat(61) + "\n", n += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n", 
        n += "-".repeat(61) + "\n", n = ao(n, this.body), n += "-".repeat(61) + "\n", n;
    }
}

class co extends lo {
    constructor(e) {
        super(e), this.parts = [];
    }
    addParts(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) {
            let n = {
                text: e[t]
            };
            this.parts.push(n);
        } else {
            let t = {
                text: e
            };
            this.parts.push(t);
        }
    }
    removeParts(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) for (let n = 0; n < this.parts.length; n++) this.parts[n].id == e[t] && this.parts.splice(n, 1); else for (let t = 0; t < this.parts.length; t++) this.parts[t].id == e && this.parts.splice(t, 1);
    }
    addHobbies(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) this.parts.push(e.title); else this.parts.push(e.title);
    }
    create(e, t) {
        if (t && null != e.categories.find(e => e.title == t)) {
            this.body = "";
            let n = e.categories.find(e => e.title == t);
            try {
                for (let e of n.parts) null != e && (this.body += e.text + "\n");
            } catch (e) {
                for (let e of n.actions) null != e && (this.body += e.name + "-" + e.description + "\n");
            }
        }
        let n = "";
        return n += "-".repeat(61) + "\n", n += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n", 
        n += "-".repeat(61) + "\n", n = ao(n, this.body), n += "-".repeat(61) + "\n", n;
    }
}

class ho extends lo {
    constructor(e) {
        super(e), this.actions = [];
    }
    addAction(e) {
        this.actions.push(e);
    }
    executeAction(e) {
        this.actions.find(t => t.name == e).execute();
    }
}

class fo {
    constructor(e, t) {
        this.name = e, this.description = t;
    }
    addLife(e) {
        this.code = e;
    }
    execute(...e) {
        e ? this.code(e) : this.code;
    }
}

class po {
    constructor(e) {
        this.name = e;
    }
}

// Modules
let vo = new class {
    constructor() {
        this.events = {};
    }
    on(e, t) {
        this.events[e] = t;
    }
    listen(e, n) {
        if (!this.events.connect) throw new Error("Missing connect event binding!");
        if (!this.events.data) throw new Error("Missing data event binding!");
        if (!this.events.error) throw new Error("Missing error event binding!");
        this.server = new t.Server(e => {
            e.on("connect", () => {
                this.events.connect(e);
            }), e.on("data", t => {
                this.events.data(e, t);
            }), e.on("error", t => {
                this.events.error(e, t);
            });
        }), n ? this.server.listen(e, n) : this.server.listen(e);
    }
}, bo = new class {
    file(e) {
        return n.readFileSync(e);
    }
    json(e) {
        return JSON.parse(n.readFileSync(e));
    }
}, go = new class {
    encrypt(e) {
        return oo.hashSync(e, 7);
    }
    compare(e, t) {
        return oo.compareSync(e, t);
    }
}, _o = bo.json("./config/admins.json").admins, mo = bo.json("./config/database.json"), yo = bo.json("./config/worlds.json"), wo = bo.json("./config/config.json").ores, Eo = new so, ko = Eo.Story("Circuit MUD");

ko.editBody([ "Welcome to Circuit MUD", "Please login with command: login <username> <password> | or create using: create <username> <password>", 'Type "help" for commands' ]);

let So = Eo.Story("Help Menu");

So.editBody([ "Command Categories are as follows: ", "Pathways", "Communication", "Hobbies" ]);

let xo = Eo.Category("Pathways"), jo = Eo.Category("Communication"), To = Eo.Category("Hobbies"), Oo = Eo.Hobby("Mining"), Ao = Eo.Action("mine", "mines things around you");

Ao.addLife((...e) => {
    let t = mo.users.find(t => t.username == e[0][0]), n = function(e) {
        let t;
        return yo[Uo(e).currentWorld].map.forEach(n => {
            n.forEach(n => {
                n.pos.x == Uo(e).pos.x && n.pos.y == Uo(e).pos.y && (t = n);
            });
        }), t;
    }(t.username), r = [];
    Object.keys(n.resources).forEach(e => {
        r.push(e);
    }), r.forEach(r => {
        if (wo[r].hardness <= t.tools.pickaxe && n.resources.hasOwnProperty(r) && n.resources[r].count > 0) {
            let i = Math.floor(2 * Math.random());
            n.resources[r].count - i > 0 && (t.ores[r] += i, n.resources[r].count -= i, i > 0 && Io(e[0][1], `You have obtained ${r}`));
        }
    });
}), Oo.addAction(Ao);

// Crafting
let Ro = Eo.Hobby("Crafting"), Co = Eo.Hobby("Fighting");

// Fighting
xo.addParts([ "exit - Exit's the connection", "logout - Logs out of the server" ]), 
jo.addParts([ "say - speaks to other players", "whisper - whispers to another player privately", "announce - speak to the whole server" ]), 
To.addParts([ "Type help <hobby> for commands on hobby" ]), To.addHobbies([ Oo, Ro, Co ]);

let Mo = [];

function No(e) {
    for (let t of Mo) if (t.client == e) return t.username;
}

function Io(e, t) {
    try {
        client.write(t + "\r\n");
    } catch (e) {}
}

function Lo(e, t) {
    if (t) switch (t.option) {
      case "world":
        Mo.forEach(n => {
            if (n.world == t.world) try {
                n.client.write(e + "\n");
            } catch (e) {}
            Po(e + "\n");
        });
    } else Mo.forEach(t => {
        t = t.client;
        try {
            t.write(e + "\r\n");
        } catch (e) {}
    }), Po(e + "\n");
}

function Po(e) {
    fs.appendFile("./logs.txt", e + "\n", () => {
        console.log(`Logged data => ${e}`);
    });
}

function Do() {
    var e = new Date, t = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds());
    return new Date(t).toISOString();
}

function Bo() {
    fs.writeFile("./database.json", JSON.stringify(mo, null, 4), () => {}), fs.writeFile("./worlds.json", JSON.stringify(yo, null, 4), () => {});
}

// Autosave
function Uo(e) {
    return mo.users.find(t => t.username == e);
}

vo.on("connect", e => {
    e.write(ko.create());
}), vo.on("data", (e, t) => {
    let n, r = (t = Buffer.from(t, "utf-8").toString()).split(" "), i = r[0], o = r.splice(1, r.length), a = !1;
    // Login & Create System
    if (1 == a && function(e) {
        return !!_o.find(t => t == e);
    }(n)) switch (i) {
      case "save":
        Bo(), Lo("Game has been saved. ");
    }
    if (0 == a) switch (i) {
      case "login":
        if (mo.users.find(e => e.username == o[0])) {
            let t = 0;
            for (let r = 0; r < mo.users.length; r++) if (go.compare(o[1], mo.users[r].password)) {
                a = !0, n = o[0];
                let t = Eo.Story("Logged in");
                t.editBody([ "Username: " + o[0] ]), Io(e, t.create()), Mo.find(e => e.username == n) || Mo.push({
                    username: o[0],
                    client: e,
                    world: Uo(o[0]).currentWorld
                }), Lo(`User [${No(e)}] has connected to the server! \n${Mo.length} users are online | ${Do()}`);
            } else t++;
            t > 0 && Io(e, "You have used the wrong credentials. Please try again. ");
        } else Io(e, "That user does not exist. Please create an account. ");
        break;

      case "create":
        if (mo.users.find(e => e.username == o[0])) Io(e, "That user exists"); else {
            let t = {
                username: o[0],
                password: go.encrypt(o[1]),
                ores: {
                    coal: 0,
                    iron: 0,
                    gold: 0,
                    titanium: 0,
                    uranium: 0,
                    copper: 0,
                    aluminum: 0,
                    tin: 0,
                    silver: 0,
                    lead: 0,
                    zinc: 0,
                    platinum: 0,
                    palladium: 0,
                    nickel: 0
                },
                lastMined: Date.now(),
                tools: {
                    pickaxe: 1,
                    axe: 1,
                    hoe: 1,
                    spade: 1
                },
                currentWorld: "Cyber City",
                pos: {
                    x: 5,
                    y: 0
                }
            };
            mo.users.push(t), fs.writeFile("./database.json", JSON.stringify(mo, 4, null), () => {});
            let r = Eo.Story("Created User");
            r.editBody([ "Username: " + t.username, "Password: " + t.password ]), Io(e, r.create()), 
            a = !0, n = o[0], Mo.find(e => e.username == n) || Mo.push({
                username: o[0],
                client: e,
                world: "main"
            }), Lo(`[${No(e)}] has connected to the server for the first time! Please welcome them! \n${Mo.length} users are online | ${Do()}`);
        }

      case "exit":
        client.end();
    } else switch (Po(`${No(e)} executed: ${i}:${o.join(" ")}`), i) {
      case "exit":
        client.end();
        break;

      case "help":
        Io(e, o ? So.create(Eo, o) : So.create());
        break;

      case "joinWorld":
        for (let e of Object.keys(yo)) if (e == o.join(" ")) {
            yo[e].map.forEach(e => {
                e.forEach(e => {
                    e.pos.x == Uo(n).pos.x && e.pos.y == Uo(n).pos.y && (Lo(`${Uo(n).username} has left ${Uo(n).currentWorld}`, {
                        option: "world",
                        world: Uo(n).currentWorld
                    }), Uo(n).currentWorld = o.join(" "), Mo.find(e => e.username == n).world = o.join(" "), 
                    Lo(`${Uo(n).username} has joined ${Uo(n).currentWorld}`, {
                        option: "world",
                        world: Uo(n).currentWorld
                    }));
                });
            });
        }
        break;

      case "logout":
        a = !1, n = null, Io(e, "Logged out successfully!");
        break;

      case "say":
        Lo(`{${Uo(n).currentWorld}} [${No(e)}]: ${o.join(" ")} | ${Do()}`, {
            option: "world",
            world: Uo(n).currentWorld
        }), Po(`Message Sent: {${Uo(n).currentWorld}} [${No(e)}]: ${o.join(" ")} | ${Do()}`);
        break;

      case "announce":
        Lo(`Announcement > [${No(e)}]: ${o.join(" ")} | ${Do()}`), Po(`Message Announced: [${No(e)}]: ${o.join(" ")} | ${Do()}`);
        break;

      case "mine":
        Date.now() - Uo(n).lastMined >= 5e3 ? (Ao.execute(n, client), Uo(n).lastMined = Date.now()) : Io(e, "You can't mine right now, please wait " + Math.floor((5e3 - (Date.now() - Uo(n).lastMined)) / 1e3) + " seconds");
        break;

      case "stats":
        let t = Eo.Story("Stats");
        t.editBody(function(e, t, n) {
            let r = [], i = [];
            return Object.keys(e).forEach(e => {
                r.push(e);
            }), r.forEach(r => {
                t ? n ? i.push(`${e[r][n]} | ${t}: ${e[r][t]}`) : i.push(`${r} | ${t}: ${e[r][t]}`) : n ? i.push(`${e[r][n]}: ${e[r]}`) : i.push(`${r}: ${e[r]}`);
            }), i;
        }(Uo(n).ores)), Io(e, t.create());
        break;

      case "go":
        let r, i;
        switch (o[0]) {
          case "north":
            i = -1;
            break;

          case "east":
            r = 1;
            break;

          case "south":
            i = 1;
            break;

          case "west":
            r = -1;
        }
        let s = Uo(n).pos;
        s.x + r >= 0 && s.x + r < 10 && (s.y += r), s.y + i >= 0 && s.y + i < 10 && (s.y += i), 
        Bo();
        break;

      case "online":
        if (o) {
            let t;
            switch (o[0]) {
              case "server":
                t = Eo.Story("Online users in Server"), t.editBody([ `Total Users: ${Mo.length}` ].concat(Mo.map(e => e.username))), 
                Io(e, t.create());
                break;

              case "world":
                t = Eo.Story("Online users in World");
                let r = [];
                Mo.forEach(e => {
                    e.world == Uo(n).currentWorld && r.push(e.username);
                }), t.editBody([ `Total Users: ${r.length}` ].concat(r)), Io(e, t.create());
            }
        } else {
            let t = so.Story("Online users in Server");
            t.editBody([ `Total Users: ${Mo.length}` ].concat(Mo)), Io(e, t.create());
        }
    }
}), vo.on("error", (e, t) => {
    err && console.log(err);
}), vo.on("end", e => {
    let t = No(e);
    if (t) {
        for (let e = 0; e < Mo.length; e++) {
            Mo[e].username == t && Mo.splice(e, 1);
        }
        Lo(`[${No(e)}] has left the server. ${Mo.length} users remaining`);
    }
}), setInterval(() => {
    fs.writeFile("./database.json", JSON.stringify(mo, null, 4), () => {}), fs.writeFile("./worlds.json", JSON.stringify(yo, null, 4), () => {}), 
    Lo("Game has been saved!");
}, 3e5), setInterval(() => {
    for (let e of Object.keys(yo)) {
        let t = yo[e];
        t.map.forEach(e => {
            e.forEach(e => {
                Object.values(e.resources).forEach(e => {
                    e.count += Math.floor(10 * Math.random());
                });
            });
        }), Lo(`${e} has been regenerated! Start finding ore!`, {
            option: "world",
            world: t
        });
    }
    Bo();
}, 149400), vo.listen(23, () => {
    console.log("listening on port 23");
});
