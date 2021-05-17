<template>
  <q-page padding class="container q-pt-lg">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4 col-lg-2">
        <q-table
          title="Last 10 seen players"
          dense
          hide-header
          hide-bottom
          :columns="lastSeenColumns"
          :rows="lastPlayers"
          :rows-per-page-options="[0]"
          :v-model:pagination="{ page: 1, rowsPerPage: 10 }"
          class="q-mt-lg"
        />
      </div>
      
      <div class="col-12 col-md-4 col-lg-2">
        <q-table
          title="Last 10 seen tribes"
          dense
          hide-header
          hide-bottom
          :columns="lastSeenColumns"
          :rows="lastTribes"
          :rows-per-page-options="[0]"
          :v-model:pagination="{ page: 1, rowsPerPage: 10 }"
          class="q-mt-lg"
        />
      </div>

      <div class="col-12 col-md-4 col-lg-2">
        <q-table
          title="Top 10 players"
          dense
          hide-bottom
          :columns="leaderboardColumns"
          :rows="leaderboard"
          :rows-per-page-options="[0]"
          :v-model:pagination="{ page: 1, rowsPerPage: 10 }"
          class="q-mt-lg"
        >
          <template v-slot:top-right>
            <q-btn
              color="secondary"
              label="Extend"
              no-caps
              outline
            />
          </template>
        </q-table>
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
          class="q-mt-lg"
        >
          <template v-slot:top-right>
            <q-btn
              color="secondary"
              label="Extend"
              no-caps
              outline
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

interface lastSeenRow {
  name: string
}

interface LeaderboardRow {
  name: string;
  score: number;
}

export default class PageIndex extends Vue {
  lastPlayers: lastSeenRow[] = [];
  lastTribes: lastSeenRow[] = [];
  leaderboard: LeaderboardRow[] = [];

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
      name: l.name
    }));
  }

  async fetchLastTribes() {
    const response = await TribesService.getLastSeen(10);

    this.lastTribes = response.data.map((l) => ({
      name: l.name
    }));
  }

  async fetchLeaderboard() {
    const response = await PlayersService.getLeaderboard("overall", { page: 1, limit: 10 });

    this.leaderboard = response.data.page.map((l) => ({
      name: l.name,
      score: l.overall,
    }));
  }
}
</script>
