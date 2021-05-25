import qs from "qs";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { DOMAIN } from "src/common/vars";

const URL = `${DOMAIN}/api`;
export const API_BASE_URL = `https://${URL}`;
export const WS_BASE_URL = `wss://${URL}`;

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
