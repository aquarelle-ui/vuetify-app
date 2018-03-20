import Requestor from "./Requestor";

/**
 * Load records
 */
export default class BaseLoader extends Requestor
{

  /**
   * Create new record
   * @param data
   */
  create(data)
  {
    return this._sendData(data);
  }

  /**
   * Get all records
   * @param options
   */
  getAll(options)
  {
    let url = this._url;
    if (options) {
      url += '?' + (new URLSearchParams(options)).toString();
    }
    return this._fetch(url);
  }

  /**
   * Get record by id
   * @param id
   */
  get(id)
  {
    return this._fetch(this._url + '/' + id);
  }

  /**
   * Update record
   * @param id
   * @param data
   */
  update(id, data)
  {
    return this._sendData(data, id);
  }

  /**
   * Delete record
   * @param id
   */
  delete(id)
  {
    let url = this._url + '/' + id;
    return this._fetch(url, {
      method: "delete"
    });
  }

  /**
   *
   * @param {Object} data
   * @param {String} id
   * @param {String} append
   * @returns {Promise<Object|ServerError>}
   * @protected
   */
  _sendData(data, id, append = '')
  {
    let url = id ? this._url + '/' + id : this._url;
    return this._send(url + append, data, id ? 'put' : 'post');
  }
}
