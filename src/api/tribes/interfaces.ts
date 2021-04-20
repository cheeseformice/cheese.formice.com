export interface BaseTribe {
  id: number;
  name: string;
}

export interface Tribe extends BaseTribe {
  members: number;
  stats: Stats;
}

export interface Stats {
  average: Average;
  total: Average;
}

export interface Average {
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
  saves: number[];
  experience: number;
}

export interface Survivor {
  rounds: number;
  killed: number;
  shaman: number;
  survivor: number;
}
