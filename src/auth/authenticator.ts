import jwtDecode from "jwt-decode";
import {
  AccountInformation,
  AuthError,
  AuthService,
  camelCaseDict,
  LoginResponse,
  RefreshResponse,
} from "src/api";
import AuthAPI from "./api";
import { JWT } from "./interfaces";

const enc = new TextEncoder();
const performHash = async (algo: string, text: string): Promise<string> => {
  const buffer = await crypto.subtle.digest(algo, enc.encode(text));
  const array = Array.from(new Uint8Array(buffer));
  return array.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const hashPassword = async (password: string): Promise<string> => {
  // Password is both hashed client-side and server-side
  const hashed = await performHash("SHA-512", password);
  const salt = await performHash("SHA-512", "what are you doing reading this!! dont do it >:(");
  return await performHash("SHA-512", hashed + salt);
};

interface TicketLoginResponse {
  success: boolean;
  hasPassword: boolean;
}

interface SetAccountCallback {
  (state: AccountInformation | undefined): void;
}

export default class Authenticator {
  private refresh?: string;
  private session?: string;

  constructor(private readonly api: AuthAPI, private readonly setAccount: SetAccountCallback) {
    this.refresh = window.localStorage.getItem("refresh") || undefined;
    this.session = window.sessionStorage.getItem("session") || undefined;

    if (this.refresh) {
      void this.checkAccount();
    } else {
      this.setAccount(undefined);
    }
  }

  private successfulLogin(response: LoginResponse) {
    this.refresh = response.refresh;
    window.localStorage.setItem("refresh", this.refresh);

    this.setSession(response);
  }

  private setSession(response: RefreshResponse) {
    this.session = response.session;
    window.sessionStorage.setItem("session", this.session);

    void this.checkAccount();
  }

  private async checkAccount() {
    const session = await this.getSession(true);
    if (session === undefined) {
      // session was expired
      this.refresh = undefined;
      this.session = undefined;
      window.localStorage.removeItem("refresh");
      window.sessionStorage.removeItem("session");
      this.setAccount(undefined);
      return;
    }

    const response = await AuthService.fetchMyself(session);
    this.setAccount(response.data);
  }

  logout(): boolean {
    if (!this.api.state?.logged) {
      throw new Error("Trying to log out again when already logged out.");
    }

    window.localStorage.removeItem("refresh");
    window.sessionStorage.removeItem("session");
    this.setAccount(undefined);

    return true;
  }

  async useTicket(ticket: string): Promise<TicketLoginResponse> {
    if (this.api.state?.logged) {
      throw new Error("Trying to log in again when already logged in.");
    }

    let hasPassword = false;
    const response = await AuthService.useTicket(ticket);

    if (response.data.success) {
      hasPassword = response.data.hasPassword;
      this.successfulLogin(response.data);
    }

    return {
      success: response.data.success,
      hasPassword,
    };
  }

  async login(
    user: string,
    password: string,
    remember: boolean
  ): Promise<LoginResponse | AuthError> {
    if (this.api.state?.logged) {
      throw new Error("Trying to log in again when already logged in.");
    }

    password = await hashPassword(password);
    const response = await AuthService.login(user, password, remember);

    if (response.data.success) {
      this.successfulLogin(response.data);
    }

    return response.data;
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<string | undefined | true> {
    if (!this.api.state?.logged) {
      throw new Error("Trying to change password as a guest.");
    }

    oldPassword = await hashPassword(oldPassword);
    newPassword = await hashPassword(newPassword);
    const session = await this.getSession();
    const success = await AuthService.changePassword(oldPassword, newPassword, session);

    if (success === true) {
      return true;
    }

    return success.translationKey || success.message;
  }

  async getSession(ignoreError?: false): Promise<string>;
  async getSession(ignoreError: true): Promise<string | undefined>;
  async getSession(ignoreError?: boolean) {
    if (!this.refresh) {
      if (ignoreError) {
        return;
      }
      throw new Error("No session available.");
    }

    const refresh = camelCaseDict(jwtDecode<JWT>(this.refresh));
    const now = new Date().getTime() / 1000;

    let session: JWT;
    let expiredSession: boolean;
    if (!this.session) {
      expiredSession = true;
    } else {
      session = camelCaseDict(jwtDecode<JWT>(this.session));
      // account for 5 seconds of latency, just in case
      expiredSession = now >= session.exp - 5;
    }

    if (expiredSession) {
      if (now < refresh.exp - 5) {
        const response = await AuthService.refresh(this.refresh);
        if (response.data.success) {
          this.setSession(response.data);
          return this.session;
        }
      }

      // if the function is still running, session wasn't renewed
      if (this.api.state?.logged) {
        this.logout();
      }
      if (ignoreError) {
        return;
      }
      throw new Error("No session available.");
    }

    return this.session;
  }
}
