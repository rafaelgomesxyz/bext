const { Publisher } = require(`@browser-extension-publisher/common`);

class FirefoxPublisher extends Publisher {
  constructor() {
    super();
  }
}

const firefoxPublisher = new FirefoxPublisher();

module.exports = firefoxPublisher;