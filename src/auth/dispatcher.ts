import { meetsExpectation } from "src/common/objects";
import AuthAPI from "./api";
import {
  AuthState,
  Hook,
  AuthCallbacks,
  DispatchResult,
  UserState,
  RecursivePartial,
} from "./interfaces";

/**
 * Handles communication with all the hooks.
 */
export default class AuthDispatcher {
  lastHookId = 0;
  hooks: Record<number, Hook> = {};
  hookStack: Hook[] = [];

  constructor(private readonly api: AuthAPI) {}

  getCurrentHook(ignoreError?: false): Hook;
  getCurrentHook(ignoreError: true): Hook | undefined;
  getCurrentHook(ignoreError?: boolean) {
    if (this.hookStack.length === 0) {
      if (ignoreError) {
        return;
      }
      throw new Error("Trying to get current hook outside of a callback.");
    }

    return this.hookStack[this.hookStack.length - 1];
  }

  hook(
    state: RecursivePartial<AuthState>,
    callbacks: Partial<AuthCallbacks>,
    dependencies: string[]
  ): number {
    const id = ++this.lastHookId;
    this.hooks[id] = {
      id,
      state,
      callbacks,
      dependencies,
    };

    if (this.api.state) {
      this.dispatch(this.hooks[id], "hook", true);
      this.sendUpdate(this.hooks[id], true, {});
    }

    return id;
  }

  unhook(hookId?: number): void {
    if (typeof hookId !== "number") {
      hookId = this.getCurrentHook().id;
    }

    const hook = this.hooks[hookId];
    if (!hook) {
      return;
    }
    delete this.hooks[hookId];

    this.dispatch(hook, "unhook", true, true);
  }

  dispatch(
    hook: Hook,
    callback: keyof AuthCallbacks,
    callSoon?: boolean,
    ignoreRemoved?: boolean
  ): DispatchResult {
    if (callSoon) {
      // call soon (required if running inside a callback)
      window.setTimeout(() => this.dispatch(hook, callback, false, ignoreRemoved), 1);
      return { called: false };
    }

    if (!this.api.state) {
      throw new Error("Cannot dispatch a callback without a state set previously.");
    }

    if (!ignoreRemoved && this.hooks[hook.id] !== hook) {
      return { called: false };
    } // hook was removed

    const fnc = hook.callbacks[callback];
    if (!fnc) {
      return { called: false };
    }

    this.hookStack.push(hook);
    try {
      return {
        called: true,
        result: fnc(this.api.state),
      };
    } finally {
      this.hookStack.pop();
    }
  }

  checkState(hook: Hook, state: AuthState): boolean {
    if (Object.keys(hook.state).length > 0) {
      // something is expected from the state
      if (hook.state.logged === false) {
        // hook is expecting a a guest
        if (state.logged) {
          // not a guest
          return false;
        }
      } else {
        // either logged is true or undefined, but there are more keys
        // so hook is expecting a logged in user
        if (!state.logged) {
          // not a logged in user
          return false;
        }

        if (!meetsExpectation(hook.state, state as Partial<UserState>)) {
          return false;
        }
      }
    }

    const dispatch = this.dispatch(hook, "extraChecks");
    if (!dispatch.called) {
      // callback wasn't called (probably not setup)
      return true;
    }
    return dispatch.result as boolean;
  }

  sendUpdate(hook: Hook, majorUpdate: boolean, updatedKeys: Record<string, boolean>) {
    let performUpdate = majorUpdate;

    if (!performUpdate) {
      for (let i = 0; i < hook.dependencies.length; i++) {
        const dependency = hook.dependencies[i];
        if (dependency === "all" || updatedKeys[dependency]) {
          performUpdate = true;
          break;
        }
      }
    }

    if (performUpdate) {
      const match = this.checkState(hook, this.api.state as AuthState);
      this.dispatch(hook, match ? "match" : "mismatch", true);
    }
  }

  public stateUpdated(majorUpdate: boolean, updatedKeys: Record<string, boolean>) {
    if (!this.api.previousState) {
      // call "hook" callback on all hooks before actually checking states
      for (const id in this.hooks) {
        this.dispatch(this.hooks[id], "hook");
      }
    }

    for (const id in this.hooks) {
      const hook = this.hooks[id];
      this.sendUpdate(hook, majorUpdate, updatedKeys);
    }
  }
}
