export default class Path {
  constructor(f, ctx = {}) {
    this.ctx = ctx;
    this._path = [];
    return this.parse(f);
  }

  append(s) {
    this._path.push(s);
    return this;
  }

  delete(loc) {
    if (!loc) {
      this._path.pop();
      return this;
    }
  }

  get() {
    return this._path;
  }

  parse(f = '') {
    let path = decodeURIComponent(f);
    let split = path.split('/');
    if (Array.isArray(split)) {
      if(path.match(/^\//)) split.shift();
      if (split.length > 1 && path.match(/\/$/)) split.pop();
      this._path = split;
    }
    return this;
  }

  replace(f, loc) {
    if (loc === 'file') {
      this._path.splice(this._path.length - 1, 1, f);
      return this;
    } else if (Number.isInteger(loc)) {
      this._path.splice(loc, 1, f);
      return this;
    }
    return this.parse(f);
  }

  uriToString() {
    return this.ctx.toString();
  }

  toString() {
    return Array.isArray(this._path) ? this._path.join('/') : '';
  }
}
