export interface SearchOptions {
  search: string;
  page: number;
  limit: number;
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
