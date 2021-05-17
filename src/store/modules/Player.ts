import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Player, PlayersService, TranslationsService, PlayerChangelogTypes as T, PlayerChangelogs } from "src/api";

@Module({ namespaced: true, name: "player", stateFactory: true })
export default class PlayerModule extends VuexModule {
  player: Player | null = null;
  title: string | null = null;
  changelogsRaw: PlayerChangelogs<T.Normal | T.Survivor | T.Racing | T.Defilante> | null = null;

  @Mutation
  setPlayer(player: Player | null) {
    this.player = player;
  }

  @Mutation
  setTitle(title: string | null) {
    this.title = title;
  }

  @Mutation
  setChangelogs(changelogs: PlayerChangelogs<T.Normal | T.Survivor | T.Racing | T.Defilante>) {
    this.changelogsRaw = changelogs;
  }

  @Mutation
  resetState() {
    this.player = null;
    this.title = null;
    this.changelogsRaw = null;
  }

  @Action
  async getPlayer(name: string) {
    const response = await PlayersService.getById(name);
    if (response.status === 200) {
      this.setPlayer(response.data);
      await this.getTitle(response.data.title);
    } else {
      this.setPlayer(null);
      this.setTitle(null);
    }
    return response;
  }

  @Action
  async getTitle(title: number) {
    const response = await TranslationsService.fetchFields({
      fields: [`T_${title}`]
    });
    // weirdly enough, axios returns the keys in lowercase...
    this.setTitle(response.status === 200 ? response.data[`t_${title}`] : null);
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
