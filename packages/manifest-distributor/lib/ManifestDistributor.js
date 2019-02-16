const {
  IConfigStore
} = require(`@bext/common`);
const bcdManifest = require(`mdn-browser-compat-data`).webextensions.manifest;
const fs = require(`fs`);

const DEFAULT_SPACING = 2;

class ManifestDistributor extends IConfigStore {
  constructor(configPath, configSpacing) {
    super(configPath, configSpacing);
    this.manifest = null;
  }

  from(manifestObjectOrPath) {
    return new Promise((resolve, reject) => {
      if (typeof manifestObjectOrPath === `string`) {
        fs.readFile(manifestObjectOrPath, (error, data) => {
          if (error) {
            reject(error);
          } else {
            this.manifest = JSON.parse(data);
            resolve(this);
          }
        });
      } else {
        this.manifest = manifestObjectOrPath;
        resolve(this);
      }
    });
  }

  to(browsers) {
    const promises = [];
    for (const browser in browsers) {
      if (browsers.hasOwnProperty(browser)) {
        switch (browser) {
          case `chrome`:
            promises.push(this.toChrome(browsers[browser].destPath, browsers[browser].options));
            break;
          case `firefox`:
            promises.push(this.toFirefox(browsers[browser].destPath, browsers[browser].options));
            break;
          case `edge`:
            promises.push(this.toEdge(browsers[browser].destPath, browsers[browser].options));
            break;
          default:
            throw `Browser ${browser} not supported.`;
        }
      }
    }
    return Promise.all(promises);
  }

  toChrome(destPath, options = {}) {
    return new Promise((resolve, reject) => {
      options = Object.assign({}, {
        spacing: DEFAULT_SPACING
      }, options);
      const manifest = this.getManifestCopy();
      this.makeManifestCompatible(manifest, `chrome`);
      if (options.addExtensionKey) {
        manifest.key = this.getConfig(`chrome`, `extensionKey`);
      }
      if (destPath) {
        fs.writeFile(destPath, JSON.stringify(manifest, null, options.spacing), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        resolve(manifest);
      }
    });
  }

  toFirefox(destPath, options = {}) {
    return new Promise((resolve, reject) => {
      options = Object.assign({}, {
        spacing: DEFAULT_SPACING
      }, options);
      const manifest = this.getManifestCopy();
      this.makeManifestCompatible(manifest, `firefox`);
      if (options.addExtensionId) {
        manifest.browser_specific_settings = {
          gecko: {
            id: this.getConfig(`firefox`, `extensionId`)
          }
        };
      }
      if (destPath) {
        fs.writeFile(destPath, JSON.stringify(manifest, null, options.spacing), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        resolve(manifest);
      }
    });
  }

  toEdge(destPath, options = {}) {
    return new Promise((resolve, reject) => {
      options = Object.assign({}, {
        spacing: DEFAULT_SPACING
      }, options);
      const manifest = this.getManifestCopy();
      this.makeManifestCompatible(manifest, `edge`);
      if (destPath) {
        fs.writeFile(destPath, JSON.stringify(manifest, null, options.spacing), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        resolve(manifest);
      }
    });
  }

  getManifestCopy() {
    return JSON.parse(JSON.stringify(this.manifest));
  }

  makeManifestCompatible(manifest, browser) {
    for (const key in manifest) {
      if (manifest.hasOwnProperty(key) && !this.isKeyCompatible(browser, key)) {
        delete manifest[key];
      }
    }
    if (manifest.optional_permissions) {
      manifest.optional_permissions = manifest.optional_permissions.filter(x => this.isHostPermission(x) || this.isKeyCompatible(browser, `optional_permissions`, x));
    }
    if (manifest.permissions) {
      manifest.permissions = manifest.permissions.filter(x => this.isHostPermission(x) || this.isKeyCompatible(browser, `permissions`, x));
    }
  }

  isKeyCompatible(browser, manifestKey, key) {
    let isCompatible = false;
    const data = bcdManifest[manifestKey];
    if (data) {
      const compatData = key ? data[key] : data;
      if (compatData) {
        const browserData = compatData.__compat.support[browser];
        if (browserData) {
          if (Array.isArray(browserData)) {
            isCompatible = !!browserData.filter(x => !!x.version_added)[0];
          } else {
            isCompatible = !!browserData.version_added;
          }
        }
      } else if (browser === `chrome`) {
        isCompatible = true;
      }
    }
    return isCompatible;
  }

  isHostPermission(permission) {
    return !!permission.match(/^(\*|https?|file|ftp)/);
  }
}

const manifestDistributor = new ManifestDistributor();

module.exports = manifestDistributor;