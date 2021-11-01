<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import Auth from "./auth";
import { AuthState } from "./auth/interfaces";

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

  mounted() {
    const url = new URL(document.location.href);
    const params = url.searchParams;

    if (params.has("ticket")) {
      const ticket = params.get("ticket") as string;
      params.delete("ticket");

      window.history.replaceState(null, "CFM", url.toString());

      if (!ticket || window.localStorage.getItem("login-beta") !== "true") {
        return;
      }

      Auth.hook({}, {
        hook: (state: AuthState) => {
          if (!state.logged) {
            void Auth.authenticator.useTicket(ticket);
          }
          Auth.unhook();
        }
      }, []);
    }
  }
}
</script>
