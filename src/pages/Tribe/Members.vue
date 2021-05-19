<template>
  <div class="col-12 col-lg-10 q-gutter-y-md">
    <div class="q-gutter-y-sm">
      <div class="q-py-md flex flex-center">
        <q-pagination
          v-model="lookup.page"
          outline
          :max="total"
          :max-pages="7"
          :boundary-numbers="false"
        />
      </div>

      <div class="row">
        <tribe-member
          v-for="(player, index) in members"
          :key="player.id"
          :id="player.id"
          :name="player.name"
          :pos="(itemsPerPage * (lookup.page - 1)) + index + 1"
          :sort="lookup.sort ? lookup.sort.label : null"
          :stat="lookup.sort ? player[lookup.sort.value] : null"
        />
      </div>

      <div class="q-py-md flex flex-center">
        <q-pagination
          v-model="lookup.page"
          outline
          :max="total"
          :max-pages="7"
          :boundary-numbers="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { Images } from "src/common/mixins";
import { PlayerLeaderboard, BasePlayer, TribesService, LeaderboardType, LeaderboardPeriod } from "src/api";
import { TribeModule } from "src/store";
import { TribeMember } from "./components";

interface LookupOptions {
  search?: string;
  sort?: { label: string; value: LeaderboardType };
  period?: { label: string; value: LeaderboardPeriod };
  page: number;
}

@Options({
  components: { TribeMember },
})
export default class TribeProfile extends mixins(Images) {
  lookup: LookupOptions = {
    page: 1
  };
  members: BasePlayer[] | PlayerLeaderboard[] = [];
  itemsPerPage = 50;
  total = 0;

  get module () {
    return getModule(TribeModule, this.$store);
  }

  get tribe() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.module.tribe!;
  }

  @Watch("lookup", { deep: true })
  onOptionsChange() {
    void this.fetchMembers();
  }

  mounted() {
    void this.fetchMembers();
  }

  async fetchMembers() {
    const response = await TribesService.getMembers(
      this.tribe.id,
      this.lookup.search ?? "",
      this.lookup.sort ? this.lookup.sort.value : "",
      this.lookup.period ? this.lookup.period.value : "",
      {
        page: this.lookup.page,
        limit: this.itemsPerPage
      }
    );
    this.members = response.data.page;
    this.total = response.data.total;
    window.scrollTo(0, 0);
  }
}
</script>