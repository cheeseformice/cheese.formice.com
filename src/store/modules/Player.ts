import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Player, PlayersService, PlayerChangelogTypes as T, PlayerChangelogs } from "src/api";

@Module({ namespaced: true, name: "player", stateFactory: true })
export default class PlayerModule extends VuexModule {
  player: Player | null = null;
  changelogsRaw: PlayerChangelogs<T.Normal | T.Survivor | T.Racing | T.Defilante> | null = null;

  @Mutation
  setPlayer(player: Player | null) {
    this.player = player;
  }

  @Mutation
  setChangelogs(changelogs: PlayerChangelogs<T.Normal | T.Survivor | T.Racing | T.Defilante>) {
    this.changelogsRaw = changelogs;
  }

  @Mutation
  resetState() {
    this.player = null;
    this.changelogsRaw = null;
  }

  @Action
  async getPlayer(name: string) {
    const response = await PlayersService.getById(name);
    this.setPlayer(response.status === 200 ? response.data : null);
    return response;
  }

  /** Get change logs of current user */
  @Action
  async getChangelogs() {
    if (!this.player) return;
    const response = await PlayersService.getChangelogs(this.player.id, [
      T.Racing,
      T.Survivor,
      T.Defilante,
      T.Normal,
    ]);
    this.setChangelogs(response.data);
    return response;
  }
}
