import { AxiosResponse } from "axios";
import { axios, LeaderboardType, Pagination, SearchOptions, PaginatedResponse } from "../";
import { BaseTribe, Tribe, TribeLeaderboard } from "./interfaces";

const BASE = "/tribes";

export default class Tribes {
  /** Search tribes */
  static async search(opt: Partial<SearchOptions>): Promise<AxiosResponse<PaginatedResponse<BaseTribe>>> {
    opt = {
      limit: 5,
      page: 1,
      search: "",
      ...opt,
    };
    return await axios.get(BASE, { params: opt });
  }

  /** Get player by name / id */
  static async getById(tribeId: number | string): Promise<AxiosResponse<Tribe>> {
    return await axios.get(`${BASE}/${encodeURIComponent(tribeId)}`);
  }

  /** Get last seen players */
  static async getLastSeen(amount: number): Promise<AxiosResponse<BaseTribe[]>> {
    return await axios.get(BASE, {
      params: {
        last: amount
      }
    });
  }

  /** Get player leaderboard */
  static async getLeaderboard(
    order: LeaderboardType = "overall",
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
        page,
        limit,
      },
    });
  }
}
