const { Publisher } = require(`@browser-extension-publisher/common`);

class ChromePublisher extends Publisher {
  constructor() {
    super();
  }
}

const chromePublisher = new ChromePublisher();

module.exports = chromePublisher;