import { PrivacySettings, AuthService, Period, PeriodStats } from "src/api";
import AuthAPI from "./api";

export default class AccountAPI {
  constructor(private readonly api: AuthAPI) {}

  async updatePrivacyField(
    key: keyof PrivacySettings,
    value: boolean
  ): Promise<string | undefined> {
    const privacy: Partial<PrivacySettings> = {};
    privacy[key] = value;

    const result = await AuthService.updatePrivacy(
      privacy,
      await this.api.authenticator.getSession()
    );

    if (result === true) {
      return;
    }
    return result.message;
  }

  async getProgress(period: Period): Promise<PeriodStats> {
    return await AuthService.getProgress(period, await this.api.authenticator.getSession());
  }
}
