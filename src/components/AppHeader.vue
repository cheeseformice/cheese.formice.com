<template>
  <q-header elevated class="z-max">
    <q-toolbar class="container">
      <q-btn v-if="$q.screen.xs" icon="menu" flat round @click="showDrawer = !showDrawer" />
      <q-tabs v-else>
        <q-route-tab v-for="{ label, to } of links" exact :key="label" :to="to" :label="label" />
      </q-tabs>
      <q-space />

      <c-entity-search
        :players="true"
        :tribes="true"
        :onSelect="(e) => { $router.push(e.route); }"
      />
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
import { mixins, Options } from "vue-property-decorator";
import { AuthService } from "src/api";
import { Images } from "src/common/mixins";
import { CEntitySearch } from ".";

interface Link {
  label: string;
  icon: string;
  to: { name: string };
}

@Options({ components: { CEntitySearch } })
export default class AppHeader extends mixins(Images) {
  showDrawer = false;
  links: Link[] = [];

  async updateLinks() {
    const player = await AuthService.getPlayerInfo();

    let account: Link;
    if (!player) {
      account = {
        label: this.$t("login"),
        icon: "login",
        to: { name: "login" },
      };
    } else {
      account = {
        label: player.name,
        icon: "user",
        to: { name: "account" },
      };
    }

    const showAccountButton = !!player || window.localStorage.getItem("login-beta") === "true";

    this.links = [
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

    if (showAccountButton) {
      this.links.push(account);
    }
  }

  mounted() {
    void this.updateLinks();
  }
}
</script>
