import { AxiosResponse } from "axios";
import { axios } from "../";
import {
  LoginResponse,
  SessionToken,
  JWT,
  AuthError,
  RefreshResponse,
  TicketResponse,
} from "./interfaces";
import jwtDecode from "jwt-decode";

let loadedTokens = false;

let refreshExpiration = 0;
let sessionExpiration = 0;
let sessionToken: string;
let refreshToken: string;
let session: SessionToken;

export default class Auth {
  static loadTokens(): void {
    loadedTokens = true;

    const storedRefresh = window.localStorage.getItem("refresh");
    if (typeof storedRefresh === "string") {
      Auth.setRefreshToken(storedRefresh);

      const storedSession = window.sessionStorage.getItem("session");
      if (typeof storedSession === "string") {
        Auth.setSessionToken(storedSession);
      }
    }
  }

  static prepareAuthError(response: AxiosResponse): AuthError {
    const data = response.data as AuthError;
    if (!!data.message) {
      data.success = false;
      return data;
    }

    return <AuthError>{
      success: false,
      message: `Unknown error. Status ${response.status}`,
    };
  }

  static setRefreshToken(token: string): void {
    refreshToken = token;
    const refresh = jwtDecode<JWT>(refreshToken);
    refreshExpiration = refresh.exp - 5; // account for 5 seconds of latency, just in case

    window.localStorage.setItem("refresh", refreshToken);
  }

  static setSessionToken(token: string): void {
    sessionToken = token;
    session = jwtDecode<SessionToken>(sessionToken);
    sessionExpiration = session.exp - 5; // account for 5 seconds of latency, just in case

    window.sessionStorage.setItem("session", sessionToken);
  }

  static async getSessionToken(): Promise<string | void> {
    if (!loadedTokens) {
      Auth.loadTokens();
    }

    const now = Math.floor(new Date().getTime() / 1000);

    if (now >= sessionExpiration) {
      if (now >= refreshExpiration) {
        return;
      }

      const newSessionToken = await Auth.refresh();
      if (!newSessionToken) {
        return;
      }
      Auth.setSessionToken(newSessionToken);
    }
    return sessionToken;
  }

  static async getSession(): Promise<SessionToken | void> {
    const token = await Auth.getSessionToken();
    if (typeof token === "string") {
      return session;
    }
  }

  static async refresh(): Promise<string | void> {
    const response: AxiosResponse<RefreshResponse> = await axios.post("/session", {
      refresh: refreshToken,
    });
    if (response.status === 200) {
      return response.data.session;
    }
  }

  static async login(
    user: string,
    password: string,
    remind: boolean
  ): Promise<LoginResponse | AuthError> {
    const response: AxiosResponse<LoginResponse | AuthError> = await axios.post("/session", {
      user,
      password,
      remind,
    });
    if (response.status === 200) {
      const data = response.data as LoginResponse;
      Auth.setRefreshToken(data.refresh);
      Auth.setSessionToken(data.session);

      data.success = true;
      return data;
    } else {
      return Auth.prepareAuthError(response);
    }
  }

  static async useTicket(ticket: string): Promise<TicketResponse | AuthError> {
    const response: AxiosResponse<TicketResponse | AuthError> = await axios.post("/session", {
      ticket,
    });
    if (response.status === 200) {
      const data = response.data as TicketResponse;
      Auth.setRefreshToken(data.refresh);
      Auth.setSessionToken(data.session);

      data.success = true;
      return data;
    } else {
      return Auth.prepareAuthError(response);
    }
  }
}
