class Publisher {
  constructor(config) {
    if (config) {
      this.setConfig(config);
    }
  }

  setConfig(config) {
    this.config = config;
  }

  setConfigFromFile(fileName) {
    const config = require(fileName);
    this.setConfig(config);
  }
}

module.exports = {
  Publisher
};