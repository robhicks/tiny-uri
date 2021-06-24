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
  constructor(f, ctx = {}) {
    Object.assign(this, ctx);
    this.ctx = ctx;
    this.set(f);
    return this;
  }

  /**
   * Add a query string
   * @param {object} obj {name: 'value'}
   * @return {instance} for chaining
   */
  add(obj = {}) {
    this._query = this._convert(obj, this._query[0], this._query[1]);
    return this.ctx;
  }

  /**
   * Remove the query string
   * @return {instance} for chaining
   */
  clear() {
    this._query = [[], []];
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
   * Get the query string or get the value of a single query parameter
   * @param {string} name representing single query string
   * @returns {array} or {string} representing the query string the value of a single query parameter
   */
  get(name) {
    let dict = {};
    let obj = this._query;

    for (let i = 0; i < obj[0].length; i++) {
      let k = obj[0][i];
      let v = obj[1][i];
      if (dict[k]) {
        dict[k].push(v);
      } else {
        dict[k] = [v];
      }
    }
    if (name) return dict[name] && dict[name].length ? dict[name][0] : null;
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
    let p = this._query[0];
    let q = this._query[1];
    for (let key in obj) {
      let kset = false;

      for(let i=0; i < p.length; i++) {
        let xKey = p[i];
        if(key === xKey) {
          if(kset) {
            p.splice(i, 1);
            q.splice(i, 1);
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
  }

  _parse(q = '') {
    let struct = [[], []];
    let pairs = q.split(/&|;/);

    for (let j = 0; j < pairs.length; j++) {
      let pair = pairs[j], nPair = pair.match(this.qRegEx);

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
        this._query = this._convert(args[0]);
      } else {
        this._query = this._parse(args[0]);
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
   * @param {string} s url-template query string
   * @return {instance} for chaining
   */
  setUrlTemplateQuery(s) {
    this._urlTemplateQueryString = s;
  }

  /**
   * Get string representation of the path or the uri
   * @param {boolean} uri - if true return string representation of uri
   * @return {string} query or uri as string
   */
  toString(uri) {
    if (uri) return this.ctx.toString();
    let pairs = [];
    let n = this._query[0];
    let v = this._query[1];

    for(let i = 0; i < n.length; i++) {
      pairs.push(encodeURIComponent(n[i]) + '=' + encodeURIComponent(v[i]));
    }
    return pairs.join('&');
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
    this.uriRegEx = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    this.authRegEx = /^([^\@]+)\@/;
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

describe('TinyUri', () => {

  it('should parse a url into its parts', () => {
    const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    const uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('https');
    expect(uri.host()).to.be.equal('big.example.com');
    expect(uri.authority()).to.be.equal('user:pass@big.example.com');
    expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    expect(uri.query.toString()).to.be.equal('context=foo&credentials=bar');
  });

  it('should parse an empty string url without blowing up', () => {
    const url = '';
    const uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('');
    expect(uri.host()).to.be.equal('');
    expect(uri.authority()).to.be.equal('');
    expect(uri.path.toString()).to.be.equal('');
    expect(uri.query.toString()).to.be.equal('');
  });

  it('should parse a relative url into its parts', () => {
    const url = 'path/to/file.xml?context=foo&credentials=bar';
    const uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('');
    expect(uri.host()).to.be.equal('');
    expect(uri.authority()).to.be.equal('');
    expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    expect(uri.query.toString()).to.be.equal('context=foo&credentials=bar');
  });

  it('should parse a url with url template tags into its parts', () => {
    const url = 'https://user:pass@big.example.com/quotetools/getHistoryDownload/{user}/download.csv{?webmasterId,startDay,startMonth,startYear,endDay,endMonth,endYear,isRanged,symbol}';
    const uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('https');
    expect(uri.host()).to.be.equal('big.example.com');
    expect(uri.authority()).to.be.equal('user:pass@big.example.com');
    expect(uri.path.toString()).to.be.equal('quotetools/getHistoryDownload/{user}/download.csv');
    expect(Array.isArray(uri.path.get())).to.be.equal(true);
    expect(uri.path.get()).to.be.eql(['quotetools', 'getHistoryDownload', '{user}', 'download.csv']);
    expect(uri.query.toString()).to.be.equal('');
    expect(uri.query.getUrlTemplateQuery()).to.be.equal('webmasterId,startDay,startMonth,startYear,endDay,endMonth,endYear,isRanged,symbol');
  });

  it('should parse a url into its parts even if query string not provided', () => {
    const url = 'https://user:pass@big.example.com/path/to/file.xml';
    const uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('https');
    expect(uri.host()).to.be.equal('big.example.com');
    expect(uri.authority()).to.be.equal('user:pass@big.example.com');
    expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    expect(uri.query.toString()).to.be.equal('');
  });

  it('should convert the uri to a string', () => {
    const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    const uri = new TinyUri(url);
    expect(uri.toString()).to.be.equal(url);
  });

  it('should convert the uri to a string without a trailing slash', () => {
    const url = 'https://big.example.com/';
    const uri = new TinyUri(url);
    expect(uri.toString()).to.be.equal('https://big.example.com');
  });

  it('should change the host', () => {
    const url = 'https://big.example.com/';
    const uri = new TinyUri(url);
    uri.host(uri.host() === 'big.example.com' ? 'small.example.com' : uri.host());
    expect(uri.toString()).to.be.equal('https://small.example.com');
  });

  it('should change the host', () => {
    const url = 'https://small.example.com/';
    const uri = new TinyUri(url);
    uri.host(uri.host() === 'big.example.com' ? 'small.example.com' : uri.host());
    expect(uri.toString()).to.be.equal('https://small.example.com');
  });

  describe('Path', () => {
    it('should return the path', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    });

    it('should replace the path', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.replace('different/path/to/file.json').path.toString()).to.be.equal('different/path/to/file.json');
    });

    it('should replace the file part of the path', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.replace('file.json', 'file').path.toString()).to.be.equal('path/to/file.json');
    });

    it('should remove the last segment of the path', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.delete().path.toString()).to.be.equal('path/to');
    });

    it('should remove a specific segment of the the path', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.delete(0).path.toString()).to.be.equal('to/file.xml');
    });

    it('should remove several segments of the the path', () => {
      const url = 'https://user:pass@big.example.com/really/long/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.delete([0, 1, 2, 3]).path.toString()).to.be.equal('file.xml');
    });

    it('should replace the first segment of the path', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.replace('new-path', 0).path.toString()).to.be.equal('new-path/to/file.xml');
    });

    it('should replace the second segment of the path', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.replace('new-to', 1).path.toString()).to.be.equal('path/new-to/file.xml');
    });

    it('should return the uri as a string', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.replace('new-to', 1).path.toString(true)).to.be.equal('https://user:pass@big.example.com/path/new-to/file.xml');
    });

    it('should support path chaining', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml';
      const uri = new TinyUri(url);

      expect(uri.path.replace('new-path', 0).path.replace('new-to', 1).path.toString(true)).to.be.equal('https://user:pass@big.example.com/new-path/new-to/file.xml');
    });

    it('should support path appending and chaining', () => {
      const url = 'https://user:pass@big.example.com';
      const uri = new TinyUri(url);
      uri.path.append('path').path.append('to').path.append('file');

      expect(uri.toString()).to.be.equal('https://user:pass@big.example.com/path/to/file');
    });

  });

  describe('Query', () => {
    it('should set the query string', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      uri.query.set({foo: 'bar'});
      expect(uri.query.toString()).to.be.equal('foo=bar');
    });

    it('should return a url template query string', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml{?userid,name}';
      const uri = new TinyUri(url);

      expect(uri.query.getUrlTemplateQuery()).to.be.equal('userid,name');
    });

    it('should add a query string properly on a naked host', () => {
      const url = 'https://big.example.com';
      const uri = new TinyUri(url);
      uri.query.add({foo: 'bar'});
      expect(uri.toString()).to.be.equal('https://big.example.com?foo=bar');
    });

    it('should clear to the query string', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      expect(uri.query.clear().query.toString()).to.be.equal('');
    });

    it('should append to the query string', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      uri.query.add({foo: 'bar'});
      expect(uri.query.toString()).to.be.equal('context=foo&credentials=bar&foo=bar');
    });

    it('should change/replace a query parameter', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      uri.query.merge({context: 'bar'});
      expect(uri.query.toString()).to.be.equal('context=bar&credentials=bar');
    });

    it('should, when cleared, return a proper url', () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      uri.query.clear();
      expect(uri.toString()).to.be.equal('https://user:pass@big.example.com/path/to/file.xml');
    });

    it(`should get a leading query string parameter`, () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      const qs = uri.query.get('context');
      expect(qs).to.be.equal('foo');
    });

    it(`should get a trailing query string parameter`, () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      const qs = uri.query.get('credentials');
      expect(qs).to.be.equal('bar');
    });

    it(`should get null for an invalid query`, () => {
      const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      const uri = new TinyUri(url);
      const qs = uri.query.get('hot');
      expect(qs).to.be.null;
    });
  });

  it('should change the host', () => {
    const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    const uri = new TinyUri(url);
    uri.host('little.example.com');
    expect(uri.host()).to.be.equal('little.example.com');
  });

  it('should change the scheme', () => {
    const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    const uri = new TinyUri(url);
    uri.scheme('http');
    expect(uri.scheme()).to.be.equal('http');
  });

  it('should demonstrate chaining', () => {
    const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    const uri = new TinyUri(url);
    expect(uri.scheme().toString()).to.be.equal('https');
    expect(uri.host().toString()).to.be.equal('big.example.com');
    expect(uri.port().toString()).to.be.equal('');
    expect(Array.isArray(uri.path.get())).to.be.equal(true);
    expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    expect(uri.query.add({foo: 'bar'}).query.toString()).to.be.equal('context=foo&credentials=bar&foo=bar');
    expect(uri.query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString()).to.be.equal('context=foo&credentials=bar&foo=bars');
    expect(uri.query.clear().query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString()).to.be.equal('foo=bars');
    expect(uri.query.clear().query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString(true)).to.be.equal('https://user:pass@big.example.com/path/to/file.xml?foo=bars');
  });

});
