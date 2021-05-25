<template>
  <q-header elevated class="z-max">
    <q-toolbar class="container">
      <q-btn v-if="$q.screen.xs" icon="menu" flat round @click="showDrawer = !showDrawer" />
      <q-tabs v-else>
        <q-route-tab v-for="{ label, to } of links" exact :key="label" :to="to" :label="label" />
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
    <q-drawer v-if="$q.screen.xs" v-model="showDrawer" :width="280" bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list>
          <q-item>
            <q-item-section class="text-primary text-h6">Cheese For Mice</q-item-section>
          </q-item>

          <q-separator />

          <q-item v-for="link of links" clickable v-ripple :key="link.label" :to="link.to">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section class="text-dark">{{ link.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </q-header>
</template>

<script lang="ts">
import { mixins } from "vue-property-decorator";
import { BasePlayer, BaseTribe, PlayersService, TribesService } from "src/api";
import { Images } from "src/common/mixins";

export default class AppHeader extends mixins(Images) {
  showDrawer = false;
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
        icon: "home",
        to: { name: "home" },
      },
      {
        label: this.$t("leaderboard"),
        icon: "leaderboard",
        to: { name: "leaderboard" },
      },
    ];
  }
}
</script>
