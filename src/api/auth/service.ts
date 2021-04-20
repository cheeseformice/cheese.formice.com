import { AxiosResponse } from "axios";
import { axios } from "../";

const BASE = "/users";

interface LoginResponse {
  refresh: string;
  session: string;
}

export default class Auth {
  static async requestRegistration(username: string): Promise<AxiosResponse> {
    return await axios.post(`${BASE}/${username}`);
  }

  static async validate(username: string, password: string, token: string): Promise<AxiosResponse> {
    return await axios.post(`${BASE}/${username}/validation`, { password, token });
  }

  static async login(user: string, password: string): Promise<AxiosResponse<LoginResponse>> {
    return await axios.post("/session", { user, password });
  }
}
