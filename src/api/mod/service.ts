import { AxiosResponse } from "axios";
import { axios } from "../";
import { ErrorResponse } from "../interfaces";
import { SanctionInformation } from "./interfaces";

export default class Mod {
  static async getSanction(
    playerId: number,
    token: string
  ): Promise<AxiosResponse<ErrorResponse | SanctionInformation>> {
    return await axios.get(`/users/${playerId}/sanction`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async sanctionPlayer(
    playerId: number,
    reason: string,
    token: string
  ): Promise<AxiosResponse<ErrorResponse | undefined>> {
    return await axios.post(
      `/users/${playerId}/sanction`,
      {},
      { params: { reason }, headers: { Authorization: `Bearer ${token}` } }
    );
  }

  static async cancelSanction(
    playerId: number,
    token: string
  ): Promise<AxiosResponse<ErrorResponse | undefined>> {
    return await axios.delete(`/users/${playerId}/sanction`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
