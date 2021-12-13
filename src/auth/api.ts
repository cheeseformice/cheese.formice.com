import { AccountInformation } from "src/api";
import { getDifferences } from "src/common/objects";
import AccountAPI from "./account";
import AdminAPI from "./admin";
import Authenticator from "./authenticator";
import AuthDispatcher from "./dispatcher";
import MiscAPI from "./misc";
import ModAPI from "./mod";
import { AuthState } from "./interfaces";

export default class AuthAPI {
  previousState?: AuthState;
  state?: AuthState;

  public dispatcher = new AuthDispatcher(this);
  public authenticator = new Authenticator(this, this.setAccount.bind(this));
  public account = new AccountAPI(this);
  public admin = new AdminAPI(this);
  public misc = new MiscAPI(this);
  public mod = new ModAPI(this);

  public hook = this.dispatcher.hook.bind(this.dispatcher);
  public unhook = this.dispatcher.unhook.bind(this.dispatcher);

  public getState(ignoreError?: false): AuthState;
  public getState(ignoreError: true): AuthState | undefined;
  public getState(ignoreError?: boolean) {
    if (!this.state) {
      if (ignoreError) {
        return;
      }
      throw new Error("No state was set.");
    }

    return this.state;
  }

  public get loggedIn(): boolean {
    if (!this.state) {
      return false;
    }
    return this.state.logged;
  }

  private setAccount(account?: AccountInformation) {
    // this function is only used by Authenticator, to prevent bugs

    this.previousState = this.state;
    if (!account) {
      this.state = { logged: false };
    } else {
      this.state = {
        logged: true,
        ...account,
      };
    }

    if (!this.previousState || this.previousState.logged !== this.state.logged) {
      // major update
      this.dispatcher.stateUpdated(true, {});
      return;
    }

    const differences = getDifferences(
      this.previousState as unknown as Record<string, unknown>,
      this.state as unknown as Record<string, unknown>
    );

    if (differences.length === 0) {
      // nothing was updated
      return;
    }

    const updatedKeys: Record<string, boolean> = {};
    for (let i = 0; i < differences.length; i++) {
      updatedKeys[differences[i]] = true;
    }

    this.dispatcher.stateUpdated(false, updatedKeys);
  }
}
