const axios = require("axios");

class Api {
  static BASE_URL = "http://localhost:8080/api";

  constructor() {
    this.axios = axios.create({
      baseURL: Api.BASE_URL,
      withCredentials: false,
    });
  }

  get(url, config) {
    return this.axios.get(url, config);
  }

  post(url, data, config) {
    return this.axios.post(url, data, config);
  }

  put(url, data, config) {
    return this.axios.put(url, data, config);
  }

  delete(url, config) {
    return this.axios.delete(url, config);
  }
}

module.exports = Api;
