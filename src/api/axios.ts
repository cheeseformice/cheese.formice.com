import qs from "qs";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { DOMAIN } from "src/common/vars";

let http;
if (window.location.hostname === "localhost" || DOMAIN === "cheese.formice.com") {
  http = "https:";
} else {
  http = window.location.protocol;
}
const ws = http === "http:" ? "ws:" : "wss:";

const URL = `${DOMAIN}/api`;
export const API_BASE_URL = `${http}//${URL}`;
export const WS_BASE_URL = `${ws}//${URL}`;

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
