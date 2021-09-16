import { AxiosResponse } from "axios";
import { axios, camelCaseDict, Player, PlayersService } from "../";
import {
  LoginResponse,
  SessionToken,
  JWT,
  AuthError,
  RefreshResponse,
  TicketResponse,
} from "./interfaces";
import jwtDecode from "jwt-decode";
import { CfmRole, ErrorResponse } from "../interfaces";

let loadedTokens = false;

let refreshExpiration = 0;
let sessionExpiration = 0;
let sessionToken: string;
let refreshToken: string;
let session: SessionToken;
let playerInfo: Player;

const enc = new TextEncoder();
const performHash = async (algo: string, text: string): Promise<string> => {
  const buffer = await crypto.subtle.digest(algo, enc.encode(text));
  const array = Array.from(new Uint8Array(buffer));
  return array.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export default class Auth {
  static async hashPassword(password: string): Promise<string> {
    const hashed = await performHash("SHA-512", password);
    const salt = await performHash("SHA-512", "what are you doing reading this!! dont do it >:(");
    return await performHash("SHA-512", hashed + salt);
  }

  static logout(): void {
    refreshExpiration = 0;
    sessionExpiration = 0;
    window.localStorage.removeItem("refresh");
    window.localStorage.removeItem("playerInfo");
    window.sessionStorage.removeItem("session");
  }

  static loadTokens(): void {
    loadedTokens = true;

    const storedRefresh = window.localStorage.getItem("refresh");
    if (typeof storedRefresh === "string") {
      Auth.setRefreshToken(storedRefresh);

      const storedPlayer = window.localStorage.getItem("playerInfo");
      if (typeof storedPlayer === "string") {
        Auth.setPlayerInfo(JSON.parse(storedPlayer));
      }

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
    const refresh = camelCaseDict(jwtDecode<JWT>(refreshToken));
    refreshExpiration = refresh.exp - 5; // account for 5 seconds of latency, just in case

    window.localStorage.setItem("refresh", refreshToken);
  }

  static setPlayerInfo(player: Player): void {
    playerInfo = player;

    window.localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
  }

  static setSessionToken(token: string): void {
    sessionToken = token;
    session = camelCaseDict(jwtDecode<SessionToken>(sessionToken));
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

  static async getPlayerInfo(): Promise<Player | void> {
    const session = await Auth.getSessionToken();
    if (!session) {
      return;
    }
    return playerInfo;
  }

  static async fetchPlayerInfo(): Promise<Player | void> {
    const session = await Auth.getSession();
    if (!session) {
      return;
    }
    const player = await PlayersService.getById(session.user);
    if (!player.data) {
      return;
    }

    Auth.setPlayerInfo(player.data);
    return player.data;
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
    password = await Auth.hashPassword(password);
    const response: AxiosResponse<LoginResponse | AuthError> = await axios.post("/session", {
      user,
      password,
      remind,
    });
    if (response.status === 200) {
      window.localStorage.setItem("loginRemind", JSON.stringify(remind));

      const data = response.data as LoginResponse;
      Auth.setRefreshToken(data.refresh);
      Auth.setSessionToken(data.session);
      await Auth.fetchPlayerInfo();

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
      await Auth.fetchPlayerInfo();

      data.success = true;
      return data;
    } else {
      return Auth.prepareAuthError(response);
    }
  }

  static async changePassword(password: string): Promise<boolean> {
    const hashedPassword = await Auth.hashPassword(password);
    const token = await Auth.getSessionToken();
    if (!token) {
      return false;
    }
    const player = await Auth.getPlayerInfo();
    if (!player) {
      return false;
    }

    const response = await axios.post(
      "/@me/password",
      { password: hashedPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status !== 204) {
      return false;
    }

    // login again with the new password (as current refresh token is now invalid)
    const remind = window.localStorage.getItem("loginRemind") === "true";
    const result = await Auth.login(player.name, password, remind);
    return result.success;
  }

  static async updateRoles(playerName: string, roles: CfmRole[]): Promise<string | undefined> {
    const token = await Auth.getSessionToken();
    if (!token) {
      return "Unauthorized";
    }

    const response: AxiosResponse<unknown> = await axios.put(
      `/users/${playerName.replace("#", "-")}/roles`,
      { roles },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 204) {
      return;
    }

    return (response.data as ErrorResponse).message;
  }
}
