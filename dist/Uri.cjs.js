'use strict';

var Path = function Path(f, ctx) {
  if ( ctx === void 0 ) ctx = {};

  Object.assign(this, ctx);
  var path = decodeURIComponent(f);
  var split = path.split('/');
  if (Array.isArray(split)) {
    if(path.match(/^\//)) { split.shift(); }
    if (split.length > 1 && path.match(/\/$/)) { split.pop(); }
    this._path = split;
  }
  return this;
};

Path.prototype.toString = function toString () {
  return Array.isArray(this._path) ? this._path.join('/') : '';
};

var Query = function Query(f, ctx) {
  if ( ctx === void 0 ) ctx = {};

  Object.assign(this, ctx);
  this.set(f);
  return this;
};

Query.prototype.add = function add (obj) {
    if ( obj === void 0 ) obj = {};

  this._query = this._convert(obj, this._query[0], this._query[1]);
  return this;
};

Query.prototype.clear = function clear () {
  this._query = [[], []];
  return this;
};

Query.prototype._convert = function _convert (obj, p, q) {
    if ( p === void 0 ) p = [];
    if ( q === void 0 ) q = [];

  for (var key in obj) {
    if (Array.isArray(obj[key])) {
      for (var i = 0; i < obj[key].length; i++) {
        var val = obj[key][i];
        p.push(key);
        q.push(val);
      }
    } else if(obj[key]) {
      p.push(key);
      q.push(obj[key]);
    }
  }
  return [p, q];
};

Query.prototype.get = function get () {
  var dict = {};
  var obj = this._query;

  for (var i = 0; i < obj[0].length; i++) {
    var k = obj[0][i];
    var v = obj[1][i];
    if (dict[k]) {
      dict[k].push(v);
    } else {
      dict[k] = [v];
    }
  }
  return dict;
};

Query.prototype.merge = function merge (obj) {
  var p = this._query[0];
  var q = this._query[1];
  for (var key in obj) {
    var kset = false;

    for(var i=0; i < p.length; i++) {
      var xKey = p[i];
      if(key === xKey) {
        if(kset) {
          p.splice(i,1);
          q.splice(i,1);
          continue;
        }
        if (Array.isArray(obj[key])) {
          q[i] = obj[key].shift();
        } else if (typeof obj[key] === 'undefined' || obj[key] === null) {
          p.splice(i, 1);
          q.splice(i, 1);
          delete obj[key];
        } else {
          q[i] = obj[key];
          delete obj[key];
        }
        kset = true;
      }
    }
  }
  this._query = this._convert(obj, this._query[0], this._query[1]);
  return this;
};

Query.prototype._parse = function _parse (q) {
    var this$1 = this;
    if ( q === void 0 ) q = '';

  var struct = [[], []];
  var pairs = q.split(/&|;/);

  for (var j = 0; j < pairs.length; j++) {
    var name = (void 0), value = (void 0), pair = pairs[j], nPair = pair.match(this$1.qRegEx);

    if(nPair && typeof nPair[nPair.length -1] !== 'undefined') {
      nPair.shift();
      for (var i = 0; i < nPair.length; i++) {
        var p = nPair[i];
        struct[i].push(decodeURIComponent(p.replace('+', ' ', 'g')));
      }
    }
  }
  return struct;
};

Query.prototype.set = function set () {
    var q = [], len = arguments.length;
    while ( len-- ) q[ len ] = arguments[ len ];

  var args = [].concat( q );

  if (args.length === 1) {
    if (typeof args[0] === 'object') {
      this._query = this._convert(args[0]);
    } else {
      this._query = this._parse(args[0]);
    }
  } else if (args.length === 0) {
    this.clear();
  } else {
    var obj = {};
    obj[args[0]] = args[1];
    this.merge(obj);
  }
  return this;
};

Query.prototype.toString = function toString () {
  var pairs = [];
  var n = this._query[0];
  var v = this._query[1];

  for(var i = 0; i < n.length; i++) {
    pairs.push(encodeURIComponent(n[i]) + '=' + encodeURIComponent(v[i]));
  }
  return pairs.join('&');
 };

var StringBuilder = function StringBuilder(string) {
  if (!string || typeof string === 'undefined') { this.string = String(""); }
  else { this.string = String(string); }
};
StringBuilder.prototype.toString = function toString () {
  return this.string;
};
StringBuilder.prototype.append = function append (val) {
  this.string += val;
  return this;
};
StringBuilder.prototype.insert = function insert (pos, val) {
  var length = this.string.length;
  var left = this.string.slice(0,pos);
  var right = this.string.slice(pos);
  this.string = left + val + right;
  return this;
};

var Uri = function Uri(uri) {
  this.uriRegEx = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
  this.authRegEx = /^([^\@]+)\@/;
  this.portRegEx = /:(\d+)$/;
  this.qRegEx = /^([^=]+)(?:=(.*))?$/;
  return this.parse(uri);
};

Uri.prototype.authority = function authority (authority) {
    if ( authority === void 0 ) authority = '';

  if (authority !== '') {
    var auth = authority.match(this.authRegEx);
    this._authority = authority;
    if (auth) {
      authority = authority.replace(this.authRegEx, '');
      this.userInfo(auth[1]);
    }
    var port = authority.match(this.portRegEx);
    if(port) {
      authority = authority.replace(this.portRegEx, '');
      this.port(port[1]);
    }
    this.host(authority);
    return this;
  } else {
    var userinfo = this.userInfo();
    if (userinfo) { authority = userinfo + '@'; }
    authority += this.host();
    var port$1 = this.port();
    if (port$1) { authority += ':' + port$1; }
    return authority;
  }
};

Uri.prototype.fragment = function fragment (f) {
    if ( f === void 0 ) f = '';

  if (f !== '') { return this.gs(f, '_fragment'); }
  return this._fragment;
};

Uri.prototype.gs = function gs (val, tar, fn) {
  if (typeof val !== 'undefined') {
    this[tar] = val;
    return this;
  }
  return fn ? fn(this[tar]) : this[tar];
};

Uri.prototype.host = function host (f) {
  if (f) { return this.gs(f, '_host'); }
  return this._host;
};

Uri.prototype.parse = function parse (uri) {
  var f = uri ? uri.match(this.uriRegEx) : [];
  this.path = new Path(f[5], this);
  this.scheme(f[2]);
  this.authority(f[4]);
  this.fragment(f[9]);
  this.query = new Query(f[7], this);
  return this;
};

Uri.prototype.port = function port (f) {
  return this.gs(f, '_port');
};

Uri.prototype.protocol = function protocol (f) {
  return this.scheme.toLowerCase();
};

Uri.prototype.scheme = function scheme (f) {
  if (f) { return this.gs(f, '_scheme'); }
  return this._scheme;
};

Uri.prototype.userInfo = function userInfo (f) {
  return this.gs(f, '_userinfo', function (r) {
    return r ? encodeURI(r) : r;
  });
};

Uri.prototype.toString = function toString () {
  var q = this.query.toString();
  var p = this.path.toString();
  var f = this.fragment();
  var s = this.scheme();
  var str = new StringBuilder();
  return str.append(s ? s + '://' : "").append(this.authority()).append('/').append(p).append('?').append(q).toString();
};

module.exports = Uri;
