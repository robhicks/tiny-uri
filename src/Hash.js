export default class Hash {
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
