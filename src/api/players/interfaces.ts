import { CfmRole, Log, TfmRole } from "..";

export interface BasePlayer {
  id: number;
  name: string;
  cfmRoles: CfmRole[];
  tfmRoles: TfmRole[];
}

export interface Player extends BasePlayer {
  registration: string;
  lastLogin?: string;
  gender: "male" | "female" | null;
  title: number;
  tribe: Tribe | null;
  soulmate: BasePlayer | null;
  shop: {
    look: string;
    outfits: string[];
    mouseColor: number;
    shamanColor: number;
  };
  badges: string[];
  titles: string[];
  stats: Stats;
  disqualified: boolean;
  canQualify: boolean;
  period: PeriodStats;
}

export type PeriodStats = Stats & {
  start: string;
  end: string;
};

const NullStats: Stats = {
  shaman: {
    experience: 0,
    cheese: 0,
    savesNormal: 0,
    savesHard: 0,
    savesDivine: 0,
  },
  mouse: {
    rounds: 0,
    cheese: 0,
    first: 0,
    bootcamp: 0,
  },
  survivor: {
    rounds: 0,
    killed: 0,
    shaman: 0,
    survivor: 0,
  },
  racing: {
    rounds: 0,
    finished: 0,
    first: 0,
    podium: 0,
  },
  defilante: {
    rounds: 0,
    finished: 0,
    points: 0,
  },
  score: {
    stats: 0,
    shaman: 0,
    survivor: 0,
    racing: 0,
    defilante: 0,
    overall: 0,
  },
};

export const NullPlayer: Player = {
  id: 0,
  name: "Null#0001",
  registration: "2010-05-14T07:51:50.455000Z",
  cfmRoles: [],
  tfmRoles: [],
  gender: null,
  title: 0,
  tribe: null,
  soulmate: null,
  shop: {
    look: "1;0,0,0,0,0,0,0,0,0",
    outfits: [],
    mouseColor: 0,
    shamanColor: 0,
  },
  badges: [],
  titles: [],
  stats: NullStats,
  disqualified: false,
  canQualify: false,
  period: {
    ...NullStats,
    start: "2021-08-26",
    end: "2021-08-26",
  },
};

interface Stats {
  shaman: Shaman;
  mouse: Mouse;
  survivor: Survivor;
  racing: Racing;
  defilante: Defilante;
  score: Scores;
}

export enum PlayerChangelogTypes {
  Name = 1,
  Soulmate = 2,
  Tribe = 4,
  Look = 8,
  Badge = 16,
  Title = 32,
  Shaman = 64,
  Mouse = 128,
  Survivor = 256,
  Racing = 512,
  Defilante = 1024,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PlayerChangelogs<T extends number = any> {
  id: number;
  name: string;
  dates: string[];
  cfmRoles: string[];
  tfmRoles: string[];
  names: T extends PlayerChangelogTypes.Name ? Log<string> : undefined;
  soulmate: T extends PlayerChangelogTypes.Soulmate ? Log<BasePlayer> : undefined;
  tribe: T extends PlayerChangelogTypes.Tribe ? Log<Tribe> : undefined;
  look: T extends PlayerChangelogTypes.Look ? Log<string> : undefined;
  // activity: T extends PlayerChangelogTypes.Activity ? Log : undefined;
  badge: T extends PlayerChangelogTypes.Badge ? Log<number[]> : undefined;
  title: T extends PlayerChangelogTypes.Title ? Log<number[]> : undefined;
  mouse: T extends PlayerChangelogTypes.Mouse ? Log<Mouse> : undefined;
  shaman: T extends PlayerChangelogTypes.Shaman ? Log<Shaman> : undefined;
  survivor: T extends PlayerChangelogTypes.Survivor ? Log<Survivor> : undefined;
  racing: T extends PlayerChangelogTypes.Racing ? Log<Racing> : undefined;
  defilante: T extends PlayerChangelogTypes.Defilante ? Log<Defilante> : undefined;
}

export interface PlayerLeaderboard extends Mouse, Shaman, Survivor, Racing, Defilante {
  id: number;
  name: string;
  cfmRoles: string[] | null;
  tfmRoles: string[] | null;
  score: number;
}

interface Tribe {
  id: number;
  name: string;
}

interface Mouse {
  rounds: number;
  cheese: number;
  first: number;
  bootcamp: number;
}

interface Defilante {
  rounds: number;
  finished: number;
  points: number;
}

interface Racing {
  rounds: number;
  finished: number;
  first: number;
  podium: number;
}

interface Shaman {
  cheese: number;
  savesDivine: number;
  savesNormal: number;
  savesHard: number;
  experience: number;
}

interface Survivor {
  rounds: number;
  killed: number;
  shaman: number;
  survivor: number;
}

interface Scores {
  stats: number;
  shaman: number;
  survivor: number;
  racing: number;
  defilante: number;
  overall: number;
}
