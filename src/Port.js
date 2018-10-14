import { numPortRegEx, portRegEx } from './regex.js';

export default class Port {
  constructor(port, ctx) {
    this.ctx = ctx;
    this.model = this.ctx.model;
    if (port) this.set(port);
    return this;
  }

  get() {
    console.log('this.model.port', this.model.port);
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
