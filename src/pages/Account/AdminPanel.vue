<template>
  <user-info />
</template>

<script lang="ts">
import { AuthService, NullSessionToken, SessionToken } from "src/api";
import { Options, Vue } from "vue-property-decorator";
import { UserInfo } from "./admin";

@Options({
  components: { UserInfo },
})
export default class AdminPanel extends Vue {
  session: SessionToken = NullSessionToken;

  async mounted() {
    const session = await AuthService.getSession();
    if (!session) {
      await this.$router.push({ name: "login" });
      return;
    }

    this.session = session;

    const isAdm = this.session.cfmRoles.includes("admin");
    const isDev = this.session.cfmRoles.includes("dev");

    if (!isAdm && !isDev) {
      await this.$router.push({ name: "accountProfile" });
      return;
    }
  }
}
</script>
