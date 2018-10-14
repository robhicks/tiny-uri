import Authority from './Authority.js';
import Hash from './Hash.js';
import Host from './Host.js';
import Fragment from './Fragment.js';
import Path from './Path.js';
import Port from './Port.js';
import Query from './Query.js';
import Scheme from './Scheme.js';
import StringBuilder from './StringBuilder.js';
import { uriRegEx, urlTempQueryRegEx } from './regex.js';

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
