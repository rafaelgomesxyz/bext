const FormData = require(`form-data`);
const fetch = require(`node-fetch`);

const DEFAULT_HEADERS = {
  Accept: `application/json`
};

class FetchHelper {
  static async fetch(method, url, params = {}) {
    url = FetchHelper.addPathParams(url, params.path);
    url = FetchHelper.addQueryParams(url, params.query);
    const options = { method };
    options.headers = FetchHelper.getHeaderParams(params.header);
    if (options.method !== `GET`) {
      if (typeof params.body.read === `function`) {
        options.body = params.body;
      } else if (options.headers[`Content-Type`] === `application/json`) {
        options.body = JSON.stringify(params.body);
      } else {
        options.body = FetchHelper.getBodyParams(params.body);
      }
    }
    const fetchResponse = await fetch(url, options);
    const response = {
      url: fetchResponse.url,
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      text: await fetchResponse.text(),
      json: null
    };
    try {
      response.json = JSON.parse(response.text);
    } catch (error) { /* */ }
    if (!fetchResponse.ok) {
      throw response;
    }
    return response;
  }

  static addPathParams(url, pathParams = {}) {
    return url.replace(/\{(.+?)\}/g, (match, key) => pathParams[key]);
  }

  static addQueryParams(url, queryParams = {}) {
    const params = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join(`&`);
    if (params) {
      url = `${url}?${params}`;
    }
    return url;
  }

  static getHeaderParams(headerParams = {}) {
    return Object.assign({}, DEFAULT_HEADERS, headerParams);
  }

  static getBodyParams(bodyParams = {}) {
    const params = new FormData();
    for (const key in bodyParams) {
      if (bodyParams.hasOwnProperty(key)) {
        params.append(key, bodyParams[key]);
      }
    }
    return params;
  }
}

module.exports = FetchHelper;