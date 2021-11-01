<template>
  <q-page class="container text-center q-py-md">
    <div class="row q-col-gutter-md">
      <div class="col-3">
        <c-link-section
          v-for="section in links"
          :key="section.key"
          :label="section.label"
          :links="section.links"
        />
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

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import { CLinkSection } from "src/components";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";

@Options({
  components: { CLinkSection },
})
export default class Account extends Vue {
  hook = -1;

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

    return [overview, settings];
  }

  mounted() {
    this.hook = Auth.hook({ logged: true }, {
      mismatch: () => {
        void this.$router.push({ name: "login" });
        Auth.unhook();
      },
      match: (state: AuthState) => {
        if (!state.logged) { return; } // for the IDE

        if (this.$route.name === "account") {
          void this.$router.replace({ name: "accountProfile" });
        }
      },
    }, ["all"]);
  }

  unmounted() {
    Auth.unhook(this.hook);
  }
}
</script>
