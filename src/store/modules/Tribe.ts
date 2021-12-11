import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Tribe, TribesService, TribeChangelogTypes as T, TribeChangelogs } from "src/api";
import Auth from "src/auth";

@Module({ namespaced: true, name: "tribe", stateFactory: true })
export default class TribeModule extends VuexModule {
  tribe: Tribe | null = null;
  changelogsRaw: TribeChangelogs<T.Mouse | T.Survivor | T.Racing | T.Defilante> | null = null;

  @Mutation
  setTribe(tribe: Tribe | null) {
    this.tribe = tribe;
  }

  @Mutation
  setChangelogs(changelogs: TribeChangelogs<T.Mouse | T.Survivor | T.Racing | T.Defilante>) {
    this.changelogsRaw = changelogs;
  }

  @Mutation
  resetState() {
    this.tribe = null;
    this.changelogsRaw = null;
  }

  @Action
  async getTribe(name: string) {
    let response;
    if (Auth.loggedIn) {
      response = await Auth.misc.getTribe(name);
    } else {
      response = await TribesService.getById(name);
    }
    this.setTribe(response.status === 200 ? response.data : null);
    return response;
  }

  /** Get change logs of current user */
  @Action
  async getChangelogs() {
    if (!this.tribe) return;
    const response = await TribesService.getChangelogs(this.tribe.id, [
      T.Racing,
      T.Shaman,
      T.Survivor,
      T.Defilante,
      T.Mouse,
    ]);
    this.setChangelogs(response);
    return response;
  }
}
