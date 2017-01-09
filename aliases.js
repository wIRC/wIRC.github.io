BSIdent.prototype.js = function (code) { return eval(code); };
BSIdent.prototype.true = function () { return true; };
BSIdent.prototype.false = function () { return false; };
BSIdent.prototype.iif = function (a, b, c) { return (eval(BSParser.parseBooleanExpressionSource(a)) ? b : c) || ''; }; // todo: this is ugly
BSIdent.prototype.idle = function () { return Math.round((Date.now() - this.server.lastInputTime) / 1000); };
BSIdent.prototype.serverIdent = function () { return this.server.hostname; };

// Text and Number Identifiers
BSIdent.prototype.abs = function (n) { return Math.abs(n); };
BSIdent.prototype.and = function (a, b) { return a && b; };
BSIdent.prototype.asc = function (c) { return c.charCodeAt(0); };
BSIdent.prototype.base = function (n, inbase, outbase, zeropad, precision) {
    return parseInt(n, inbase).toString(outbase);
};
BSIdent.prototype.calc = function (operations) { return eval(operations); }; // todo: proper parsing
BSIdent.prototype.ceil = function (n) { return Math.ceil(n); };
BSIdent.prototype.chr = function (n) { return String.fromCharCode(n); };
BSIdent.prototype.cos = function (n) { return Math.cos(n); };
BSIdent.prototype.acos = function (n) { return Math.acos(n); };
BSIdent.prototype.floor = function (n) { return Math.floor(n); };
BSIdent.prototype.int = function (n) { return Math.trunc(n); };
BSIdent.prototype.islower = function (text) { return text === text.toLowerCase(); };
BSIdent.prototype.isupper = function (text) { return text === text.toUpperCase(); };
BSIdent.prototype.left = function (text, n) { return n > 0 ? text.slice(0, n) : text.slice(n); };
BSIdent.prototype.len = function (text) { return text.length; };
BSIdent.prototype.log = function (n) { return Math.log(n); };
BSIdent.prototype.longip = function (address) {
    var ipAddressRegEx = /^(\d{0,3}\.){3}.(\d{0,3})$|^(\d{0,3}\.){5}.(\d{0,3})$/;
    var valid = ipAddressRegEx.test(address);
    if (!valid) return false;
    var dots = address.split('.');
    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        if (dot > 255 || dot < 0) return false;
    }
    if (dots.length == 4) {
        return ((((((+dots[0])*256)+(+dots[1]))*256)+(+dots[2]))*256)+(+dots[3]);
    } else if (dots.length == 6) {
        return ((((((((+dots[0])*256)+(+dots[1]))*256)+(+dots[2]))*256)+(+dots[3])*256)+(+dots[4])*256)+(+dots[5]);
    }
    return false;
}
BSIdent.prototype.lower = function (text) { return text.toLowerCase(); };
BSIdent.prototype.mid = function (text, s, n) { return text.substr(s, n); };
BSIdent.prototype.not = function (a) { return !a; };
BSIdent.prototype.or = function (a, b) { return a || b; };
BSIdent.prototype.ord = function (n) {
    var e = Math.floor(Number(n) / 10) % 10 != 1 ? Number(n) % 10 : 0;
    return n + (e == 1 ? 'st' : (e == 2 ? 'nd' : (e == 3 ? 'rd' : 'th')));
};
BSIdent.prototype.qt = function (text) { return '"'+ text + '"'; };
BSIdent.prototype.noqt = function (text) { return text.replace(/^"|"$/g, ''); };
BSIdent.prototype.rand = function (v1, v2) {
    v1 = Number(v1); v2 = Number(v2);
    return Math.floor(Math.random() * (v2 - v1 + 1) + v1); };
BSIdent.prototype.remove = function (string, substring) {
    for (var i = 1; i < arguments.length; i++) string = string.replace(arguments[i], '');
    return string;
};
BSIdent.prototype.right = function (text, n) { return n > 0 ? text.slice(-n) : text.slice(0, -n); };
BSIdent.prototype.round = function (n, d) {
    var p = Math.pow(10, d || 0);
    return Math.round(Number(n) * p) / p;
};
BSIdent.prototype.sin = function (n) { return Math.sin(n); };
BSIdent.prototype.asin = function (n) { return Math.asin(n); };
BSIdent.prototype.strip = function (text) { return text.replace(/[]/g, ''); };
BSIdent.prototype.tan = function (n) { return Math.tan(n); };
BSIdent.prototype.atan = function (n) { return Math.atan(n); };
BSIdent.prototype.upper = function (text) { return text.toUpperCase(); };
BSIdent.prototype.xor = function (a, b) { return a ? !b : b; };

// Time and Date Identifiers
BSIdent.prototype.ctime = function (text) {
    return Math.floor((text == undefined ? Date.now() : (new Date(text)).getTime()) / 1000);
};

// Regular Expressions
BSIdent.parseRegExp = function (reg) {
    var match = reg.match(/^\/(.*)\/([^\/]*)$/);
    return match ? new RegExp(match[1], match[2]) : RegExp(reg);
};
BSIdent.regexMatches = {};
BSIdent.prototype.regex = function (name, text, reg) {
    if (arguments.length == 2) { reg = text; text = name; name = '_last'; }
    var result = BSIdent.regexMatches[name] = text.match(BSIdent.parseRegExp(reg));
    return result ? result.length : 0;
};
BSIdent.prototype.regml = function (name, N) {
    if (arguments.length == 1) { N = name; name = '_last'; }
    return N ? (BSIdent.regexMatches[name] && BSIdent.regexMatches[name][N] || '') :
        (BSIdent.regexMatches[name] ? BSIdent.regexMatches[name].length : 0);
};

// Custom
BSIdent.prototype.max = Math.max;
BSIdent.prototype.min = Math.min;
