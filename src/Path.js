export default class Path {
  constructor(f, ctx = {}) {
    Object.assign(this, ctx);
    this._path = [];
    return this.parse(f);
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

  replace(f) {
    return this.parse(f);
  }

  removeFilename() {
    this._path.splice(this._path.length - 1, 1);
    return this;
  }

  replaceFilename(n) {
    this._path.splice(this._path.length - 1, 1, n);
    return this;
  }


  toString() {
    return Array.isArray(this._path) ? this._path.join('/') : '';
  }
}
