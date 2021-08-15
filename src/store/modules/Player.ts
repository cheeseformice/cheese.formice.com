import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import {
  Player,
  PlayersService,
  TranslationsService,
  PlayerChangelogTypes as T,
  PlayerChangelogs,
} from "src/api";

@Module({ namespaced: true, name: "player", stateFactory: true })
export default class PlayerModule extends VuexModule {
  player: Player | null = null;
  title = "";
  lang = "";
  changelogsRaw: PlayerChangelogs<T.Mouse | T.Survivor | T.Racing | T.Defilante> | null = null;

  @Mutation
  setPlayer(player: Player | null) {
    this.player = player;
  }

  @Mutation
  setTitle(title: string) {
    this.title = title;
  }

  @Mutation
  setChangelogs(changelogs: PlayerChangelogs<T.Mouse | T.Survivor | T.Racing | T.Defilante>) {
    this.changelogsRaw = changelogs;
  }

  @Mutation
  resetState() {
    this.player = null;
    this.title = "";
    this.changelogsRaw = null;
  }

  @Mutation
  setLanguage(lang: string) {
    this.lang = lang;
  }

  @Action
  async getPlayer(name: string) {
    const response = await PlayersService.getById(name);
    if (response.status === 200) {
      this.setPlayer(response.data);
      await this.getTitle(response.data.title);
    } else {
      this.setPlayer(null);
      this.setTitle("");
    }
    return response;
  }

  @Action
  async getTitle(title: number) {
    const response = await TranslationsService.fetchFields({
      fields: [`T_${title}`],
      language: this.lang,
    });
    // weirdly enough, axios returns the keys in lowercase...
    this.setTitle(
      response.status === 200
        ? TranslationsService.withGender(response.data[`t_${title}`], "male")
        : ""
    );
    return response;
  }

  /** Get change logs of current user */
  @Action
  async getChangelogs() {
    if (!this.player) return;
    const response = await PlayersService.getChangelogs(this.player.id, [
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
