<template>
  <q-page class="container text-center q-py-md">
    <div class="row q-col-gutter-md">
      <div class="col-3">
        <c-link-section
          v-for="section in links"
          :key="section.key"
          :label="section.label"
          :links="section.links"
          :dark="$q.dark.isActive"
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
          label: this.$t("progress"),
          to: { name: "accountProgress" },
        },
        {
          label: this.$t("privacySettings"),
          to: { name: "accountPrivacy" },
        },
        {
          label: this.$t("changePassword"),
          to: { name: "accountPassword" },
        },
      ],
    };

    return [overview];
  }

  mounted() {
    this.hook = Auth.hook(
      { logged: true },
      {
        mismatch: () => {
          void this.$router.push({ name: "login" });
          Auth.unhook();
        },
        match: (state: AuthState) => {
          if (!state.logged) {
            return;
          } // for the IDE

          if (this.$route.name === "account") {
            void this.$router.replace({ name: "accountProgress" });
          }
        },
      },
      ["all"]
    );
  }

  unmounted() {
    Auth.unhook(this.hook);
  }
}
</script>
