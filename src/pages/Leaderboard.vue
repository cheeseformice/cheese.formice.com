<template>
  <q-page class="container q-pt-md">
    <div class="text-center text-h4">{{ $t("leaderboard") }}</div>

    <div class="row items-center q-gutter-y-md">
      <div class="col-12 col-md-6">
        <q-tabs v-model="leaderboardOptions.tab" align="left" class="text-secondary">
          <q-tab name="player" :label="$t('player')" />
          <q-tab name="tribe" :label="$t('tribe')" />
        </q-tabs>
      </div>
      <div class="col-12 col-md-6">
        <div class="q-col-gutter-md" :class="$q.screen.gt.sm ? 'row float-right' : ''">
          <q-select
            outlined
            dense
            v-model="leaderboardOptions.period"
            :options="periodOptions"
            :label="$t('period')"
            :class="$q.screen.gt.sm ? 'selector' : ''"
            :dark="$dark.enabled"
            options-selected-class="text-contrast"
            standout="text-contrast"
          />
          <q-select
            outlined
            dense
            v-model="leaderboardOptions.type"
            :options="typeOptions"
            :label="$t('leaderboard')"
            :class="$q.screen.gt.sm ? 'selector' : ''"
            :dark="$dark.enabled"
            options-selected-class="text-contrast"
            standout="text-contrast"
          />
        </div>
      </div>
    </div>

    <div class="q-py-md flex flex-center">
      <q-pagination
        v-model="leaderboardOptions.page"
        outline
        :color="$dark.enabled ? 'dark-contrast' : 'light-contrast'"
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
      class="q-mt-lg bg-contrast text-contrast"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <router-link
            :to="{
              name: leaderboardOptions.tab,
              params: { playerName: props.value, tribeName: props.value },
            }"
            class="text-contrast"
          >
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
    </q-table>

    <div class="q-py-md flex flex-center">
      <q-pagination
        v-model="leaderboardOptions.page"
        outline
        :color="$dark.enabled ? 'dark-contrast' : 'light-contrast'"
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
import {
  PlayersService,
  LeaderboardType,
  TribesService,
  LeaderboardPeriod,
  leaderboardTypes,
} from "src/api";

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
      label: "",
      value: "overall",
    },
    type: {
      label: "",
      value: "stats",
    },
    page: 1,
  };
  leaderboard: LeaderboardRow[] = [];

  // TODO: label key on this array should be from i18n `this.$t("key")`
  get columns(): QTable["columns"] {
    const defaultColumns: string[][] = [
      ["rounds", "roundsPlayed"],
      ["cheese", "gatheredCheese"],
      ["first", "cheeseGatheredFirstShort"],
      ["savesNormal", "miceSavedNormalShort"],
      ["score", "score"],
    ];

    const columnMap: Record<LeaderboardType, string[][]> = {
      stats: defaultColumns,
      rounds: defaultColumns,
      cheese: defaultColumns,
      first: defaultColumns,
      bootcamp: [["bootcamp", "bootcamp"]],
      shaman: [
        ["rounds", "roundsPlayed"],
        ["savesNormal", "miceSavedNormalShort"],
        ["savesHard", "miceSavedHardShort"],
        ["savesDivine", "miceSavedDivineShort"],
        ["cheese", "cheeseGatheredShamanShort"],
        ["score", "score"],
      ],
      racing: [
        ["rounds", "roundsPlayed"],
        ["finished", "completedRounds"],
        ["podium", "numberOfPodiums"],
        ["first", "numberOfFirsts"],
        ["score", "score"],
      ],
      survivor: [
        ["rounds", "roundsPlayed"],
        ["survivor", "roundsSurvived"],
        ["shaman", "roundsAsShaman"],
        ["killed", "killedMice"],
        ["score", "score"],
      ],
      defilante: [
        ["rounds", "roundsPlayed"],
        ["finished", "completedRounds"],
        ["points", "pointsGathered"],
        ["score", "score"],
      ],
      overall: [["score", "score"]],
    };

    const columns = columnMap[this.leaderboardOptions.type.value].map((item: string[]) => ({
      name: item[0],
      label: this.$t(item[1]),
      field: item[0],
      align: "left",
    }));

    return [
      {
        name: "rank",
        label: this.$t("rank"),
        field: "rank",
        align: "center",
      },
      {
        name: "name",
        label:
          this.leaderboardOptions.tab === "player" ? this.$t("playerName") : this.$t("tribeName"),
        field: "name",
        align: "left",
      },
      ...columns,
    ];
  }

  get periodOptions(): LeaderboardOptions["period"][] {
    const periods: LeaderboardPeriod[] = ["overall", "daily", "weekly", "monthly"];
    return periods.map((period) => ({
      label: this.$t(`periods.${period}`),
      value: period,
    }));
  }

  get typeOptions(): LeaderboardOptions["type"][] {
    return leaderboardTypes.map((n) => ({
      label: this.$t(`sorts.${n}`),
      value: n,
    }));
  }

  @Watch("leaderboardOptions", { deep: true })
  onOptionsChange() {
    void this.fetchLeaderboard();
    window.scrollTo(0, 0);
  }

  mounted() {
    this.leaderboardOptions.period.label = this.$t("periods.overall");
    this.leaderboardOptions.type.label = this.$t("sorts.stats");

    void this.fetchLeaderboard();
  }

  async fetchLeaderboard() {
    const limit = 50;
    const { page, tab, type, period } = this.leaderboardOptions;

    const service = tab === "player" ? PlayersService : TribesService;
    const response = await service.getLeaderboard(type.value, period.value, { page, limit });

    this.leaderboard = response.data.page.map((l, i) => ({
      rank: (page - 1) * limit + i + 1,
      name: l.name,
      score: l.score,
      rounds: l.rounds,
      cheese: l.cheese,
      first: l.first,
      bootcamp: l.bootcamp,
      savesNormal: l.savesNormal,
      savesHard: l.savesHard,
      savesDivine: l.savesDivine,
      finished: l.finished,
      podium: l.podium,
      killed: l.killed,
      shaman: l.shaman,
      survivor: l.survivor,
      points: l.points,
    }));
  }
}
</script>

<style lang="scss" scoped>
.selector {
  min-width: 225px;
}
</style>
