const fs = require(`fs`);

const DEFAULT_CONFIG_PATH = `./bext.json`;
const DEFAULT_CONFIG_SPACING = 2;

class BrowserExtensionTools {
  constructor(
    configPath = DEFAULT_CONFIG_PATH,
    configSpacing = DEFAULT_CONFIG_SPACING
  ) {
    this._config = null;
    this.setConfigPath(configPath);
    this.setConfigSpacing(configSpacing);
  }

  setConfigPath(configPath) {
    this._configPath = configPath;
  }

  setConfigSpacing(configSpacing) {
    this._configSpacing = configSpacing;
  }

  readConfig() {
    return new Promise((resolve, reject) => {
      if (this._config) {
        resolve();
      } else {
        fs.readFile(this._configPath, (error, data) => {
          if (error) {
            reject(error);
          } else {
            this._config = JSON.parse(data);
            resolve();
          }
        });
      }
    });
  }

  writeConfig() {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(this._config, null, this._configSpacing);
      fs.writeFile(this._configPath, data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = BrowserExtensionTools;