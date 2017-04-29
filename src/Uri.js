import Path from './Path.js';
import Query from './Query.js';
import StringBuilder from './StringBuilder.js';

class Uri {
  constructor(uri) {
    this.uriRegEx = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    this.authRegEx = /^([^\@]+)\@/;
    this.portRegEx = /:(\d+)$/;
    this.qRegEx = /^([^=]+)(?:=(.*))?$/;
    return this.parse(uri);
  }

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
      this.host(authority);
      return this;
    } else {
      let userinfo = this.userInfo();
      if (userinfo) authority = userinfo + '@';
      authority += this.host();
      let port = this.port();
      if (port) authority += ':' + port;
      return authority;
    }
  }

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

  host(f) {
    return this.gs(f, '_host');
  }

  parse(uri) {
    let f = uri ? uri.match(this.uriRegEx) : [];
    this.path = new Path(f[5], this);
    this.scheme(f[2]);
    this.authority(f[4]);
    this.fragment(f[9]);
    this.query = new Query(f[7], this);
    return this;
  }

  port(f) {
    return this.gs(f, '_port');
  }

  protocol(f) {
    return this.scheme.toLowerCase();
  }

  scheme(f) {
    return this.gs(f, '_scheme');
  }

  userInfo(f) {
    return this.gs(f, '_userinfo', (r) => {
      return r ? encodeURI(r) : r;
    });
  }

  toString() {
    let q = this.query.toString();
    let p = this.path.toString();
    let f = this.fragment();
    let s = this.scheme();
    let str = new StringBuilder();
    return str.append(s ? s + '://' : "").append(this.authority()).append('/').append(p).append('?').append(q).toString();
  }


}

export default Uri;
