import { atob, btoa } from './encode.js';
import { authRegEx } from './regex.js';
import StringBuilder from './StringBuilder.js';

export default class Authority {
  constructor(authority, ctx) {
    this.ctx = ctx;
    this.model = ctx.model;
    if (authority) this.set(authority);
    return this;
  }

  get() {
    const str = new StringBuilder();
    if (this.model.user) str.append(this.model.user).append('@');
    if (this.model.host) str.append(this.model.host);
    if (this.model.port) str.append(':').append(this.model.port);
    if (str.toString() !== '') this.model.authority = str.toString();
    return this.model.authority;
  }

  set(authority) {
    if (authority === this.model.host) return this.ctx;
    const str = new StringBuilder();
    const s = authority.split('@');
    this.model.user = s[0];

    if (authRegEx.test(authority)) str.append(authority);
    else {
      try {
        if (!this.model.user.includes(':')) this.model.user = atob(this.model.user);
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
    const str = new StringBuilder();
    if (this.model.user) str.append(btoa(this.model.user)).append('@');
    if (this.model.host) str.append(this.model.host);
    if (this.model.port) str.append(':').append(this.model.port);
    return str.toString();
  }
}
