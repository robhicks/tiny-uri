export default class Fragment {
  constructor(fragment, ctx) {
    this.ctx = ctx;
    this.model = ctx.model;
    if (fragment) this.set(fragment);
    return this;
  }

  get() {
    return this.model.fragment;
  }

  set(fragment) {
    if (this.model.hash) this.model.fragment = this.model.hash.replace(/#/, '');
  }

  toString(uri) {
    if (uri) return this.ctx.toString();
    return this.get();
  }
}
