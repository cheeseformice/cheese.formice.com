<template>
  <q-page class="container q-pt-md">
    <div class="text-center text-h4">Leaderboard</div>

    <div class="row items-center q-gutter-y-md">
      <div class="col-12 col-md-6">
        <q-tabs v-model="leaderboardOptions.tab" align="left" class="text-secondary">
          <q-tab name="player" label="player" />
          <q-tab name="tribe" label="tribe" />
        </q-tabs>
      </div>
      <div class="col-12 col-md-6">
        <div class="q-col-gutter-md" :class="$q.screen.gt.sm ? 'row float-right' : ''">
          <q-select
            outlined
            dense
            v-model="leaderboardOptions.period"
            :options="periodOptions"
            label="Period"
            :class="$q.screen.gt.sm ? 'selector' : ''"
          />
          <q-select
            outlined
            dense
            v-model="leaderboardOptions.type"
            :options="typeOptions"
            label="Leaderboard"
            :class="$q.screen.gt.sm ? 'selector' : ''"
          />
        </div>
      </div>
    </div>

    <div class="q-py-md flex flex-center">
      <q-pagination
        v-model="leaderboardOptions.page"
        outline
        :max="leaderboardOptions.page + 10"
        :max-pages="7"
        :boundary-numbers="false"
      />
    </div>
    <q-table
      flat
      hide-bottom
      :rows="leaderboard"
      :columns="columns"
      :rows-per-page-options="[0]"
      :v-model:pagination="{ page: 1, rowsPerPage: 0 }"
      class="q-mt-lg"
    />

    <div class="q-py-md flex flex-center">
      <q-pagination
        v-model="leaderboardOptions.page"
        outline
        :max="leaderboardOptions.page + 10"
        :max-pages="7"
        :boundary-numbers="false"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Watch, Vue } from "vue-property-decorator";
import { QTable } from "quasar";
import { PlayersService, LeaderboardType, TribesService, LeaderboardPeriod } from "src/api";

interface LeaderboardRow {
  rank: number;
  name: string;
  score: number;
}

interface LeaderboardOptions {
  tab: "player" | "tribe";
  type: { label: string; value: LeaderboardType };
  period: { label: string; value: LeaderboardPeriod };
  page: number;
}

export default class Leaderboard extends Vue {
  leaderboardOptions: LeaderboardOptions = {
    tab: "player",
    period: {
      label: "All time",
      value: "overall",
    },
    type: {
      label: "Overall",
      value: "overall",
    },
    page: 1,
  };
  leaderboard: LeaderboardRow[] = [];

  // TODO: label key on this array should be from i18n `this.$t("key")`
  get columns(): QTable["columns"] {
    return [
      {
        name: "rank",
        label: "Rank",
        field: "rank",
        align: "center",
      },
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

  // TODO: Add more periods
  get periodOptions(): LeaderboardOptions["period"][] {
    return [
      {
        label: "Overall",
        value: "overall",
      },
    ];
  }

  // TODO: Add more types
  get typeOptions(): LeaderboardOptions["type"][] {
    return [
      {
        label: "Racing",
        value: "racing",
      },
    ];
  }

  @Watch("leaderboardOptions", { deep: true })
  onOptionsChange() {
    void this.fetchLeaderboard();
    window.scrollTo(0, 0);
  }

  mounted() {
    void this.fetchLeaderboard();
  }

  async fetchLeaderboard() {
    const limit = 50;
    const { page, tab, type } = this.leaderboardOptions;

    const service = tab === "player" ? PlayersService : TribesService;
    const response = await service.getLeaderboard(type.value, { page, limit });

    this.leaderboard = response.data.page.map((l, i) => ({
      rank: (page - 1) * limit + i + 1,
      name: l.name,
      score: l[type.value],
    }));
  }
}
</script>

<style lang="scss" scoped>
.selector {
  min-width: 225px;
}
</style>
