import { ModService, SanctionInformation } from "src/api";
import AuthAPI from "./api";

export default class ModAPI {
  constructor(private readonly api: AuthAPI) {}

  async getSanction(playerId: number): Promise<SanctionInformation | string | undefined> {
    const result = await ModService.getSanction(
      playerId,
      await this.api.authenticator.getSession()
    );

    if (result.data.success === false) {
      return result.data.message;
    }
    return result.data;
  }

  async sanctionPlayer(playerId: number, reason: string): Promise<string | undefined> {
    const result = await ModService.sanctionPlayer(
      playerId,
      reason,
      await this.api.authenticator.getSession()
    );

    if (result.status === 204) {
      return;
    }
    return result.data?.message;
  }

  async cancelSanction(playerId: number): Promise<string | undefined> {
    const result = await ModService.cancelSanction(
      playerId,
      await this.api.authenticator.getSession()
    );

    if (result.status === 204) {
      return;
    }
    return result.data?.message;
  }
}
