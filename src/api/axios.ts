import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

export const API_BASE_URL = "https://cfmtest.tk/api";

const api = applyCaseMiddleware(
  axios.create({
    baseURL: API_BASE_URL,
  })
);

// Prevent axios from throwing error on error status
api.defaults.validateStatus = function () {
  return true;
};

export default api;
