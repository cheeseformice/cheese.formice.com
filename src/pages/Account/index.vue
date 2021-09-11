<template>
  <q-page class="container text-center q-py-md">
    <div class="row q-col-gutter-md">
      <div class="col-3">
        <q-card
          v-for="section in links"
          :key="section.key"
          flat
          bordered
          class="q-py-none q-mb-sm text-left"
        >
          <div v-if="!!section.label">
            <q-card-section class="q-py-sm q-px-md">
              <b>{{ section.label }}</b>
            </q-card-section>
            <q-separator />
          </div>
          <div
            v-for="(link, idx) in section.links"
            :key="link.label"
            :style="$route.name === link.to.name ? '' : 'cursor: pointer;'"
            @click="$route.name === link.to.name ? '' : redirect(link.to)"
          >
            <q-card-section class="q-py-sm q-px-md">
              <div class="page-selector" v-if="$route.name === link.to.name"></div>
              {{ link.label }}
            </q-card-section>
            <q-separator v-if="idx < section.links.length - 1" />
          </div>
        </q-card>
      </div>

      <div class="container col-9 q-ml-md text-left">
        <router-view v-slot="{ Component }">
          <!-- <keep-alive> -->
          <component :is="Component" />
          <!-- </keep-alive> -->
        </router-view>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.page-selector {
  position: absolute;
  height: 100%;
  width: 3px;
  background-color: $secondary;
  left: 0px;
  top: 0;
}
</style>

<script lang="ts">
import { AuthService, NullPlayer, Player, NullSessionToken, SessionToken } from "src/api";
import { Vue } from "vue-property-decorator";

export default class Account extends Vue {
  player: Player = NullPlayer;
  session: SessionToken = NullSessionToken;

  get links() {
    const overview = {
      key: "overview",
      label: this.$t("accountOverview"),
      links: [
        {
          label: this.$t("profile"),
          to: { name: "accountProfile" },
        },
        {
          label: this.$t("progress"),
          to: { name: "accountProgress" },
        },
        {
          label: this.$t("stats"),
          to: { name: "accountStats" },
        },
        {
          label: this.$t("sanctions"),
          to: { name: "accountSanctions" },
        },
      ],
    };
    const settings = {
      key: "settings",
      label: this.$t("accountSettings"),
      links: [
        {
          label: this.$t("preferences"),
          to: { name: "accountPreferences" },
        },
        {
          label: this.$t("privacySettings"),
          to: { name: "accountPrivacy" },
        },
      ],
    };
    const privileged = {
      key: "privileged",
      label: "",
      links: [
        {
          label: this.$t("devPanel"),
          to: { name: "devPanel" },
        },
        // {
        //   label: this.$t("myModules"),
        //   to: { name: "accountModules" },
        // },
      ],
    };

    const isMod = this.session.cfmRoles.includes("mod");
    const isAdm = this.session.cfmRoles.includes("admin");
    const isDev = this.session.cfmRoles.includes("dev")

    if (isMod || isAdm || isDev) {
      privileged.links.push({
        label: this.$t("modPanel"),
        to: { name: "modPanel" },
      });
    }
    if (isAdm || isDev) {
      privileged.links.push({
        label: this.$t("adminPanel"),
        to: { name: "adminPanel" },
      });
    }

    return [
      overview,
      settings,
      privileged,
    ];
  }

  async redirect(to: Record<string, string>) {
    await this.$router.push(to);
  }

  async redirectIfNecessary() {
    const player = await AuthService.getPlayerInfo();
    if (!player) {
      await this.$router.push({ name: "login" });
      return;
    }

    const session = await AuthService.getSession();
    if (!session) { return; }

    this.player = player;
    this.session = session;

    if (this.$route.name === "account") {
      await this.$router.push({ name: "accountProfile" });
      return;
    }
  }

  mounted() {
    void this.redirectIfNecessary();
  }
}
</script>
