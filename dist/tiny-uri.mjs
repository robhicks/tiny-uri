const atob = typeof window !== 'undefined' ? window.atob : (data) => Buffer.from(data, 'base64').toString('ascii');
const btoa = typeof window !== 'undefined' ? window.btoa : (data) => Buffer.from(data, 'ascii').toString('base64');

const uriRegEx = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
const authRegEx = /^(.+\:.+@.+)/;
const portRegEx = /:(\d+)$/;
const numPortRegEx = /(\d+)$/;
const qRegEx = /^([^=]+)(?:=(.*))?$/;
const urlTempQueryRegEx = /\{\?(.*?)\}/;

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
    let length = this.string.length;
    let left = this.string.slice(0, pos);
    let right = this.string.slice(pos);
    this.string = left + val + right;
    return this;
  }

}

class Authority {
  constructor(authority, ctx) {
    this.ctx = ctx;
    this.model = ctx.model;
    if (authority) this.set(authority);
    return this;
  }

  get() {
    return this.model.authority;
  }

  set(authority) {
    if (authority === this.model.host) return this.ctx;
    const str = new StringBuilder();
    const s = authority.split('@');
    console.log('s', s);
    this.model.user = s[0];

    if (authRegEx.test(authority)) str.append(authority);
    else {
      try {
        this.model.user = atob(this.model.user);
        str.append(this.model.user).append('@').append(this.model.host);
        if (this.model.port) str.append(':').append(this.model.port);
      } catch(err) {
        // eat me
      }
    }
    this.model.authority = str.toString();
    return this.ctx;
  }

  toString(uri) {
    if (uri) return this.ctx.toString();
    return this.model.user ? new StringBuilder().append(btoa(this.model.user)).append('@').append(this.model.host) : null;
  }
}

class Hash {
  constructor(hash, ctx) {
    this.ctx = ctx;
    this.model = ctx.model;
    if (hash) this.set(hash);
    return this;
  }

  get() {
    return this.model.hash;
  }

  set(hash) {
    let h = hash.split('?');
    if (h.length > 0) this.model.hash = '#' + h[0].replace(/#/, '');
    else this.model.hash = '#' + hash.replace(/#/, '');
    return this.ctx;
  }

  toString(uri) {
    if (uri) return this.ctx.toString();
    return this.get();
  }
}

class Host {
  constructor(host, ctx) {
    this.ctx = ctx;
    this.model = this.ctx.model;
    if (host) this.set(host);
    return this;
  }

  get() {
    return this.model.host;
  }

  set(host) {
    const h = host.split('@');
    if (h.length > 1) {
      const i = h[1].split(':');
      if (i.length > 0) this.model.host = i[0];
      else this.model.host = h[1];
    } else this.model.host = host;
    return this.ctx;
  }

  toString(uri) {
    if (uri) return this.ctx.toString();
    return this.get();
  }
}

class Fragment {
  constructor(fragment, ctx) {
    this.ctx = ctx;
    this.model = ctx.model;
    if (fragment) this.set(fragment);
    return this;
  }

  get() {
    return this.model.fragment;
  }

  set(fragment) {
    if (this.model.hash) this.model.fragment = this.model.hash.replace(/#/, '');
  }

  toString(uri) {
    if (uri) return this.ctx.toString();
    return this.get();
  }
}

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
    this.model = ctx.model;
    this.model.path = [];
    if (f) this.parse(f);
    return this;
  }

  /**
   * Append to a path
   * @param {string} s path to append
   * @return {instance} for chaining
   */
  append(s) {
    this.model.path.push(s);
    return this.ctx;
  }

  /**
   * Delete end of path
   * @param {integer} loc - segment of path to delete
   * @return {instance} for chaining
   */
  delete(loc) {
    if (!loc) {
      this.model.path.pop();
      return this.ctx;
    }
  }

  /**
   * Get the path
   * @return {array} path as array
   */
  get() {
    return this.model.path;
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
      this.model.path = split;
    }
  }

  /**
   * Replace part of a path
   * @param {string} f - path replacement
   * @param {integer} loc - location to replace
   * @return {instance} for chaining
   */
  replace(f, loc) {
    if (loc === 'file') {
      this.model.path.splice(this.model.path.length - 1, 1, f);
      return this.ctx;
    } else if (Number.isInteger(loc)) {
      this.model.path.splice(loc, 1, f);
      return this.ctx;
    }
    this.parse(f);
    return this.ctx;
  }

  set(path) {
    this.parse(path);
    return this.ctx;
  }

  /**
   * Get string representatio of the path or the uri
   * @param {boolen} uri - if true return string represention of uri
   * @return {string} path or uri as string
   */
  toString(uri) {
    if (uri) return this.ctx.toString();
    return Array.isArray(this.model.path) ? this.model.path.join('/') : '';
  }
}

class Port {
  constructor(port, ctx) {
    this.ctx = ctx;
    this.model = this.ctx.model;
    if (port) this.set(port);
    return this;
  }

  get() {
    return this.model.port;
  }

  set(port) {
    const p = !isNaN(port) ? String(port) : port;
    let m = p.match(portRegEx);
    let m1 = p.match(numPortRegEx);
    if (!m && !m1) return this.ctx;
    else if (m && m[1]) this.model.port = m[1];
    else if (m1 && m1[1]) this.model.port = m1[1];
    return this.ctx;
  }

