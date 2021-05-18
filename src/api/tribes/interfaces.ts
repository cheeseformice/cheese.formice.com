export interface BaseTribe {
  id: number;
  name: string;
}

export interface Tribe extends BaseTribe {
  members: Members;
  stats: Stats;
  period: Stats & {
    start: string;
    end: string;

    members: number;
    active: number;
  };
}

export enum TribeChangelogTypes {
  Members = 1,
  Active = 2,
  Shaman = 4,
  Normal = 8,
  Survivor = 16,
  Racing = 32,
  Defilante = 64,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TribeChangelogs<T extends number = any> {
  id: number;
  name: string;
  dates: string[];
  members: T extends TribeChangelogTypes.Members ? Log<number> : undefined;
  active: T extends TribeChangelogTypes.Active ? Log<number> : undefined;
  normal: T extends TribeChangelogTypes.Normal ? Log<Normal> : undefined;
  shaman: T extends TribeChangelogTypes.Shaman ? Log<Shaman> : undefined;
  survivor: T extends TribeChangelogTypes.Survivor ? Log<Survivor> : undefined;
  racing: T extends TribeChangelogTypes.Racing ? Log<Racing> : undefined;
  defilante: T extends TribeChangelogTypes.Defilante ? Log<Defilante> : undefined;
}

type DateIndex = number;

type Log<T> = {
  [key in keyof T]: [DateIndex, number | string][];
};

export interface TribeLeaderboard {
  id: number;
  name: string;
  rounds: number;
  cheese: number;
  first: number;
  bootcamp: number;
  stats: number;
  shaman: number;
  survivor: number;
  racing: number;
  defilante: number;
  overall: number;
}

export interface Members {
  total: number;
  active: number;
}

export interface Stats {
  shaman: Shaman;
  normal: Normal;
  survivor: Survivor;
  racing: Racing;
  defilante: Defilante;
}

export interface Defilante {
  rounds: number;
  finished: number;
  points: number;
}

export interface Normal {
  rounds: number;
  cheese: number;
  first: number;
  bootcamp: number;
}

export interface Racing {
  rounds: number;
  finished: number;
  first: number;
  podium: number;
}

export interface Shaman {
  cheese: number;
  savesDivine: number;
  savesNormal: number;
  savesHard: number;
}

export interface Survivor {
  rounds: number;
  killed: number;
  shaman: number;
  survivor: number;
}
