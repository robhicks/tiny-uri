import Path from './Path.js';
import Query from './Query.js';
import StringBuilder from './StringBuilder.js';

/**
 * Uri - manipulate URLs
 */
export default class TinyUri {
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
    let f = this.fragment();
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
