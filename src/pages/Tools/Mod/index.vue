<template>
  <sanction-info />
</template>

<script lang="ts">
import { AuthService, NullSessionToken, SessionToken } from "src/api";
import { Options, Vue } from "vue-property-decorator";
import { SanctionInfo } from "./components";

@Options({
  components: { SanctionInfo },
})
export default class ModPanel extends Vue {
  session: SessionToken = NullSessionToken;

  async mounted() {
    const session = await AuthService.getSession();
    if (!session) {
      await this.$router.push({ name: "login" });
      return;
    }

    this.session = session;

    const isMod = this.session.cfmRoles.includes("mod");
    const isAdm = this.session.cfmRoles.includes("admin");
    const isDev = this.session.cfmRoles.includes("dev");

    if (!isMod && !isAdm && !isDev) {
      await this.$router.push({ name: "accountProfile" });
      return;
    }
  }
}
</script>
