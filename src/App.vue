<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { AuthService } from "./api";

export default class App extends Vue {
  async useTicket(ticket: string) {
    const token = await AuthService.getSessionToken();
    if (typeof token === "string") { return; } // already logged in

    await AuthService.useTicket(ticket);
  }

  mounted() {
    const url = new URL(document.location.href);
    const params = url.searchParams;

    if (params.has("ticket")) {
      const ticket = params.get("ticket") as string;
      params.delete("ticket");

      document.location.replace(url.toString());
      void this.useTicket(ticket);
    }
  }
}
</script>
