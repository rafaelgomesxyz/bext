const fs = require(`fs`);

const DEFAULT_CONFIG_PATH = `./bext.json`;
const DEFAULT_CONFIG_SPACING = 2;

class IConfigStore {
  constructor(
    configPath = DEFAULT_CONFIG_PATH,
    configSpacing = DEFAULT_CONFIG_SPACING
  ) {
    this.config = null;
    this.setConfigPath(configPath);
    this.setConfigSpacing(configSpacing);
  }

  setConfigPath(configPath) {
    this.configPath = configPath;
  }

  setConfigSpacing(configSpacing) {
    this.configSpacing = configSpacing;
  }

  init() {
    return this.readConfig();
  }

  readConfig() {
    return new Promise((resolve, reject) => {
      if (this.config) {
        resolve();
      } else {
        fs.readFile(this.configPath, (error, data) => {
          if (error) {
            reject(error);
          } else {
            this.config = JSON.parse(data);
            resolve();
          }
        });
      }
    });
  }

  writeConfig() {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(this.config, null, this.configSpacing);
      fs.writeFile(this.configPath, data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  setConfig(browser, key, value) {
    if (!this.config[browser]) {
      this.config[browser] = {};
    }
    this.config[browser][key] = value;
  }

  getConfig(browser, key) {
    let config;
    if (browser) {
      if (key) {
        config = this.config[browser][key];
      } else {
        config = Object.assign({}, this.config[browser]);
      }
    } else {
      config = {};
      for (const browser in this.config) {
        config[browser] = Object.assign({}, this.config[browser]);
      }
    }
    return config;
  }
}

module.exports = IConfigStore;