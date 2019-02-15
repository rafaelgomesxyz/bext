const {
  FetchHelper,
  Publisher
} = require(`@bext/common`);

const BASE_URL = ``;

class PaleMoonPublisher extends Publisher {
  constructor(configPath, configSpacing) {
    super(`palemoon`, configPath, configSpacing);
    this._baseUrl = BASE_URL;
  }
}

const palemoonPublisher = new PaleMoonPublisher();

module.exports = palemoonPublisher;