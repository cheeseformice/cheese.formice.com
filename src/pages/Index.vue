<template>
  <q-page padding class="container q-pt-lg">
    <q-card flat class="q-py-md text-center">
      <span class="text-h6">Welcome to CheeseForMice!</span>
    </q-card>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-list dense bordered padding class="rounded-borders">
          <q-item key="title">
            <q-item-section class="q-table__title">
              Last 10 seen players
            </q-item-section>
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
        <q-list dense bordered padding class="rounded-borders">
          <q-item key="title">
            <q-item-section class="q-table__title">
              Last 10 seen tribes
            </q-item-section>
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
        <q-list dense bordered padding class="rounded-borders">
          <q-item key="title">
            <q-item-section class="q-table__title">
              Top 10 players
            </q-item-section>
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
        <q-table
          title="Server status"
          bordered
          hide-bottom
          :columns="serverColumns"
          :rows="serverStatus"
          :rows-per-page-options="[0]"
          :v-model:pagination="{ page: 1, rowsPerPage: 10 }"
        >
          <template v-slot:top-right>
            <q-btn
              color="secondary"
              label="Extend"
              no-caps
              outline
              :to="{name: 'status'}"
            />
          </template>
          <template v-slot:body-cell-status="props">
            <q-td
              :props="props"
              :class="statusColor(props.row.status)"
            >
              {{ props.row.status }}
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QTable } from "quasar";
import { Vue } from "vue-class-component";
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

export default class PageIndex extends Vue {
  lastPlayers: Row[] = [];
  lastTribes: Row[] = [];
  leaderboard: Row[] = [];

  get lastSeenColumns(): QTable["columns"] {
    return [
      {
        name: "name",
        label: "Name",
        field: "name",
        align: "left",
      }
    ]
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
      }
    ]
  }

  get serverColumns(): QTable["columns"] {
    return [
      {
        name: "service",
        label: "Service",
        field: "service",
        align: "left",
      },
      {
        name: "status",
        label: "Status",
        field: "status",
        align: "left",
      },
      {
        name: "workers",
        label: "Workers",
        field: "workers",
        align: "left",
      }
    ]
  }

  statusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "operational":
        return "text-positive";
      case "partial outage":
        return "text-warning";
      case "outage":
        return "text-negative";
      default:
        return "";
    }
  }

  get serverStatus() {
    return [
      {
        service: "CFM API",
        status: "Partial outage",
        workers: "9/12"
      },
      {
        service: "CFM website",
        status: "Operational",
        workers: "2/2"
      },
      {
        service: "Forum bot",
        status: "Operational",
        workers: "1/1"
      },
      {
        service: "Game bot",
        status: "Outage",
        workers: "0/1"
      },
      {
        service: "Game servers",
        status: "Operational",
        workers: "6/6"
      },
      {
        service: "Forum",
        status: "Operational",
        workers: "1/1"
      },
      {
        service: "Community Platform",
        status: "Operational",
        workers: "1/1"
      },
    ]
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
        params: { playerName: l.name }
      }
    }));
  }

  async fetchLastTribes() {
    const response = await TribesService.getLastSeen(10);

    this.lastTribes = response.data.map((l) => ({
      name: l.name,
      route: {
        name: "tribe",
        params: { tribeName: l.name }
      }
    }));
  }

  async fetchLeaderboard() {
    const response = await PlayersService.getLeaderboard("overall", { page: 1, limit: 10 });

    this.leaderboard = response.data.page.map((l) => ({
      name: l.name,
      route: {
        name: "player",
        params: { playerName: l.name }
      }
    }));
  }
}
</script>
