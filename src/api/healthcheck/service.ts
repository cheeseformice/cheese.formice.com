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

let lastListenerId = 0;
let activeListeners = 0;
const listeners: Record<number, healthcheckCallbackType> = {};
let ws: Websocket | null;
let listening = false;

function decompressReports(
  services: string[],
  reports: (number[] | null)[][]
): HealthcheckReport[] {
  return reports.map((data) => {
    return decompressReport({
      services,
      data,
    });
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
        decompressedService[HealthcheckProperties[j]] = compressedService[j];
      }

      decompressedReport[service] = decompressedService;
    }
    i++;
  }

  return decompressedReport;
}

export default class Healthcheck {
  static addListener(callback: healthcheckCallbackType): number {
    activeListeners += 1;
    lastListenerId += 1;

    listeners[lastListenerId] = callback;

    if (activeListeners === 1) {
      Healthcheck.startListening();
    }

    return lastListenerId;
  }

  static removeListener(id: number): void {
    delete listeners[id];
    activeListeners -= 1;

    if (activeListeners === 0) {
      Healthcheck.stopListening();
    }
  }

  static startListening(): void {
    if (listening) return;

    listening = true;

    ws = new WebsocketBuilder(WS_BASE_URL + BASE)
      .onMessage((ws, ev) => {
        if (!listening) {
          ws.close();
          return;
        }

        const report = decompressReport(JSON.parse(ev.data));
        for (const callback of Object.values(listeners)) {
          callback(report);
        }
      })
      .build();
  }

  static stopListening(): void {
    if (!listening) return;

    listening = false;
    ws?.close();
    ws = null;
  }

  static async getCurrentStatus(): Promise<HealthcheckReport> {
    const response: AxiosResponse<CompressedHealthcheckReport> = await axios.get(`${BASE}/current`);

    return decompressReport(response.data);
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
