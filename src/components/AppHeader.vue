<template>
  <q-header elevated class="z-max">
    <q-toolbar class="container">
      <q-tabs>
        <q-route-tab v-for="{ label, to } of links" :key="label" :to="to" :label="label" />
      </q-tabs>

      <q-space />

      <q-select
        v-model="undefined"
        :placeholder="$t('search')"
        outlined
        dense
        color="white"
        dark
        use-input
        hide-selected
        fill-input
        options-dense
        input-debounce="500"
        ref="itemSelection"
        :options="searchResult"
        @filter="search"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
        <template #option="{ opt }">
          <q-item clickable v-ripple :to="opt.route">
            <q-item-section avatar>
              <c-avatar :id="opt.id" :tribe="opt.type === 'tribe'" />
            </q-item-section>
            <q-item-section>{{ opt.name }}</q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { mixins } from "vue-property-decorator";
import { BasePlayer, BaseTribe, PlayersService, TribesService } from "src/api";
import { Images } from "src/common/mixins";

export default class AppHeader extends mixins(Images) {
  searchResult: BasePlayer | BaseTribe[] = [];

  async search(keyword: string, update: (v: unknown) => void) {
    if (!keyword) return;
    const playersPromise = PlayersService.search({ search: keyword });
    const tribesPromise = TribesService.search({ search: keyword });

    const [players, tribes] = await Promise.all([playersPromise, tribesPromise]);
    const results = [
      ...players.data.page.map((p) => ({ ...p, type: "player" })),
      ...tribes.data.page.map((p) => ({ ...p, type: "tribe" })),
    ];

    update(() => {
      this.searchResult = results.map((r) => {
        const isPlayer = r.type === "player";
        return {
          ...r,
          route: isPlayer
            ? {
                name: "player",
                params: { playerName: r.name },
              }
            : {
                name: "tribe",
                params: { tribeName: r.name },
              },
        };
      });
    });
  }

  get links() {
    return [
      {
        label: this.$t("home"),
        to: { name: "home" },
      },
      {
        label: this.$t("leaderboard"),
        to: { name: "leaderboard" },
      },
    ];
  }
}
</script>
