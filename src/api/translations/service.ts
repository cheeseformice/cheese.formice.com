import { AxiosResponse } from "axios";
import { axios } from "../";
import { FieldRequest, TranslationFields } from "./interfaces";

const BASE = "/translation";

export default class Translations {
    static async fetchFields(opt: Partial<FieldRequest>): Promise<AxiosResponse<TranslationFields>> {
        const params = new URLSearchParams();
        if (!!opt.fields)
            for (let i = 0; i < opt.fields.length; i++)
                params.append("field", opt.fields[i]);
        if (!!opt.start)
            params.append("start", opt.start);
        if (opt.all)
            params.append("all", "true");

        return await axios.get(`${BASE}/${opt.language || "en"}`, { params: params });
    }
}
