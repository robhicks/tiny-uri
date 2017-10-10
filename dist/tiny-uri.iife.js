var TinyUri = (function () {
'use strict';

/**
 * Class to manage URL paths
 */
var Path = function Path(f, ctx) {
  if ( ctx === void 0 ) ctx = {};

  this.ctx = ctx;
  this._path = [];
  return this.parse(f);
};

/**
 * Append to a path
 * @param {string} s path to append
 * @return {instance} for chaining
 */
Path.prototype.append = function append (s) {
  this._path.push(s);
  return this.ctx;
};

/**
 * Delete end of path
 * @param {integer} loc - segment of path to delete
 * @return {instance} for chaining
 */
Path.prototype.delete = function delete$1 (loc) {
  if (!loc) {
    this._path.pop();
    return this.ctx;
  }
};

/**
 * Get the path
 * @return {array} path as array
 */
Path.prototype.get = function get () {
  return this._path;
};

/**
 * Parse the path part of a URl
 * @param {string} f - string path
 * @return {instance} for chaining
 */
Path.prototype.parse = function parse (f) {
    if ( f === void 0 ) f = '';

  var path = decodeURIComponent(f);
  var split = path.split('/');
  if (Array.isArray(split)) {
    if(path.match(/^\//)) { split.shift(); }
    if (split[0] === '') { split.shift(); }
    if (split.length > 1 && path.match(/\/$/)) { split.pop(); }
    this._path = split;
  }
  return this;
};

/**
 * Replace part of a path
 * @param {string} f - path replacement
 * @param {integer} loc - location to replace
 * @return {instance} for chaining
 */
Path.prototype.replace = function replace (f, loc) {
  if (loc === 'file') {
    this._path.splice(this._path.length - 1, 1, f);
    return this.ctx;
  } else if (Number.isInteger(loc)) {
    this._path.splice(loc, 1, f);
    return this.ctx;
  }
  this.parse(f);
  return this.ctx;
};

/**
 * Get string representatio of the path or the uri
 * @param {boolen} uri - if true return string represention of uri
 * @return {string} path or uri as string
 */
Path.prototype.toString = function toString (uri) {
  if (uri) { return this.ctx.toString(); }
  return Array.isArray(this._path) ? this._path.join('/') : '';
};

/**
 * Class to manage query part of URL
 */
var Query = function Query(f, ctx) {
  if ( ctx === void 0 ) ctx = {};

  Object.assign(this, ctx);
  this.ctx = ctx;
  this.set(f);
  return this;
};

/**
 * Add a query string
 * @param {object} obj {name: 'value'}
 * @return {instance} for chaining
 */
Query.prototype.add = function add (obj) {
    if ( obj === void 0 ) obj = {};

  this._query = this._convert(obj, this._query[0], this._query[1]);
  return this.ctx;
};

/**
 * Remove the query string
 * @return {instance} for chaining
 */
Query.prototype.clear = function clear () {
  this._query = [[], []];
  return this.ctx;
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

/**
 * Get the query string
 * @return {array} representing the query string
 */
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

Query.prototype.getUrlTemplateQuery = function getUrlTemplateQuery () {
  return this._urlTemplateQueryString;
};

/**
 * Merge with the query string - replaces query string values if they exist
 * @param {object} obj {name: 'value'}
 * @return {instance} for chaining
 */
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
  return this.ctx;
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

/**
 * Set with the query string - replaces existing query string
 * @param {obj} or {string} ...q
 * @return {instance} for chaining
 */
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
  return this.ctx;
};

/**
 * Set the url template query string vale
 * @param {string} url-template query string
 * @return {instance} for chaining
 */
Query.prototype.setUrlTemplateQuery = function setUrlTemplateQuery (s) {
  this._urlTemplateQueryString = s;
};

/**
 * Get string representatio of the path or the uri
 * @param {boolen} uri - if true return string represention of uri
 * @return {string} query or uri as string
 */
Query.prototype.toString = function toString (uri) {
  if (uri) { return this.ctx.toString(); }
  var pairs = [];
  var n = this._query[0];
  var v = this._query[1];

  for(var i = 0; i < n.length; i++) {
    pairs.push(encodeURIComponent(n[i]) + '=' + encodeURIComponent(v[i]));
  }
  return pairs.join('&');
 };

/**
 * Class to make it easier to build strings
 */
var StringBuilder = function StringBuilder(string) {
  if (!string || typeof string === 'undefined') { this.string = String(""); }
  else { this.string = String(string); }
};

/**
 * Return full string
 * @return {string} assembled string
 */
StringBuilder.prototype.toString = function toString () {
  return this.string;
};

/**
 * Append a string to an existing string
 * @param {string} val - string to be appended
 * @return {instance} for chaining
 */
StringBuilder.prototype.append = function append (val) {
  this.string += val;
  return this;
};

/**
 * Insert a string to an existing string
 * @param {integer} pos - position at which to insert value
 * @param {string} val - string to be inserted
 * @return {instance} for chaining
 */
StringBuilder.prototype.insert = function insert (pos, val) {
  var length = this.string.length;
  var left = this.string.slice(0, pos);
  var right = this.string.slice(pos);
  this.string = left + val + right;
  return this;
};

/**
 * Uri - manipulate URLs
 */
var TinyUri = function TinyUri(uri) {
  this.uriRegEx = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
  this.authRegEx = /^([^\@]+)\@/;
  this.portRegEx = /:(\d+)$/;
  this.qRegEx = /^([^=]+)(?:=(.*))?$/;
  this.urlTempQueryRegEx = /\{\?(.*?)\}/;
  return this.parse(uri);
};

/**
 * @param {string} authority - username password part of URL
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.authority = function authority (authority) {
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
    this.host(authority.replace('{', ''));
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

/**
 * @param {string} f - string representation of fragment
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.fragment = function fragment (f) {
    if ( f === void 0 ) f = '';

  return this.gs(f, '_fragment');
};

TinyUri.prototype.gs = function gs (val, tar, fn) {
  if (typeof val !== 'undefined') {
    this[tar] = val;
    return this;
  }
  return fn ? fn(this[tar]) : this[tar] ? this[tar] : '';
};

/**
 * @param {string} f - string representation of host
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.host = function host (f) {
  return this.gs(f, '_host');
};

/**
 * @param {string} uri - URL
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.parse = function parse (uri) {
  var f = uri ? uri.match(this.uriRegEx) : [];
  var t = uri ? uri.match(this.urlTempQueryRegEx) : [];
  this.scheme(f[2]);
  this.authority(f[4]);
  this.path = new Path(f[5].replace(/{$/, ''), this);
  this.fragment(f[9]);
  this.query = new Query(f[7], this);
  if (t) { this.query.setUrlTemplateQuery(t[1]); }
  return this;
};

/**
 * @param {string} f - port part of URL
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.port = function port (f) {
  return this.gs(f, '_port');
};

/**
 * @param {string} f - protocol part of URL
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.protocol = function protocol (f) {
  return this.scheme.toLowerCase();
};

/**
 * @param {string} f - protocol scheme
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.scheme = function scheme (f) {
  return this.gs(f, '_scheme');
};

/**
 * @param {string} f - user info part of URL
 * @return {instance} - returns Uri instance for chaining
 */
TinyUri.prototype.userInfo = function userInfo (f) {
  return this.gs(f, '_userinfo', function (r) {
    return r ? encodeURI(r) : r;
  });
};

/**
 * @return {string} - returns string URL
 */
TinyUri.prototype.toString = function toString () {
  var q = this.query.toString();
  var p = this.path.toString();
  var f = this.fragment();
  var s = this.scheme();
  var str = new StringBuilder();
  var retStr = str.append(s ? s + '://' : "")
    .append(this.authority())
    .append('/').append(p)
    .append(q !== '' ? '?' : '')
    .append(q)
    .toString()
    .replace('/?', '?')
    .replace(/\/$/, '');
  return retStr;
};

TinyUri.clone = function clone (uri) {
  return new TinyUri(uri.toString());
};

return TinyUri;

}());
