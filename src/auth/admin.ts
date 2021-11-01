import { AuthService, CfmRole } from "src/api";
import AuthAPI from "./api";

export default class AdminAPI {
  constructor(private readonly api: AuthAPI) { };

  async updateRoles(name: string, roles: CfmRole[]): Promise<string | undefined> {
    const result = await AuthService.updateRoles(
      name, roles,
      await this.api.authenticator.getSession()
    );

    if (result !== undefined) {
      return result.message;
    }
  }
}