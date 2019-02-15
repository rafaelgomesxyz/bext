const {
  FetchHelper,
  Publisher
} = require(`@bext/common`);

const BASE_URL = ``;

class FirefoxPublisher extends Publisher {
  constructor(configPath, configSpacing) {
    super(`firefox`, configPath, configSpacing);
    this._baseUrl = BASE_URL;
  }
}

const firefoxPublisher = new FirefoxPublisher();

module.exports = firefoxPublisher;