import { AuthService, BasePlayer, CfmRole } from "src/api";
import AuthAPI from "./api";

export default class AdminAPI {
  constructor(private readonly api: AuthAPI) {}

  async getPrivilegedPlayers(): Promise<string | BasePlayer[]> {
    const result = await AuthService.getPrivilegedPlayers(
      await this.api.authenticator.getSession()
    );
    if (typeof result === "undefined") {
      return "Internal server error";
    }

    return result;
  }

  async updateRoles(name: string, roles: CfmRole[]): Promise<string | undefined> {
    const result = await AuthService.updateRoles(
      name,
      roles,
      await this.api.authenticator.getSession()
    );

    if (result !== undefined) {
      return result.message;
    }
  }
}
