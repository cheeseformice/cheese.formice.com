<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />
    <q-page-container>
      <notice-handler />
      <router-view v-slot="{ Component }">
        <!-- <keep-alive> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </router-view>
    </q-page-container>

    <!-- Empty space -->
    <div style="height: 25vh"></div>
    <app-footer />

    <cookie-notice />
  </q-layout>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppHeader from "src/components/AppHeader.vue";
import AppFooter from "src/components/AppFooter.vue";
import CookieNotice from "src/components/CookieNotice.vue";
import NoticeHandler from "src/components/NoticeHandler/component.vue";
import { controller } from "src/components/NoticeHandler/controller";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";

@Options({ components: { AppHeader, AppFooter, CookieNotice, NoticeHandler } })
export default class MainLayout extends Vue {
  hook = -1;

  showQualificationNotice(type: "disqualified" | "cantQualify") {
    const key = `notices.${type}`;
    const shown = window.sessionStorage.getItem(key) === "true";

    if (!shown) {
      controller.showNotice("error", key);
      window.sessionStorage.setItem(key, "true");
    }
  }

  mounted() {
    this.hook = Auth.hook(
      { logged: true },
      {
        match: (state: AuthState) => {
          if (!state.logged) {
            return;
          } // for the IDE

          if (state.disqualified) {
            this.showQualificationNotice("disqualified");
          } else if (!state.canQualify) {
            this.showQualificationNotice("cantQualify");
          }
        },
      },
      ["logged", "disqualified", "canQualify"]
    );
  }

  unmounted() {
    Auth.unhook(this.hook);
  }
}
</script>
