import { Websocket, WebsocketBuilder } from "websocket-ts";
import {
  ServiceReport,
  HealthcheckProperties,
  HealthcheckReport,
  CompressedHealthcheckReport,
  HistoricalHealthcheckReport,
  CompressedHistoricalHealthcheckReport,
} from "./interfaces";
import { WS_BASE_URL } from "../axios";
import { AxiosResponse } from "axios";
import { axios } from "../";

const BASE = "/status";

interface healthcheckCallbackType {
  (report: HealthcheckReport): void;
}

let ws: Websocket | null;
let listening = false;

function decompressReports(
  services: string[],
  reports: (number[] | null)[][]
): HealthcheckReport[] {
  return reports.map((data) => {
    return decompressReport({
      services,
      data
    })
  });
}

function decompressReport(report: CompressedHealthcheckReport): HealthcheckReport {
  const decompressedReport: HealthcheckReport = {};

  let i = 0;
  for (const service of report.services) {
    const compressedService = report.data[i];
    if (compressedService === null) {
      decompressedReport[service] = null;

    } else {
      const decompressedService: ServiceReport = {
        ping: 0,
        success: 0,
        errors: 0,
      };

      for (let j = 0; j < HealthcheckProperties.length; j++) {
        decompressedService[ HealthcheckProperties[j] ] = compressedService[j];
      }

      decompressedReport[service] = decompressedService;
    }
    i++;
  }

  return decompressedReport;
}

export default class Healthcheck {
  static get listening() {
    return listening;
  }

  static listenReports(callback: healthcheckCallbackType): void {
    listening = true;

    ws = new WebsocketBuilder(WS_BASE_URL + BASE)
      .onMessage((ws, ev) => {
        if (!listening) {
          ws.close();
          return;
        }

        callback(decompressReport(JSON.parse(ev.data)));
      })
      .build();
  }

  static stopListening(): void {
    listening = false;
    ws?.close();
    ws = null;
  }

  static async getPastReports(interval: number): Promise<HistoricalHealthcheckReport> {
    const response: AxiosResponse<CompressedHistoricalHealthcheckReport> = await axios.get(
      `${BASE}/past`,
      { params: { interval } }
    );
    const { services, data, forInterval } = response.data;
    return {
      interval,
      services,
      data: decompressReports(services, data),
      forInterval: decompressReports(services, forInterval),
    };
  }
}