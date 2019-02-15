const BrowserExtensionTools = require(`./BrowserExtensionTools.js`);

class Publisher extends BrowserExtensionTools {
  constructor(browser, configPath, configSpacing) {
    super(configPath, configSpacing);
    this._browser = browser;
  }

  setConfig(key, value) {
    this._config[this._browser][key] = value;
  }

  getConfig(key) {
    return this._config[this._browser][key];
  }

  getUrl(url) {
    if (url.match(/^\//)) {
      url = `${this._baseUrl}${url}`;
    }
    return url.replace(/%(.+?)%/g, (match, key) => this.getConfig(key));
  }
}

module.exports = Publisher;