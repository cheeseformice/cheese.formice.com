import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { axios, SearchOptions } from "../";
import { BasePlayer, Player, PlayerChangelogs, PlayerChangelogTypes } from "./interfaces";

const BASE = "/players";

export default class Players {
  /** Search players */
  static async search(opt: Partial<SearchOptions>): Promise<AxiosResponse<BasePlayer[]>> {
    opt = {
      limit: 5,
      page: 1,
      search: "",
      ...opt,
    };
    return await axios.get(BASE, {
      params: opt,
    });
  }

  /** Get player by name / id */
  static async getById(playerId: number | string): Promise<AxiosResponse<Player>> {
    return await axios.get(`${BASE}/${encodeURIComponent(playerId)}`, {
      params: { start: dayjs().subtract(7, "days").format("YYYY-MM-DD") },
    });
  }

  /** Get multiple type player changelogs */
  static async getChangeLogs<T extends PlayerChangelogTypes[]>(
    playerId: number | string,
    types: T
  ): Promise<AxiosResponse<PlayerChangelogs<T[number]>>>;

  /** Get one type player changelogs */
  static async getChangeLogs<T extends PlayerChangelogTypes>(
    playerId: number | string,
    types: T
  ): Promise<AxiosResponse<PlayerChangelogs<T>>>;

  static async getChangeLogs(playerId: number | string, types: number | number[]) {
    const summedTypes = types instanceof Array ? types.reduce((b, c) => b + c, 0) : types;
    return await axios.get(`${BASE}/${playerId}/changelogs/${summedTypes}`);
  }
}
