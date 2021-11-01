<template>
  <side-panel :sections="sections">
    <sanction-info />
  </side-panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import { SidePanel } from "../components";
import { SanctionInfo } from "./components";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";

@Options({
  components: { SanctionInfo, SidePanel },
})
export default class ModPanel extends Vue {
  hook = -1;

  get sections() {
    return [
      {
        label: this.$t("modPanel"),
        links: [
          {
            label: this.$t("sanctions"),
            to: { name: "modPanel" },
          },
        ],
      },
    ];
  }

  mounted() {
    this.hook = Auth.hook({ player: { cfmRoles: ["mod", "admin", "dev"] } }, {
      mismatch: (state: AuthState) => {
        if (!state.logged) {
          void this.$router.replace({ name: "login" });
        } else {
          void this.$router.replace({ name: "accountProfile" });
        }
      }
    }, ["player.cfmRoles"]);
  }

  unmounted() {
    Auth.unhook(this.hook);
  }
}
</script>
