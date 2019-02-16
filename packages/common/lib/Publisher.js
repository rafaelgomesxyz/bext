const fs = require(`fs`);

const IConfigStore = require(`./IConfigStore.js`);

class Publisher extends IConfigStore {
  constructor(browser, configPath, configSpacing) {
    super(configPath, configSpacing);
    this.browser = browser;
  }

  getUrl(url) {
    if (url.match(/^\//)) {
      url = `${this.baseUrl}${url}`;
    }
    return url;
  }

  getFile(fileStreamOrPath) {
    let file;
    if (typeof fileStreamOrPath === `string`) {
      file = fs.createReadStream(fileStreamOrPath);
    } else {
      file = fileStreamOrPath;
    }
    return file;
  }

  async assignParams(params, requiredParams = {}) {
    const keys = [
      `path`,
      `query`,
      `header`,
      `body`,
      `ftp`
    ];
    const defaultParams = {
      path: this.getConfig(),
      header: await this.getDefaultHeaders(),
      ftp: this.getConfig()
    };
    for (const key of keys) {
      if (!params[key] || typeof params[key].read !== `function`) {
        params[key] = Object.assign({},
          defaultParams[key] || {},
          params[key] || {},
          requiredParams[key] || {}
        );
      }
    }
  }

  setConfig(key, value) {
    super.setConfig(this.browser, key, value);
  }

  getConfig(key) {
    return super.getConfig(this.browser, key);
  }
}

module.exports = Publisher;