import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { axios, LeaderboardType, Pagination, SearchOptions } from "../";
import {
  BasePlayer,
  Player,
  PlayerChangelogs,
  PlayerChangelogTypes,
  PlayerLeaderboard,
} from "./interfaces";

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

  /** Get player leaderboard */
  static async getLeaderboard(
    order: LeaderboardType = "overall",
    pagination?: Partial<Pagination>
  ): Promise<AxiosResponse<PlayerLeaderboard[]>> {
    pagination = {
      page: 1,
      limit: 50,
      ...pagination,
    };
    const { page, limit } = pagination;
    return await axios.get(BASE, {
      params: {
        order,
        page,
        limit,
      },
    });
  }

  static async getChangeLogs<T extends PlayerChangelogTypes[]>(
    playerId: number | string,
    types: T
  ): Promise<AxiosResponse<PlayerChangelogs<T[number]>>> {
    const summedTypes = types.reduce((b, c) => b + c, 0);
    return await axios.get(`${BASE}/${playerId}/changelogs/${summedTypes}`);
  }
}
