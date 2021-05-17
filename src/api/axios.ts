import qs from "qs";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

export const API_BASE_URL = "https://cfmtest.tk/api";

const api = applyCaseMiddleware(
  axios.create({
    baseURL: API_BASE_URL,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  })
);

// Prevent axios from throwing error on error status
api.defaults.validateStatus = function () {
  return true;
};

export default api;
