const {
  FetchHelper,
  Publisher
} = require(`@bext/common`);

const BASE_URL = `https://www.googleapis.com`;
const ACCESS_TOKEN_METHOD = `POST`;
const ACCESS_TOKEN_URL = `https://accounts.google.com/o/oauth2/token`;
const INSERT_METHOD = `POST`;
const INSERT_URL = `/upload/chromewebstore/v1.1/items`;
const UPDATE_METHOD = `PUT`;
const UPDATE_URL = `/upload/chromewebstore/v1.1/items/%extensionId%`;
const PUBLISH_METHOD = `POST`;
const PUBLISH_URL = `chromewebstore/v1.1/items/%extensionId%/publish`;

class ChromePublisher extends Publisher {
  constructor(configPath, configSpacing) {
    super(`chrome`, configPath, configSpacing);
    this._baseUrl = BASE_URL;
  }

  async hasAccessTokenExpired() {
    await this.readConfig();
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

  async getAccessToken() {
    if (await this.hasAccessTokenExpired()) {
      const now = Date.now() / 1e3;
      const url = this.getUrl(ACCESS_TOKEN_URL);
      let data;
      if (this.getConfig(`refreshToken`)) {
        data = {
          grant_type: `refresh_token`,
          client_id: this.getConfig(`clientId`),
          client_secret: this.getConfig(`clientSecret`),
          refresh_token: this.getConfig(`refreshToken`)
        };
      } else {
        data = {
          grant_type: `authorization_code`,
          redirect_uri: `urn:ietf:wg:oauth:2.0:oob`,
          client_id: this.getConfig(`clientId`),
          client_secret: this.getConfig(`clientSecret`),
          code: this.getConfig(`clientCode`),
        };
      }
      const options = {
        body: JSON.stringify(data)
      };
      const response = await FetchHelper.fetch(ACCESS_TOKEN_METHOD, url, null, options);
      const json = await response.json();
      this.setConfig(`accessToken`, json.access_token);
      this.setConfig(`accessTokenExpiry`, parseInt(now + json.expires_in));         
      if (json.refresh_token) {
        this.setConfig(`refresh_token`, json.refresh_token);
      }
      await this.writeConfig();
    }
    return this.getConfig(`accessToken`);
  }

  async getHeaders() {
    const accessToken = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'x-goog-api-version': 2
    };
  }

  async insert(fileBuffer, queryParams = {}) {
    const url = this.getUrl(INSERT_URL);
    Object.assign(queryParams, {
      uploadType: `media`
    });
    const options = {
      body: fileBuffer,
      headers: await this.getHeaders()
    };
    const response = await FetchHelper.fetch(INSERT_METHOD, url, queryParams, options);
    const json = await response.json();
    this.setConfig(`extensionId`, json.id);
    if (json.publicKey) {
      this.setConfig(`extensionKey`, json.publicKey);
    }
    await this.writeConfig();
  }

  async update(fileBuffer) {
    const url = this.getUrl(UPDATE_URL);
    const queryParams = {
      uploadType: `media`
    };
    const options = {
      body: fileBuffer,
      headers: await this.getHeaders()
    };    
    const response = await FetchHelper.fetch(UPDATE_METHOD, url, queryParams, options);
    const json = await response.json();
    if (!this.getConfig(`extensionKey`) && json.publicKey) {
      this.setConfig(`extensionKey`, json.publicKey);
      await this.writeConfig();
    }
  }

  async publish(queryParams = {}) {
    const url = this.getUrl(PUBLISH_URL);
    const options = {
      headers: await this.getHeaders()
    };
    return FetchHelper.fetch(PUBLISH_METHOD, url, queryParams, options);
  }
}

const chromePublisher = new ChromePublisher();

module.exports = chromePublisher;
