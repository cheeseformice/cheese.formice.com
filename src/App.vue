<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { AuthService } from "./api";

export default class App extends Vue {
  async useTicket(ticket: string, url: URL) {
    const token = await AuthService.getSessionToken();
    if (typeof token === "string") {
      return;
    } // already logged in

    await AuthService.useTicket(ticket);
    document.location.replace(url.toString());
  }

  created() {
    this.$q.iconMapFn = (iconName) => {
      if (iconName.startsWith("mdi:") === true) {
        const name = iconName.substring(4);

        return {
          cls: `mdi mdi-${name}`,
        };
      }
    };
  }

  mounted() {
    if (window.localStorage.getItem("login-beta") !== "true") {
      return;
    }

    const url = new URL(document.location.href);
    const params = url.searchParams;

    if (params.has("ticket")) {
      const ticket = params.get("ticket") as string;
      params.delete("ticket");

      void this.useTicket(ticket, url);
    }
  }
}
</script>
