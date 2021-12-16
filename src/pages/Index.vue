<template>
  <q-page padding class="container q-pt-lg">
    <q-card flat class="q-py-md text-center transparent">
      <span class="text-h4">{{ $t("welcome") }}</span>
    </q-card>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-list dense bordered padding class="rounded-borders bg-contrast">
          <q-item key="title">
            <q-item-section class="q-table__title">{{ $t("lastTenPlayers") }}</q-item-section>
          </q-item>
          <q-item
            v-for="player in lastPlayers"
            clickable
            v-ripple
            :key="player.name"
            :to="player.route"
          >
            <q-item-section>
              {{ player.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-md-4">
        <q-list dense bordered padding class="rounded-borders bg-contrast">
          <q-item key="title">
            <q-item-section class="q-table__title">{{ $t("lastTenTribes") }}</q-item-section>
          </q-item>
          <q-item
            v-for="tribe in lastTribes"
            clickable
            v-ripple
            :key="tribe.name"
            :to="tribe.route"
          >
            <q-item-section>
              {{ tribe.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-md-4">
        <q-list dense bordered padding class="rounded-borders bg-contrast">
          <q-item key="title">
            <q-item-section class="q-table__title">{{ $t("topTenPlayers") }}</q-item-section>
            <router-link :to="{ name: 'playerLeaderboard' }">
              <q-btn
                outline
                no-caps
                dense
                class="q-px-sm"
                :label="$t('showMore')"
                color="secondary"
              />
            </router-link>
          </q-item>
          <q-item
            v-for="player in leaderboard"
            clickable
            v-ripple
            :key="player.name"
            :to="player.route"
          >
            <q-item-section>
              {{ player.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12">
        <current-server-status :services="services" :startHidden="false" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QTable } from "quasar";
import { Options, Vue } from "vue-class-component";
import { CurrentServerStatus } from "src/components";
import { PlayersService, TribesService } from "src/api";

interface Route {
  name: "player" | "tribe";
  params: {
    playerName?: string;
    tribeName?: string;
  };
}

interface Row {
  name: string;
  route: Route;
}

@Options({ components: { CurrentServerStatus } })
export default class PageIndex extends Vue {
  lastPlayers: Row[] = [];
  lastTribes: Row[] = [];
  leaderboard: Row[] = [];

  get services(): string[] {
    return ["changelogs", "profile", "lookup", "auth", "dressroom", "router"];
  }

  get lastSeenColumns(): QTable["columns"] {
    return [
      {
        name: "name",
        label: "Name",
        field: "name",
        align: "left",
      },
    ];
  }

  get leaderboardColumns(): QTable["columns"] {
    return [
      {
        name: "name",
        label: "Name",
        field: "name",
        align: "left",
      },
      {
        name: "score",
        label: "Score",
        field: "score",
        align: "left",
      },
    ];
  }

  mounted() {
    void this.fetchLastPlayers();
    void this.fetchLastTribes();
    void this.fetchLeaderboard();
  }

  async fetchLastPlayers() {
    const response = await PlayersService.getLastSeen(10);

    this.lastPlayers = response.data.map((l) => ({
      name: l.name,
      route: {
        name: "player",
        params: { playerName: l.name },
      },
    }));
  }

  async fetchLastTribes() {
    const response = await TribesService.getLastSeen(10);

    this.lastTribes = response.data.map((l) => ({
      name: l.name,
      route: {
        name: "tribe",
        params: { tribeName: l.name },
      },
    }));
  }

  async fetchLeaderboard() {
    const response = await PlayersService.getLeaderboard("stats", "overall", {
      page: 1,
      limit: 10,
    });

    this.leaderboard = response.data.page.map((l) => ({
      name: l.name,
      route: {
        name: "player",
        params: { playerName: l.name },
      },
    }));
  }
}
</script>
