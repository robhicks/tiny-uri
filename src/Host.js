export default class Host {
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
    if (h[0] && h[0].includes(':')) this.model.host = h[0].split(':')[0];
    else if (h.length > 1) {
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
