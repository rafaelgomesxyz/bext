const {
  FetchHelper,
  Publisher
} = require(`@bext/common`);

const BASE_URL = ``;

class PhoebusPublisher extends Publisher {
  constructor(configPath, configSpacing) {
    super(`phoebus`, configPath, configSpacing);
    this.baseUrl = BASE_URL;
  }

  async insert(fileStreamOrPath, params = {}) {
  }

  async update(fileStreamOrPath, params = {}) {
  }

  async publish(fileStreamOrPath, params = {}) {
  }

  async getStatus(params = {}) {
  }

  async getDefaultHeaders() {
  }

  async getToken() {
  }

  async hasTokenExpired() {
  }
}

const phoebusPublisher = new PhoebusPublisher();

module.exports = phoebusPublisher;