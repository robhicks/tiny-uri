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
    str.append(this.model.user).append('@').append(this.model.host);
    if (this.model.port) str.append(':').append(this.model.port);
    this.model.authority = str.toString();
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
    return this.model.user ? new StringBuilder().append(btoa(this.model.user)).append('@').append(this.model.host) : null;
  }
}
