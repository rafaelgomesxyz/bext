const { Publisher } = require(`@browser-extension-publisher/common`);

class PaleMoonPublisher extends Publisher {
  constructor() {
    super();
  }
}

const palemoonPublisher = new PaleMoonPublisher();

module.exports = palemoonPublisher;