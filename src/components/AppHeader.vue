<template>
  <q-header elevated class="z-max">
    <q-toolbar class="container">
      <q-btn v-if="$q.screen.xs" icon="menu" flat round @click="showDrawer = !showDrawer" />
      <q-tabs v-else>
        <div class="full-height" v-for="link of links" :key="link.label">
          <q-route-tab
            class="link-color"
            exact
            :to="link.to"
            :label="link.label"
            v-if="!!link.to"
          />
          <q-btn-dropdown
            auto-close
            stretch
            flat
            class="full-height link-color"
            :label="link.label"
            content-class="z-max bg-contrast"
            v-if="!!link.dropdown && link.dropdown.length > 1"
          >
            <q-list>
              <div v-for="sub of link.dropdown" :key="sub.label">
                <q-item clickable v-close-popup @click="sub.click" :to="sub.to">
                  <q-item-section>
                    <q-item-label class="text-contrast">{{ sub.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-btn-dropdown>
          <div v-if="!!link.dropdown && link.dropdown.length == 1">
            <q-route-tab
              exact
              class="link-color"
              :to="sub.to"
              :label="sub.label"
              :key="sub.label"
              v-for="sub of link.dropdown"
            />
          </div>
        </div>
      </q-tabs>
      <q-space />

      <c-entity-search
        :players="true"
        :tribes="true"
        :onSelect="
          (e) => {
            $router.push(e.route);
          }
        "
        :onTyped="onSearchTyped.bind(this)"
      />
      <q-tabs stretch v-if="!$q.screen.xs && rightLinks.length > 0">
        <div style="width: 0.3rem" class="full-height"></div>
        <div class="full-height" v-for="link of rightLinks" :key="link.label">
          <q-route-tab
            class="link-color"
            exact
            :to="link.to"
            :label="link.label"
            v-if="!!link.to"
          />
          <q-btn-dropdown
            auto-close
            stretch
            no-caps
            flat
            :label="link.label"
            class="full-height link-color"
            content-class="z-max bg-contrast"
            v-if="!!link.dropdown && link.dropdown.length > 1"
          >
            <q-list>
              <div v-for="sub of link.dropdown" :key="sub.label">
                <q-item clickable v-close-popup @click="sub.click" :to="sub.to">
                  <q-item-section>
                    <q-item-label class="text-contrast">{{ sub.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-btn-dropdown>
          <div v-if="!!link.dropdown && link.dropdown.length == 1">
            <q-route-tab
              exact
              class="link-color"
              :to="sub.to"
              :label="sub.label"
              :key="sub.label"
              v-for="sub of link.dropdown"
            />
          </div>
        </div>
      </q-tabs>
    </q-toolbar>
    <q-drawer
      v-if="$q.screen.xs"
      v-model="showDrawer"
      :width="280"
      bordered
      class="bg-contrast z-max"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item>
            <q-item-section class="text-contrast text-h6">Cheese For Mice</q-item-section>
          </q-item>

          <q-separator />

          <div :key="link.label" v-for="link of [...links, ...rightLinks]">
            <q-item
              v-for="sub of link.dropdown || [link]"
              clickable
              v-ripple
              :key="sub.label"
              :to="sub.to"
              @click="sub.click"
            >
              <q-item-section avatar>
                <q-icon class="text-contrast" :name="sub.icon" />
              </q-item-section>
              <q-item-section class="text-contrast">{{ sub.label }}</q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </q-header>
</template>

<style lang="scss" scoped>
.link-color {
  color: #d5d5d5;
}
</style>

<script lang="ts">
import { mixins, Options } from "vue-property-decorator";
import { BasePlayer } from "src/api";
import Auth from "src/auth";
import { Images } from "src/common/mixins";
import { CEntitySearch } from ".";
import { AuthState } from "src/auth/interfaces";

interface Callable {
  (): void;
}

interface Link {
  label: string;
  icon?: string;
  to?: { name: string; params?: Record<string, string> };
  dropdown?: Link[];
  click?: Callable;
}

@Options({ components: { CEntitySearch } })
export default class AppHeader extends mixins(Images) {
  player?: void | BasePlayer;
  showDrawer = false;

  links: Link[] = [];
  rightLinks: Link[] = [];

  hook = -1;

  getLinks(): Link[] {
    const dropdown: Link[] = [];

    if (this.player && this.player.cfmRoles) {
      const hasDev = this.player.cfmRoles.includes("dev");
      const hasAdm = this.player.cfmRoles.includes("admin");
      const hasTra = this.player.cfmRoles.includes("translator");

      (hasDev || hasAdm || hasTra) &&
        dropdown.push({
          label: this.$t("translation"),
          icon: "admin_panel_settings",
          to: { name: "translation" },
        });
      (hasDev || hasAdm) &&
        dropdown.push({
          label: this.$t("adminPanel"),
          icon: "admin_panel_settings",
          to: { name: "adminPanel" },
        });
    }

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
      {
        label: this.$t("staffTools"),
        dropdown: dropdown,
      },
    ];
  }

  getRightLinks(): Link[] {
    if (!this.player) {
      return [
        {
          label: this.$t("login"),
          icon: "login",
          to: { name: "login" },
        },
      ];
    }

    return [
      {
        label: this.player.name,
        dropdown: [
          {
            label: this.$t("profile"),
            icon: "account_circle",
            to: { name: "player", params: { playerName: this.player.name } },
          },
          {
            label: this.$t("account"),
            icon: "settings",
            to: { name: "account" },
          },
          {
            label: this.$t("logout"),
            icon: "logout",
            click: () => Auth.authenticator.logout(),
          },
        ],
      },
    ];
  }

  onSearchTyped(content: string) {
    void this.$router.push({
      name: "player",
      params: { playerName: content },
    });
  }

  mounted() {
    this.links = this.getLinks();
    this.rightLinks = this.getRightLinks();

    this.hook = Auth.hook(
      {},
      {
        match: (state: AuthState) => {
          if (state.logged) {
            this.player = state.player;
          } else {
            this.player = undefined;
          }

          this.links = this.getLinks();
          this.rightLinks = this.getRightLinks();
        },
      },
      ["all"]
    );
  }

  unmounted() {
    Auth.unhook(this.hook);
  }
}
</script>
