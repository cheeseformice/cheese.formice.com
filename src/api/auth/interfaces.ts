import { BasePlayer } from "..";

export interface AuthError {
  success: false;
  message: string;
  translationKey?: string;
}

export interface RefreshResponse {
  success: true;
  session: string;
}

export interface LoginResponse extends RefreshResponse {
  refresh: string;
}

export interface TicketResponse extends LoginResponse {
  hasPassword: boolean;
}

export interface PrivacySettings {
  soulmate: boolean;
  tribe: boolean;
  titles: boolean;
  shaman: boolean;
  mouse: boolean;
  survivor: boolean;
  racing: boolean;
  defilante: boolean;
  outfits: boolean;
}

export interface AccountInformation {
  player: BasePlayer;
  privacy: PrivacySettings;
  disqualified: boolean;
  canQualify: boolean;
  hasPassword: boolean;
}
