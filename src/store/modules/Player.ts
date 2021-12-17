import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import {
  Player,
  PlayersService,
  TranslationsService,
  PlayerChangelogTypes as T,
  PlayerChangelogs,
  LeaderboardType,
  Period,
} from "src/api";
import Auth from "src/auth";
import dayjs from "dayjs";

interface GetRankParameter {
  player: Player;
  rank: LeaderboardType;
}

interface CantQualify {
  canQualify: false;
  disqualified: boolean;
}
interface Disqualified {
  canQualify: boolean;
  disqualified: true;
}
interface Qualified {
  canQualify: true;
  disqualified: false;
  approximate: boolean;
  pos: number;
  total: number;
  lbType: LeaderboardType;
}
export type RankInfo = CantQualify | Disqualified | Qualified;

const defaultRank: RankInfo = {
  canQualify: false,
  disqualified: false,
};

@Module({ namespaced: true, name: "player", stateFactory: true })
export default class PlayerModule extends VuexModule {
  player: Player | null = null;
  title = "";
  lang = "";
  totalPlayers = 0;
  rank: RankInfo = defaultRank;
  changelogsRaw: PlayerChangelogs<T.Mouse | T.Survivor | T.Racing | T.Defilante> | null = null;

  @Mutation
  setTotalPlayers(players: number) {
    this.totalPlayers = players;
  }

  @Mutation
  setPlayer(player: Player | null) {
    this.player = player;
  }

  @Mutation
  setTitle(title: string) {
    this.title = title;
  }

  @Mutation
  setRank(rank: RankInfo) {
    this.rank = rank;
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
    const period: Period = {
      start: dayjs().subtract(7, "days"),
      recent: true,
    };

    let response;
    if (Auth.loggedIn) {
      response = await Auth.misc.getPlayer(name, period);
    } else {
      response = await PlayersService.getById(name, period);
    }

    if (response.status === 200) {
      this.setPlayer(response.data);
      this.setRank(defaultRank);
      await this.getTitle(response.data.title);
    } else {
      this.setPlayer(null);
      this.setTitle("");
      this.setRank(defaultRank);
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
        ? TranslationsService.withGender(response.data[`t_${title}`], this.player?.gender || "male")
        : ""
    );
    return response;
  }

  @Action
  async getTotalPlayers() {
    if (this.totalPlayers === 0 || !this.totalPlayers) {
      const response = await PlayersService.getLeaderboard("rounds", "overall", {
        page: 1,
        limit: 1,
      });
      this.setTotalPlayers(response.data.total);
    }
    return this.totalPlayers;
  }

  @Action
  async getRank({ player, rank }: GetRankParameter) {
    if (!player.canQualify || player.disqualified) {
      this.setRank({
        canQualify: player.canQualify as false,
        disqualified: player.disqualified as false,
      });
      return;
    }

    let value = 0;
    switch (rank) {
      case "rounds":
      case "cheese":
      case "first":
      case "bootcamp":
        value = player.stats.mouse[rank];
        break;

      case "stats":
      case "shaman":
      case "survivor":
      case "racing":
      case "defilante":
      case "overall":
        value = player.stats.score[rank];
        break;
    }
    const response = await PlayersService.getPosition(rank, value);

    this.setRank({
      canQualify: true, // player.canQualify,
      disqualified: false, // player.disqualified,
      approximate: !response.accurate || response.outdated,
      pos: response.position,
      total: await this.getTotalPlayers(),
      lbType: rank,
    });
  }

  /** Get change logs of current user */
  @Action
  async getChangelogs() {
    if (!this.player) return;
    const changelogs = [T.Racing, T.Shaman, T.Survivor, T.Defilante, T.Mouse];
    let response;
    if (Auth.loggedIn) {
      response = await Auth.misc.getPlayerChangelogs(this.player.id, changelogs);
    } else {
      response = await PlayersService.getChangelogs(this.player.id, changelogs);
    }
    this.setChangelogs(response);
    return response;
  }
}
