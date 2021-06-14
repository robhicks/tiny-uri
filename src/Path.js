/**
 * Class to manage URL paths
 */
export default class Path {
  /**
   * @param {string} f - string path
   * @param {object} ctx - context of Uri class
   */
  constructor(f, ctx = {}) {
    this.ctx = ctx;
    this._path = [];
    return this.parse(f);
  }

  /**
   * Append to a path
   * @param {string} s path to append
   * @return {instance} for chaining
   */
  append(s) {
    this._path.push(s);
    return this.ctx;
  }

  /**
   * Delete end of path
   * @param {integer} loc - segment of path to delete
   * @return {instance} for chaining
   */
  delete(loc) {
    if (Array.isArray(loc)) {
      loc.reverse().forEach(l => this._path.splice(l, 1));
    } else if (Number.isInteger(loc)) {
      this._path.splice(loc, 1);
    } else {
      this._path.pop();
    }
    return this.ctx;
  }

  /**
   * Get the path
   * @return {array} path as array
   */
  get() {
    return this._path;
  }

  /**
   * Parse the path part of a URl
   * @param {string} f - string path
   * @return {instance} for chaining
   */
  parse(f = '') {
    let path = decodeURIComponent(f);
    let split = path.split('/');
    if (Array.isArray(split)) {
      if(path.match(/^\//)) split.shift();
      if (split[0] === '') split.shift();
      if (split.length > 1 && path.match(/\/$/)) split.pop();
      this._path = split;
    }
    return this;
  }

  /**
   * Replace part of a path
   * @param {string} f - path replacement
   * @param {integer} loc - location to replace
   * @return {instance} for chaining
   */
  replace(f, loc) {
    if (loc === 'file') {
      this._path.splice(this._path.length - 1, 1, f);
      return this.ctx;
    } else if (Number.isInteger(loc)) {
      this._path.splice(loc, 1, f);
      return this.ctx;
    }
    this.parse(f);
    return this.ctx;
  }

  /**
   * Get string representatio of the path or the uri
   * @param {boolen} uri - if true return string represention of uri
   * @return {string} path or uri as string
   */
  toString(uri) {
    if (uri) return this.ctx.toString();
    return Array.isArray(this._path) ? this._path.join('/') : '';
  }
}
