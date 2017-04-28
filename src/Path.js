export default class Path {
  constructor(f, ctx = {}) {
    Object.assign(this, ctx);
    let path = decodeURIComponent(f);
    let split = path.split('/');
    if (Array.isArray(split)) {
      if(path.match(/^\//)) split.shift();
      if (split.length > 1 && path.match(/\/$/)) split.pop();
      this._path = split;
    }
    return this;
  }

  toString() {
    return Array.isArray(this._path) ? this._path.join('/') : '';
  }
}
