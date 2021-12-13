import { AxiosResponse } from "axios";
import {
  axios,
  LeaderboardType,
  LeaderboardPeriod,
  Pagination,
  SearchOptions,
  PaginatedResponse,
  orderChangelogs,
  LeaderboardPosition,
  Period,
} from "../";
import {
  BaseTribe,
  Tribe,
  TribeLeaderboard,
  TribeChangelogTypes,
  TribeChangelogs,
} from "./interfaces";
import { BasePlayer, PlayerLeaderboard } from "../players/interfaces";

const BASE = "/tribes";

export default class Tribes {
  /** Search tribes */
  static async search(
    opt: Partial<SearchOptions>
  ): Promise<AxiosResponse<PaginatedResponse<BaseTribe>>> {
    opt = {
      limit: 5,
      page: 1,
      search: "",
      ...opt,
    };
    return await axios.get(BASE, { params: opt });
  }

  /** Get player by name / id */
  static async getById(
    tribeId: number | string,
    period?: Period,
    token?: string
  ): Promise<AxiosResponse<Tribe>> {
    let headers;
    if (!!token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return await axios.get(`${BASE}/${encodeURIComponent(tribeId)}`, {
      params: period
        ? {
            start: period.start?.format("YYYY-MM-DD"),
            recent: period.recent ? "true" : "false",
            end: period.end?.format("YYYY-MM-DD"),
          }
        : undefined,
      headers,
    });
  }

  /** Get last seen players */
  static async getLastSeen(last: number): Promise<AxiosResponse<BaseTribe[]>> {
    return await axios.get(BASE, { params: { last } });
  }

  /** Get player leaderboard */
  static async getLeaderboard(
    order: LeaderboardType = "overall",
    period: LeaderboardPeriod = "overall",
    pagination?: Partial<Pagination>
  ): Promise<AxiosResponse<PaginatedResponse<TribeLeaderboard>>> {
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

  static async getChangelogs<T extends TribeChangelogTypes[]>(
    tribeId: number | string,
    types: T
  ): Promise<TribeChangelogs<T[number]>> {
    const summedTypes = types.reduce((b, c) => b + c, 0);
    const response: AxiosResponse<TribeChangelogs<T[number]>> = await axios.get(
      `${BASE}/${tribeId}/changelogs/${summedTypes}`
    );
    orderChangelogs(response.data);
    return response.data;
  }

  static async getMembers(
    tribeId: number | string,
    search = "",
    order: LeaderboardType | "" = "",
    period: LeaderboardPeriod | "" = "",
    pagination?: Partial<Pagination>
  ): Promise<AxiosResponse<PaginatedResponse<BasePlayer> | PaginatedResponse<PlayerLeaderboard>>> {
    pagination = {
      page: 1,
      limit: 50,
      ...pagination,
    };
    const { page, limit } = pagination;
    return await axios.get(`${BASE}/${tribeId}/members`, {
      params: {
        search,
        order,
        period,
        page,
        limit,
      },
    });
  }

  static async getPosition(order: LeaderboardType, value: number): Promise<LeaderboardPosition> {
    const response: AxiosResponse<LeaderboardPosition> = await axios.get(`/position/${order}`, {
      params: { value, entity: "tribe" },
    });
    return response.data;
  }
}
