const {
  FetchHelper,
  Publisher
} = require(`@bext/common`);
const jwt = require(`jsonwebtoken`);

const BASE_URL = `https://addons.mozilla.org/api/v4`;
const INSERT_METHOD = `POST`;
const INSERT_URL = `/addons/`;
const UPDATE_METHOD = `PUT`;
const UPDATE_URL = `/addons/{extensionId}/versions/{version}/`;
const STATUS_METHOD = `GET`;
const STATUS_URL = `/addons/{extensionId}/versions/{version}/`;

class FirefoxPublisher extends Publisher {
  constructor(configPath, configSpacing) {
    super(`firefox`, configPath, configSpacing);
    this.baseUrl = BASE_URL;
  }

  async insert(fileStreamOrPath, params = {}) {
    const url = this.getUrl(INSERT_URL);
    await this.assignParams(params, {
      body: {
        upload: this.getFile(fileStreamOrPath)
      }
    });
    const response = await FetchHelper.fetch(INSERT_METHOD, url, params);
    if (response.json) {
      this.setConfig(`extensionId`, response.json.guid);
      await this.writeConfig();
    }
    return response;
  }

  async update(fileStreamOrPath, params = {}) {
    const url = this.getUrl(UPDATE_URL);
    await this.assignParams(params, {
      body: {
        upload: this.getFile(fileStreamOrPath)
      }
    });
    return FetchHelper.fetch(UPDATE_METHOD, url, params);
  }

  async publish(fileStreamOrPath, params = {}) {
    // firefox extensions are automatically published when approved
    return {};
  }

  async getStatus(params = {}) {
    const url = this.getUrl(STATUS_URL);
    await this.assignParams(params);
    return FetchHelper.fetch(STATUS_METHOD, url, params);
  }

  async getDefaultHeaders() {
    const token = await this.getToken();
    return {
      Authorization: `JWT ${token}`
    };
  }

  getToken() {
    return new Promise(async (resolve, reject) => {
      const now = Date.now() / 1e3;
      const payload = {
        iss: this.getConfig(`clientId`),
        jti: Math.random(),
        iat: now,
        exp: now + 300
      };
      jwt.sign(payload, this.getConfig(`clientSecret`), (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }

  async hasTokenExpired() {
    // jwt's need to be re-generated each time
    return true;
  }
}

const firefoxPublisher = new FirefoxPublisher();

module.exports = firefoxPublisher;