  toString(uri) {
    if (uri) return this.ctx.toString();
    return this.get();
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
  constructor(f, ctx = {}) {
    this.ctx = ctx;
    this.model = ctx.model;
    this.set(f);
    return this;
  }

  /**
   * Add a query string
   * @param {object} obj {name: 'value'}
   * @return {instance} for chaining
   */
  add(obj = {}) {
    this.model.query = this._convert(obj, this.model.query[0], this.model.query[1]);
    return this.ctx;
  }

  /**
   * Remove the query string
   * @return {instance} for chaining
   */
  clear() {
    this.model.query = [[], []];
    return this.ctx;
  }

  _convert(obj, p = [], q = []) {
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          let val = obj[key][i];
          p.push(key);
          q.push(val);
        }
      } else if(obj[key]) {
        p.push(key);
        q.push(obj[key]);
      }
    }
    return [p, q];
  }

  /**
   * Get the query string
   * @return {array} representing the query string
   */
  get() {
    let dict = {};
    let obj = this.model.query;

    for (let i = 0; i < obj[0].length; i++) {
      let k = obj[0][i];
      let v = obj[1][i];
      if (dict[k]) {
        dict[k].push(v);
      } else {
        dict[k] = [v];
      }
    }
    return dict;
  }

  getUrlTemplateQuery() {
    return this._urlTemplateQueryString;
  }

  /**
   * Merge with the query string - replaces query string values if they exist
   * @param {object} obj {name: 'value'}
   * @return {instance} for chaining
   */
  merge(obj) {
    let p = this.model.query[0];
    let q = this.model.query[1];
    for (let key in obj) {
      let kset = false;

      for(let i=0; i < p.length; i++) {
        let xKey = p[i];
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
    this.model.query = this._convert(obj, this.model.query[0], this.model.query[1]);
    return this.ctx;
  }

  _parse(q = '') {
    let struct = [[], []];
    let pairs = q.split(/&|;/);

    for (let j = 0; j < pairs.length; j++) {
      let pair = pairs[j], nPair = pair.match(qRegEx);

      if(nPair && typeof nPair[nPair.length -1] !== 'undefined') {
        nPair.shift();
        for (let i = 0; i < nPair.length; i++) {
          let p = nPair[i];
          struct[i].push(decodeURIComponent(p.replace('+', ' ', 'g')));
        }
      }
    }
    return struct;
  }

  /**
   * Set with the query string - replaces existing query string
   * @param {obj} or {string} ...q
   * @return {instance} for chaining
   */
  set(...q) {
    let args = [...q];

    if (args.length === 1) {
      if (typeof args[0] === 'object') {
        this.model.query = this._convert(args[0]);
      } else {
        this.model.query = this._parse(args[0]);
      }
    } else if (args.length === 0) {
      this.clear();
    } else {
      let obj = {};
      obj[args[0]] = args[1];
      this.merge(obj);
    }
    return this.ctx;
  }

  /**
   * Set the url template query string vale
   * @param {string} url-template query string
   * @return {instance} for chaining
   */
  setUrlTemplateQuery(s) {
    this._urlTemplateQueryString = s;
  }

  /**
   * Get string representatio of the path or the uri
   * @param {boolen} uri - if true return string represention of uri
   * @return {string} query or uri as string
   */
  toString(uri) {
    if (uri) return this.ctx.toString();
    let pairs = [];
    let n = this.model.query[0];
    let v = this.model.query[1];

    for(let i = 0; i < n.length; i++) {
      pairs.push(encodeURIComponent(n[i]) + '=' + encodeURIComponent(v[i]));
    }
    return pairs.join('&');
   }
}

class Scheme {
  constructor(uri, ctx) {
    this.ctx = ctx;
    this.model = ctx.model;
    this.set(uri);
    return this;
  }

  get() {
    return this.model.scheme;
  }

  set(s) {
    const m = s.match(/^([a-z][a-z0-9+\-.]*):/);
    if (m && m[1]) this.model.scheme = m[1];
    else if (s !== '' && !s.includes('/')) this.model.scheme = s;
    return this.ctx;
  }

  toString(uri) {
    if (uri) return this.ctx.toString();
    return this.get();
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
    this.model = {};
    return this.parse(uri);
  }

  /**
   * @param {string} uri - URL
   * @return {instance} - returns Uri instance for chaining
   */
  parse(uri) {
    let f = uri ? uri.match(uriRegEx) : [];
    // console.log('f', f);
    let t = uri ? uri.match(urlTempQueryRegEx) : [];
    this.host = new Host(f[4], this);
    this.port = new Port(f[4], this);
    this.authority = new Authority(f[4], this);
    this.scheme = new Scheme(uri, this);
    this.protocol = this.scheme;
    this.path = new Path(f[5] ? f[5].replace(/{$/, '') : '', this);
    this.userInfo = this.authority;
    this.hash = new Hash(f[9], this);
    this.fragment = new Fragment(f[9], this);
    this.query = new Query(f[7] ? f[7] : '', this);
    if (t) this.query.setUrlTemplateQuery(t[1]);
    return this;
  }

  /**
   * @return {string} - returns string URL
   */
  toString() {
    const a = this.authority.toString();
    const f = this.hash.toString();
    const h = this.host.toString();
    const p = this.path.toString();
    const q = this.query.toString();
    const s = this.scheme.toString();

    const str = new StringBuilder();

    if (s) {
      if (/mailto/.test(s)) str.append(s).append(':');
      else str.append(s).append(':').append('//');
    }

    if (a) str.append(a);
    else if (h) str.append(h);
    if (p !== '') str.append('/').append(p);
    if (f) str.append(f);
    if (q !== '') str.append('?').append(q);

    return str.toString();
  }

  static clone(uri) {
    return new TinyUri(uri.toString());
  }

}

export default TinyUri;
