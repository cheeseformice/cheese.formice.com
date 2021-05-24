import { AxiosResponse } from "axios";
import { axios } from "../";
import { FieldRequest, TranslationFields } from "./interfaces";

const BASE = "/translation";

export default class Translations {
  static async fetchFields(opt: Partial<FieldRequest>): Promise<AxiosResponse<TranslationFields>> {
    const params = {
      field: opt.fields,
      start: opt.start,
      all: opt.all,
    };
    return await axios.get(`${BASE}/${opt.language || "en"}`, { params });
  }

  static withGender(text: string, gender: "male" | "female") {
    const option = gender === "male" ? "$1" : "$2";
    return text.replace(/\((.*?)\|(.*?)\)/g, option);
  }
}
