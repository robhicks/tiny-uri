export default class Scheme {
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
