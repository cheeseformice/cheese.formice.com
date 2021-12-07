import { AccountInformation, CfmRole, TfmRole } from "src/api";

export interface GuestState {
  logged: false;
}
export interface UserState extends AccountInformation {
  logged: true;
}
export type AuthState = GuestState | UserState;

interface AuthCallback {
  (state: AuthState): unknown;
}
export interface AuthCallbacks {
  hook: AuthCallback;
  extraChecks: AuthCallback;
  match: AuthCallback;
  mismatch: AuthCallback;
  unhook: AuthCallback;
}

export type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R>
    ? Array<RecursivePartial<R>>
    : RecursivePartial<T[K]>;
};

export interface Hook {
  id: number;
  state: RecursivePartial<AuthState>;
  callbacks: Partial<AuthCallbacks>;
  dependencies: string[];
}

interface NotDispatchedResult {
  called: false;
}
interface DispatchedResult {
  called: true;
  result: unknown;
}
export type DispatchResult = NotDispatchedResult | DispatchedResult;

export interface JWT {
  iat: number;
  exp: number;
}
export interface SessionToken extends JWT {
  user: number;
  cfmRoles: CfmRole[];
  tfmRoles: TfmRole[];
}
