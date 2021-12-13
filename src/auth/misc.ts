import { AxiosResponse } from "axios";
import {
  Period,
  Player,
  PlayerChangelogs,
  PlayerChangelogTypes,
  PlayersService,
  Tribe,
  TribesService,
} from "src/api";
import AuthAPI from "./api";

export default class MiscAPI {
  constructor(private readonly api: AuthAPI) {}

  async getPlayer(playerId: number | string, period?: Period): Promise<AxiosResponse<Player>> {
    return await PlayersService.getById(
      playerId,
      period,
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

  async getTribe(playerId: number | string, period?: Period): Promise<AxiosResponse<Tribe>> {
    return await TribesService.getById(playerId, period, await this.api.authenticator.getSession());
  }
}
