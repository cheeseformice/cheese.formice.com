import { Log } from "..";

export interface BasePlayer {
  id: number;
  name: string;
  cfmRoles: string[];
  tfmRoles: string[];
}

export interface Player extends BasePlayer {
  title: number;
  tribe: Tribe;
  soulmate: BasePlayer;
  shop: {
    look: string;
    outfits: string[];
    mouseColor: number;
    shamanColor: number;
  };
  badges: number[];
  titles: number[];
  stats: Stats;
  period: Stats & {
    start: string;
    end: string;
  };
}

interface Stats {
  shaman: Shaman;
  mouse: Mouse;
  survivor: Survivor;
  racing: Racing;
  defilante: Defilante;
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

export interface PlayerLeaderboard {
  id: number;
  name: string;
  cfmRoles: string[] | null;
  tfmRoles: string[] | null;
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
