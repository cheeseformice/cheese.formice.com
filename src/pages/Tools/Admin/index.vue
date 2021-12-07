<template>
  <side-panel :sections="sections">
    <user-info />
  </side-panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import { SidePanel } from "../components";
import { UserInfo } from "./components";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";

@Options({
  components: { UserInfo, SidePanel },
})
export default class AdminPanel extends Vue {
  hook = -1;

  get sections() {
    return [
      {
        label: this.$t("adminPanel"),
        links: [
          {
            label: this.$t("stats"),
            to: { name: "home" },
          },
          {
            label: this.$t("rightsManagement"),
            to: { name: "adminPanel" },
          },
        ],
      },
    ];
  }

  mounted() {
    this.hook = Auth.hook(
      { player: { cfmRoles: ["admin", "dev"] } },
      {
        mismatch: (state: AuthState) => {
          if (!state.logged) {
            void this.$router.replace({ name: "login" });
          } else {
            void this.$router.replace({ name: "account" });
          }
        },
      },
      ["player.cfmRoles"]
    );
  }

  unmounted() {
    Auth.unhook(this.hook);
  }
}
</script>
