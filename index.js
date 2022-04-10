'use strict';

/**
 * Class to manage URL paths
 */
class Path {
  /**
   * @param {string} f - string path
   * @param {object} ctx - context of Uri class
   */
  constructor(f, ctx = {}) {
    this.ctx = ctx;
    this._path = [];
    return this.parse(f);
  }

  /**
   * Append to a path
   * @param {string} s path to append
   * @return {instance} for chaining
   */
  append(s) {
    this._path.push(s);
    return this.ctx;
  }

  /**
   * Delete end of path
   * @param {integer} loc - segment of path to delete
   * @return {instance} for chaining
   */
  delete(loc) {
    if (Array.isArray(loc)) {
      loc.reverse().forEach(l => this._path.splice(l, 1));
    } else if (Number.isInteger(loc)) {
      this._path.splice(loc, 1);
    } else {
      this._path.pop();
    }
    return this.ctx;
  }

  /**
   * Get the path
   * @return {array} path as array
   */
  get() {
    return this._path;
  }

  /**
   * Parse the path part of a URl
   * @param {string} f - string path
   * @return {instance} for chaining
   */
  parse(f = '') {
    let path = decodeURIComponent(f);
    let split = path.split('/');
    if (Array.isArray(split)) {
      if(path.match(/^\//)) split.shift();
      if (split[0] === '') split.shift();
      if (split.length > 1 && path.match(/\/$/)) split.pop();
      this._path = split;
    }
    return this;
  }

  /**
   * Replace part of a path
   * @param {string} f - path replacement
   * @param {integer} loc - location to replace
   * @return {instance} for chaining
   */
  replace(f, loc) {
    if (loc === 'file') {
      this._path.splice(this._path.length - 1, 1, f);
      return this.ctx;
    } else if (Number.isInteger(loc)) {
      this._path.splice(loc, 1, f);
      return this.ctx;
    }
    this.parse(f);
    return this.ctx;
  }

  /**
   * Get string representatio of the path or the uri
   * @param {boolen} uri - if true return string represention of uri
   * @return {string} path or uri as string
   */
  toString(uri) {
    if (uri) return this.ctx.toString();
    return Array.isArray(this._path) ? this._path.join('/') : '';
  }
}

/**
 * Class to manage query part of URL
 */
class Query {
  /**
   * @param {string} f - query string
   * @param {object} ctx - context of uri instance
   * @return {instance} for chaining
   */
  constructor (f, ctx = {}) {
    Object.assign(this, ctx);
    this.ctx = ctx;
    this.set(f);
    return this
  }

  /**
   * Add a query string
   * @param {object} obj {name: 'value'}
   * @return {instance} for chaining
   */
  add (obj = {}) {
    this._query = this._convert(obj, this._query[0], this._query[1]);
    return this.ctx
  }

  /**
   * Remove the query string
   * @return {instance} for chaining
   */
  clear () {
    this._query = [[], []];
    return this.ctx
  }

  _convert (obj, p = [], q = []) {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          const val = obj[key][i];
          p.push(key);
          q.push(val);
        }
      } else if (obj[key]) {
        p.push(key);
        q.push(obj[key]);
      }
    }
    return [p, q]
  }

  /**
   * Get the query string or get the value of a single query parameter
   * @param {string} name representing single query string
   * @returns {array} or {string} representing the query string the value of a single query parameter
   */
  get (name) {
    const dict = {};
    const obj = this._query;

    for (let i = 0; i < obj[0].length; i++) {
      const k = obj[0][i];
      const v = obj[1][i];
      if (dict[k]) {
        dict[k].push(v);
      } else {
        dict[k] = [v];
      }
    }
    if (name) return dict[name] && dict[name].length ? dict[name][0] : null
    return dict
  }

  getUrlTemplateQuery () {
    return this._urlTemplateQueryString
  }

  /**
   * Merge with the query string - replaces query string values if they exist
   * @param {object} obj {name: 'value'}
   * @return {instance} for chaining
   */
  merge (obj) {
    const p = this._query[0];
    const q = this._query[1];
    for (const key in obj) {
      let kset = false;

      for (let i = 0; i < p.length; i++) {
        const xKey = p[i];
        if (key === xKey) {
          if (kset) {
            p.splice(i, 1);
            q.splice(i, 1);
            continue
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
    return this.ctx
  }

  _parse (q = '') {
    const struct = [[], []];
    const pairs = q.split(/&|;/);

    for (let j = 0; j < pairs.length; j++) {
      const pair = pairs[j]; const nPair = pair.match(this.qRegEx);

      if (nPair && typeof nPair[nPair.length - 1] !== 'undefined') {
        nPair.shift();
        for (let i = 0; i < nPair.length; i++) {
          const p = nPair[i];
          struct[i].push(decodeURIComponent(p.replace('+', ' ', 'g')));
        }
      }
    }
    return struct
  }

  /**
   * Set with the query string - replaces existing query string
   * @param {obj} or {string} ...q
   * @return {instance} for chaining
   */
  set (...q) {
    const args = [...q];

    if (args.length === 1) {
      if (typeof args[0] === 'object') {
        this._query = this._convert(args[0]);
      } else {
        this._query = this._parse(args[0]);
      }
    } else if (args.length === 0) {
      this.clear();
    } else {
      const obj = {};
      obj[args[0]] = args[1];
      this.merge(obj);
    }
    return this.ctx
  }

  /**
   * Set the url template query string vale
   * @param {string} s url-template query string
   * @return {instance} for chaining
   */
  setUrlTemplateQuery (s) {
    this._urlTemplateQueryString = s;
  }

  /**
   * Get string representation of the path or the uri
   * @param {boolean} uri - if true return string representation of uri
   * @return {string} query or uri as string
   */
  toString (uri) {
    if (uri) return this.ctx.toString()
    const pairs = [];
    const n = this._query[0];
    const v = this._query[1];

    for (let i = 0; i < n.length; i++) {
      pairs.push(encodeURIComponent(n[i]) + '=' + encodeURIComponent(v[i]));
    }
    return pairs.join('&')
  }
}

/**
 * Class to make it easier to build strings
 */
class StringBuilder {
  /**
   * @param {string} string - starting string (optional)
   * @return {instance} for chaining
   */
  constructor(string) {
    if (!string || typeof string === 'undefined') this.string = String("");
    else this.string = String(string);
  }

  /**
   * Return full string
   * @return {string} assembled string
   */
  toString() {
    return this.string;
  }

  /**
   * Append a string to an existing string
   * @param {string} val - string to be appended
   * @return {instance} for chaining
   */
  append(val) {
    this.string += val;
    return this;
  }

  /**
   * Insert a string to an existing string
   * @param {integer} pos - position at which to insert value
   * @param {string} val - string to be inserted
   * @return {instance} for chaining
   */
  insert(pos, val) {
    this.string.length;
    let left = this.string.slice(0, pos);
    let right = this.string.slice(pos);
    this.string = left + val + right;
    return this;
  }

}

/**
 * Uri - manipulate URLs
 */
class TinyUri {
  /**
   * @param {string} uri - a URI string
   * @return {instance} - return Uri instance for chaining
   */
  constructor(uri) {
    this.uriRegEx = /^(([^:/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    this.authRegEx = /^([^@]+)@/;
    this.portRegEx = /:(\d+)$/;
    this.qRegEx = /^([^=]+)(?:=(.*))?$/;
    this.urlTempQueryRegEx = /\{\?(.*?)\}/;
    return this.parse(uri);
  }

  /**
   * @param {string} authority - username password part of URL
   * @return {instance} - returns Uri instance for chaining
   */
  authority(authority = '') {
    if (authority !== '') {
      let auth = authority.match(this.authRegEx);
      this._authority = authority;
      if (auth) {
        authority = authority.replace(this.authRegEx, '');
        this.userInfo(auth[1]);
      }
      let port = authority.match(this.portRegEx);
      if(port) {
        authority = authority.replace(this.portRegEx, '');
        this.port(port[1]);
      }
      this.host(authority.replace('{', ''));
      return this;
    }
    let userinfo = this.userInfo();
    if (userinfo) authority = userinfo + '@';
    authority = authority + this.host();
    let port = this.port();
    if (port) authority = authority + (':' + port);
    return authority;
  }

  /**
   * @param {string} f - string representation of fragment
   * @return {instance} - returns Uri instance for chaining
   */
  fragment(f = '') {
    return this.gs(f, '_fragment');
  }

  gs(val, tar, fn) {
    if (typeof val !== 'undefined') {
      this[tar] = val;
      return this;
    }
    return fn ? fn(this[tar]) : this[tar] ? this[tar] : '';
  }

  /**
   * @param {string} f - string representation of host
   * @return {instance} - returns Uri instance for chaining
   */
  host(f) {
    return this.gs(f, '_host');
  }

  /**
   * @param {string} uri - URL
   * @return {instance} - returns Uri instance for chaining
   */
  parse(uri) {
    let f = uri ? uri.match(this.uriRegEx) : [];
    let t = uri ? uri.match(this.urlTempQueryRegEx) : [];
    this.scheme(f[2]);
    this.authority(f[4]);
    this.path = new Path(f[5] ? f[5].replace(/{$/, '') : '', this);
    this.fragment(f[9]);
    this.query = new Query(f[7] ? f[7] : '', this);
    if (t) this.query.setUrlTemplateQuery(t[1]);
    return this;
  }

  /**
   * @param {string} f - port part of URL
   * @return {instance} - returns Uri instance for chaining
   */
  port(f) {
    return this.gs(f, '_port');
  }

  /**
   * @param {string} f - protocol part of URL
   * @return {instance} - returns Uri instance for chaining
   */
  protocol(f) {
    return (this._scheme || '').toLowerCase();
  }

  /**
   * @param {string} f - protocol scheme
   * @return {instance} - returns Uri instance for chaining
   */
  scheme(f) {
    return this.gs(f, '_scheme');
  }

  /**
   * @param {string} f - user info part of URL
   * @return {instance} - returns Uri instance for chaining
   */
  userInfo(f) {
    return this.gs(f, '_userinfo', (r) => {
      return r ? encodeURI(r) : r;
    });
  }

  /**
   * @return {string} - returns string URL
   */
  toString() {
    let q = this.query.toString();
    let p = this.path.toString();
    this.fragment();
    let s = this.scheme();
    let str = new StringBuilder();
    let retStr = str.append(s ? s + '://' : "")
      .append(this.authority())
      .append('/').append(p)
      .append(q !== '' ? '?' : '')
      .append(q)
      .toString()
      .replace('/?', '?')
      .replace(/\/$/, '');
    return retStr;
  }

  static clone(uri) {
    return new TinyUri(uri.toString());
  }

}

module.exports = TinyUri;
