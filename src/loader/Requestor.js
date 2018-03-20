import ServerError from "../errors/ServerError";

let fetchBaseUrl = null;
let fetchCredentials = 'same-origin';
let fetchHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json"
};

export default class Requestor
{

  /**
   * @param {String} url
   */
  constructor(url)
  {
    this._url = url;
  }

  _onResponse(response) {
    if (!response.ok) {
      throw new ServerError(response);
    }
    if (response.status === 204) {
      return response;
    }
    return response.json();
  }

  /**
   * @param {String} url
   * @returns {String}
   * @protected
   */
  _resolveUrl(url)
  {
    return Requestor.resolveUrl(url);
  }

  /**
   * @param {String} url
   * @param {Object} options
   * @returns {Promise<Object|Response|ServerError>}
   * @protected
   */
  _fetch(url, options = {})
  {
    url = this._resolveUrl(url);
    options = {
      method: "get",
      headers: fetchHeaders,
      credentials: fetchCredentials,
      ...options
    };

    let request = new Request(url, options);
    return fetch(request).then(this._onResponse);
  }

  /**
   * @param {String} url
   * @param {Object} data
   * @param {String} method
   * @returns {Promise<Object|ServerError>}
   * @protected
   */
  _send(url, data, method = 'post')
  {
    url = this._resolveUrl(url);
    return fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: fetchHeaders,
      credentials: fetchCredentials
    }).then(this._onResponse);
  }

  /**
   * @param {String} url
   * @returns {String}
   */
  static resolveUrl(url)
  {
    if (fetchBaseUrl === null) {
      return url;
    }
    return fetchBaseUrl + url;
  }

  /**
   * Set base url
   * @param {String} base
   */
  static setBaseUrl(base)
  {
    fetchBaseUrl = base;
  }

  /**
   * @param {String} credentials
   */
  static setCredentials(credentials)
  {
    fetchCredentials = credentials
  }

  /**
   * @param {Object} headers
   */
  static setFetchHeaders(headers)
  {
    fetchHeaders = headers;
  }

}
