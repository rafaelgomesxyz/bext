const {
  FetchHelper,
  Publisher
} = require(`@bext/common`);

const BASE_URL = `https://www.googleapis.com`;
const TOKEN_METHOD = `POST`;
const TOKEN_URL = `https://accounts.google.com/o/oauth2/token`;
const INSERT_METHOD = `POST`;
const INSERT_URL = `/upload/chromewebstore/v1.1/items`;
const UPDATE_METHOD = `PUT`;
const UPDATE_URL = `/upload/chromewebstore/v1.1/items/{extensionId}`;
const PUBLISH_METHOD = `POST`;
const PUBLISH_URL = `/chromewebstore/v1.1/items/{extensionId}/publish`;
const STATUS_METHOD = `GET`;
const STATUS_URL = `/chromewebstore/v1.1/items/{extensionId}`;

class ChromePublisher extends Publisher {
  constructor(configPath, configSpacing) {
    super(`chrome`, configPath, configSpacing);
    this.baseUrl = BASE_URL;
  }

  async insert(fileStreamOrPath, params = {}) {
    const url = this.getUrl(INSERT_URL);
    params.body = this.getFile(fileStreamOrPath);
    await this.assignParams(params, {
      query: {
        uploadType: `media`
      }
    });
    const response = await FetchHelper.fetch(INSERT_METHOD, url, params);
    if (response.json) {
      this.setConfig(`extensionId`, response.json.id);
      await this.writeConfig();
    }
    return response;
  }

  async update(fileStreamOrPath, params = {}) {
    const url = this.getUrl(UPDATE_URL);
    params.body = this.getFile(fileStreamOrPath);
    await this.assignParams(params, {
      query: {
        uploadType: `media`
      }
    });
    return FetchHelper.fetch(UPDATE_METHOD, url, params);
  }

  async publish(fileStreamOrPath, params = {}) {
    const url = this.getUrl(PUBLISH_URL);
    await this.assignParams(params, {
      header: {
        'Content-Type': `application/json`
      }
    });
    return FetchHelper.fetch(PUBLISH_METHOD, url, params);
  }

  async getStatus(params = {}) {
    const url = this.getUrl(STATUS_URL);
    await this.assignParams(params, {
      query: {
        projection: `draft`
      }
    });
    return FetchHelper.fetch(STATUS_METHOD, url, params);
  }

  async getDefaultHeaders() {
    const token = await this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      'x-goog-api-version': 2
    };
  }

  async getToken() {
    if (await this.hasTokenExpired()) {
      const now = Date.now() / 1e3;
      const url = this.getUrl(TOKEN_URL);
      const params = {
        header: {
          'Content-Type': `application/json`
        }
      };
      if (this.getConfig(`refreshToken`)) {
        params.body = {
          grant_type: `refresh_token`,
          client_id: this.getConfig(`clientId`),
          client_secret: this.getConfig(`clientSecret`),
          refresh_token: this.getConfig(`refreshToken`)
        };
      } else {
        params.body = {
          grant_type: `authorization_code`,
          redirect_uri: `urn:ietf:wg:oauth:2.0:oob`,
          client_id: this.getConfig(`clientId`),
          client_secret: this.getConfig(`clientSecret`),
          code: this.getConfig(`clientCode`),
        };
      }
      const response = await FetchHelper.fetch(TOKEN_METHOD, url, params);
      if (response.json) {
        this.setConfig(`accessToken`, response.json.access_token);
        this.setConfig(`accessTokenExpiry`, parseInt(now + response.json.expires_in));         
        if (response.json.refresh_token) {
          this.setConfig(`refresh_token`, response.json.refresh_token);
        }
        await this.writeConfig();
      }
    }
    return this.getConfig(`accessToken`);
  }

  async hasTokenExpired() {
    let hasExpired;
    const now = Date.now() / 1e3;
    if (now > this.getConfig(`accessTokenExpiry`)) {
      hasExpired = true;
      this.setConfig(`accessToken`, null);
      this.setConfig(`accessTokenExpiry`, 0);
      await this.writeConfig();
    } else {
      hasExpired = false;
    }
    return hasExpired;
  }
}

const chromePublisher = new ChromePublisher();

module.exports = chromePublisher;
