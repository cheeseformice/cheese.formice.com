import { AxiosResponse } from "axios";
import { Player, PlayerChangelogs, PlayerChangelogTypes, PlayersService } from "src/api";
import AuthAPI from "./api";

export default class MiscAPI {
  constructor(private readonly api: AuthAPI) {}

  async getPlayer(playerId: number | string): Promise<AxiosResponse<Player>> {
    return await PlayersService.getById(
      playerId,
      await this.api.authenticator.getSession()
    );
  }

  async getPlayerChangelogs<T extends PlayerChangelogTypes[]>(
    playerId: number | string,
    types: T
  ): Promise<PlayerChangelogs<T[number]>> {
    return await PlayersService.getChangelogs(
      playerId,
      types,
      await this.api.authenticator.getSession()
    );
  }
}
