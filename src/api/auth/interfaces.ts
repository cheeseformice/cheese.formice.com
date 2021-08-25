import { CfmRole, TfmRole } from "../interfaces";

export interface JWT {
  iat: number;
  exp: number;
}

export interface SessionToken extends JWT {
  user: number;
  cfmRoles: CfmRole[];
  tfmRoles: TfmRole[];
}

export interface AuthError {
  message: string;
}

export interface RefreshResponse {
  session: string;
}

export interface LoginResponse extends RefreshResponse {
  refresh: string;
}

export interface TicketResponse extends LoginResponse {
  hasPassword: boolean;
}

export interface PrivacySettings {
  names: boolean;
  soulmate: boolean;
  tribe: boolean;
  look: boolean;
  activity: boolean;
  badges: boolean;
  titles: boolean;
  shaman: boolean;
  mouse: boolean;
  survivor: boolean;
  racing: boolean;
  defilante: boolean;
}
