export type DateIndex = number;

export type Log<T> = {
  [key in keyof T]: [DateIndex, number | string][];
};

export interface ErrorResponse {
  success: false;
  status: number;
  error?: string;
  message?: string;
  translationKey?: string;
}

export interface SearchOptions {
  search: string;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  total: number;
  page: T[];
}

export interface LeaderboardPosition {
  position: number;
  accurate: boolean;
  outdated: boolean;
}

export type LeaderboardType =
  | "rounds"
  | "cheese"
  | "first"
  | "bootcamp"
  | "stats"
  | "shaman"
  | "survivor"
  | "racing"
  | "defilante"
  | "overall";

export type LeaderboardPeriod = "overall" | "daily" | "weekly" | "monthly";

export type Pagination = {
  page: number;
  limit: number;
};

export type CfmRole = "dev" | "admin" | "mod" | "translator";

export type TfmRole =
  | "admin"
  | "mod"
  | "sentinel"
  | "mapcrew"
  | "mapcrew"
  | "module"
  | "funcorp"
  | "fashion";
