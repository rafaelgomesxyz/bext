const fetch = require(`node-fetch`);

const DEFAULT_HEADERS = {
  'Accept': `application/json`,
  'Content-Type': `application/json`
};

class FetchHelper {
  static addQueryParams(url, queryParams) {
    const params = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join(`&`);
    return `${url}?${params}`;
  }

  static async fetch(method, url, queryParams = {}, options = {}) {
    url = FetchHelper.addQueryParams(url, queryParams);
    options.headers = Object.assign({}, DEFAULT_HEADERS, options.headers || {});
    options.method = method;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw response;
    }
    return response;
  }
}

module.exports = FetchHelper;