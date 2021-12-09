import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import {
  axios,
  LeaderboardType,
  LeaderboardPeriod,
  Pagination,
  SearchOptions,
  PaginatedResponse,
  orderChangelogs,
  LeaderboardPosition,
} from "../";
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
  static async search(
    opt: Partial<SearchOptions>
  ): Promise<AxiosResponse<PaginatedResponse<BasePlayer>>> {
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
      params: {
        start: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
        recent: "true",
      },
    });
  }

  /** Get last seen players */
  static async getLastSeen(last: number): Promise<AxiosResponse<BasePlayer[]>> {
    return await axios.get(BASE, { params: { last } });
  }

  /** Get player leaderboard */
  static async getLeaderboard(
    order: LeaderboardType = "overall",
    period: LeaderboardPeriod = "overall",
    pagination?: Partial<Pagination>
  ): Promise<AxiosResponse<PaginatedResponse<PlayerLeaderboard>>> {
    pagination = {
      page: 1,
      limit: 50,
      ...pagination,
    };
    const { page, limit } = pagination;
    return await axios.get(BASE, {
      params: {
        order,
        period,
        page,
        limit,
      },
    });
  }

  static async getChangelogs<T extends PlayerChangelogTypes[]>(
    playerId: number | string,
    types: T
  ): Promise<PlayerChangelogs<T[number]>> {
    const summedTypes = types.reduce((b, c) => b + c, 0);
    const response: AxiosResponse<PlayerChangelogs<T[number]>> = await axios.get(
      `${BASE}/${playerId}/changelogs/${summedTypes}`
    );
    orderChangelogs(response.data);
    return response.data;
  }

  static async getPosition(order: LeaderboardType, value: number): Promise<LeaderboardPosition> {
    const response: AxiosResponse<LeaderboardPosition> = await axios.get(`/position/${order}`, {
      params: { value, entity: "player" },
    });
    return response.data;
  }
}
