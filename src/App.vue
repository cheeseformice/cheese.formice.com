<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import Auth from "./auth";
import { AuthState } from "./auth/interfaces";
import { controller } from "src/components/NoticeHandler/controller";

export default class App extends Vue {
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

  async useTicket(ticket: string) {
    const response = await Auth.authenticator.useTicket(ticket);

    if (!response.hasPassword && response.success) {
      controller.showNotice("info", "notices.missingPassword");
    }
  }

  mounted() {
    this.$dark.enabled = window.localStorage.getItem("dark") === "true";

    const body = document.getElementById("cfm-body") as HTMLBodyElement;
    body.setAttribute("theme", this.$dark.enabled ? "dark" : "light");

    const url = new URL(document.location.href);
    const params = url.searchParams;

    if (params.has("ticket")) {
      const ticket = params.get("ticket") as string;
      params.delete("ticket");

      window.history.replaceState(null, "CFM", url.toString());

      if (!ticket) {
        return;
      }

      Auth.hook(
        {},
        {
          hook: (state: AuthState) => {
            if (state.logged) {
              Auth.authenticator.logout();
            }

            void this.useTicket(ticket);
            Auth.unhook();
          },
        },
        []
      );
    }
  }
}
</script>
