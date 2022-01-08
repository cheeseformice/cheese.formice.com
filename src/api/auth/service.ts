import { AxiosResponse } from "axios";
import { PrivacySettings } from ".";
import { axios, BasePlayer, PeriodStats } from "../";
import { CfmRole, ErrorResponse, Period } from "../interfaces";
import {
  AuthError,
  LoginResponse,
  RefreshResponse,
  TicketResponse,
  AccountInformation,
} from "./interfaces";

export default class Auth {
  static async useTicket(ticket: string): Promise<AxiosResponse<TicketResponse | AuthError>> {
    return await axios.post("/session", {
      ticket,
    });
  }

  static async login(
    user: string,
    hashedPassword: string,
    remind: boolean
  ): Promise<AxiosResponse<LoginResponse | AuthError>> {
    return await axios.post("/session", {
      user,
      password: hashedPassword,
      remind,
    });
  }

  static async refresh(token: string): Promise<AxiosResponse<RefreshResponse>> {
    return await axios.post("/session", {
      refresh: token,
    });
  }

  static async fetchMyself(token: string): Promise<AxiosResponse<AccountInformation>> {
    return await axios.get("/@me", { headers: { Authorization: `Bearer ${token}` } });
  }

  static async getProgress(period: Period, token: string): Promise<PeriodStats> {
    const response: AxiosResponse<PeriodStats> = await axios.get("/@me/progress", {
      params: {
        start: period.start?.format("YYYY-MM-DD"),
        end: period.end?.format("YYYY-MM-DD"),
        recent: period.recent ? "true" : "false",
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  static async changePassword(
    oldPassword: string,
    newPassword: string,
    token: string
  ): Promise<ErrorResponse | true> {
    const response: AxiosResponse<ErrorResponse> = await axios.post(
      "/@me/password",
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 204) {
      return true;
    }
    return response.data;
  }

  static async updatePrivacy(
    privacy: Partial<PrivacySettings>,
    token: string
  ): Promise<ErrorResponse | true> {
    const response: AxiosResponse<unknown> = await axios.patch("/@me/privacy", privacy, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 204) {
      return true;
    }

    return response.data as ErrorResponse;
  }

  static async getPrivilegedPlayers(token: string): Promise<string | undefined | BasePlayer[]> {
    const response: AxiosResponse<ErrorResponse | BasePlayer[]> = await axios.get("/users/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return response.data as BasePlayer[];
    }
    const error = response.data as ErrorResponse;
    return error.message;
  }

  static async updateRoles(
    accountName: string,
    roles: CfmRole[],
    token: string
  ): Promise<ErrorResponse | undefined> {
    const response: AxiosResponse<unknown> = await axios.put(
      `/users/${accountName.replace("#", "-")}/roles`,
      { roles },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 204) {
      return;
    }

    return response.data as ErrorResponse;
  }
}
