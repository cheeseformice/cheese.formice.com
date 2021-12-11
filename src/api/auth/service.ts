import { AxiosResponse } from "axios";
import { PrivacySettings } from ".";
import { axios } from "../";
import { CfmRole, ErrorResponse } from "../interfaces";
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

  static async changePassword(hashedPassword: string, token: string): Promise<boolean> {
    const response = await axios.post(
      "/@me/password",
      { password: hashedPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.status === 204;
  }

  static async updatePrivacy(
    privacy: Partial<PrivacySettings>,
    token: string
  ): Promise<ErrorResponse | true> {
    const response: AxiosResponse<unknown> = await axios.patch(
      "/@me/privacy",
      privacy,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 204) {
      return true;
    }

    return response.data as ErrorResponse;
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
