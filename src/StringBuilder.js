
/**
 * Class to make it easier to build strings
 */
export default class StringBuilder {
  /**
   * @param {string} string - starting string (optional)
   * @return {instance} for chaining
   */
  constructor(string) {
    if (!string || typeof string === 'undefined') this.string = String("");
    else this.string = String(string);
  }

  /**
   * Return full string
   * @return {string} assembled string
   */
  toString() {
    return this.string;
  }

  /**
   * Append a string to an existing string
   * @param {string} val - string to be appended
   * @return {instance} for chaining
   */
  append(val) {
    this.string += val;
    return this;
  }

  /**
   * Insert a string to an existing string
   * @param {integer} pos - position at which to insert value
   * @param {string} val - string to be inserted
   * @return {instance} for chaining
   */
  insert(pos, val) {
    let length = this.string.length;
    let left = this.string.slice(0, pos);
    let right = this.string.slice(pos);
    this.string = left + val + right;
    return this;
  }

}
