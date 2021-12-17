<template>
  <div class="col-12 text-center text-h6" v-if="loaded && members.length === 0">
    {{ $t("noMembers") }}
  </div>
  <div class="col-12 col-lg-10 q-gutter-y-md" v-else>
    <div class="row items-center q-gutter-y-md">
      <div class="col-12">
        <div class="q-col-gutter-md" :class="$q.screen.gt.sm ? 'row float-right' : ''">
          <q-input
            outlined
            :dark="$dark.enabled"
            dense
            type="text"
            v-model="search"
            :placeholder="$t('search')"
          />

          <q-select
            outlined
            dense
            v-model="lookup.period"
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
            v-model="lookup.sort"
            :options="sortOptions"
            :label="$t('leaderboard')"
            :class="$q.screen.gt.sm ? 'selector' : ''"
            :dark="$dark.enabled"
            options-selected-class="text-contrast"
            standout="text-contrast"
          />
        </div>
      </div>
    </div>

    <div class="q-gutter-y-sm">
      <div class="q-py-md flex flex-center">
        <q-pagination
          v-model="lookup.page"
          outline
          :max="totalPages"
          :max-pages="7"
          :color="$dark.enabled ? 'dark-contrast' : 'light-contrast'"
        />
      </div>

      <div class="row">
        <tribe-member
          v-for="(player, index) in members"
          :key="player.id"
          :id="player.id"
          :name="player.name"
          :pos="itemsPerPage * (lookup.page - 1) + index + 1"
          :sort="lookup.sort ? lookup.sort.value : null"
          :stat="lookup.sort ? player[lookup.sort.isScore ? 'score' : lookup.sort.value] : null"
        />
      </div>

      <div class="q-py-md flex flex-center">
        <q-pagination
          v-model="lookup.page"
          outline
          :max="totalPages"
          :max-pages="7"
          :color="$dark.enabled ? 'dark-contrast' : 'light-contrast'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { Images } from "src/common/mixins";
import {
  PlayerLeaderboard,
  BasePlayer,
  TribesService,
  LeaderboardType,
  LeaderboardPeriod,
} from "src/api";
import { TribeModule } from "src/store";
import { TribeMember } from "./components";

interface LookupOptions {
  sort?: { label: string; value: LeaderboardType | ""; isScore: boolean };
  period?: { label: string; value: LeaderboardPeriod };
  page: number;
}

@Options({
  components: { TribeMember },
})
export default class TribeProfile extends mixins(Images) {
  searchCheckInterval?: number;
  search = "";
  searchChanged = false;
  lookup: LookupOptions = {
    page: 1,
  };
  loaded = false;
  members: BasePlayer[] | PlayerLeaderboard[] = [];
  itemsPerPage = 50;
  total = 0;

  get module() {
    return getModule(TribeModule, this.$store);
  }

  get totalPages() {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  get tribe() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.module.tribe!;
  }

  get periodOptions(): LookupOptions["period"][] {
    const periods: LeaderboardPeriod[] = ["overall", "daily", "weekly", "monthly"];
    return periods.map((period) => ({
      label: this.$t(`periods.${period}`),
      value: period,
    }));
  }

  get sortOptions(): LookupOptions["sort"][] {
    const sortNames: LeaderboardType[] = [
      "overall",
      "rounds",
      "cheese",
      "first",
      "bootcamp",
      "stats",
      "shaman",
      "survivor",
      "racing",
      "defilante",
    ];
    const notScores: LeaderboardType[] = ["rounds", "cheese", "first", "bootcamp"];
    return [
      {
        label: this.$t("sorts.none"),
        value: "",
        isScore: false,
      },
      ...sortNames.map((n) => ({
        label: this.$t(`sorts.${n}`),
        value: n,
        isScore: !notScores.includes(n),
      })),
    ];
  }

  resetLeaderboard() {
    this.lookup.sort = {
      label: this.$t("sorts.none"),
      value: "",
      isScore: false,
    };
    this.lookup.period = {
      label: this.$t("periods.overall"),
      value: "overall",
    };
  }

  @Watch("search")
  onSearchChange() {
    // search and leaderboard are incompatible
    if (!!this.lookup.sort?.value && !!this.search) {
      this.resetLeaderboard();
    }
    this.searchChanged = true;
  }

  @Watch("lookup", { deep: true })
  onOptionsChange() {
    // search and leaderboard are incompatible
    if (!!this.lookup.sort?.value && !!this.search) {
      this.search = "";
    }
    void this.fetchMembers();
  }

  mounted() {
    this.searchCheckInterval = window.setInterval(() => {
      if (this.searchChanged) {
        this.searchChanged = false;
        void this.fetchMembers();
      }
    }, 500);
    this.resetLeaderboard();
    void this.fetchMembers();
  }

  unmounted() {
    window.clearInterval(this.searchCheckInterval);
  }

  async fetchMembers() {
    const response = await TribesService.getMembers(
      this.tribe.id,
      this.search,
      this.lookup.sort?.value || "",
      this.lookup.period?.value || "",
      {
        page: this.lookup.page,
        limit: this.itemsPerPage,
      }
    );
    this.members = response.data.page;
    this.total = response.data.total;
    this.loaded = true;
    window.scrollTo(0, 0);
  }
}
</script>
