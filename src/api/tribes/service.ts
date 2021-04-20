import { AxiosResponse } from "axios";
import { axios, SearchOptions } from "../";
import { BaseTribe, Tribe } from "./interfaces";

const BASE = "/tribes";

export default class Tribes {
  /** Search tribes */
  static async search(opt: Partial<SearchOptions>): Promise<AxiosResponse<BaseTribe[]>> {
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
}
