export const HealthcheckProperties = ["ping", "success", "errors"] as const;
export type HealthcheckProperty = typeof HealthcheckProperties[number];

export type ServiceReport = Record<HealthcheckProperty, number>;

export type HealthcheckReport = Record<string, ServiceReport | null>;

export interface CompressedHealthcheckReport {
  services: string[];
  data: (number[] | null)[];
}

export interface HistoricalHealthcheckReport {
  interval: number;
  services: string[];
  data: HealthcheckReport[];
  forInterval: HealthcheckReport[];
}

export interface CompressedHistoricalHealthcheckReport {
  services: string[];
  interval: number;
  data: (number[] | null)[][];
  forInterval: (number[] | null)[][];
}
