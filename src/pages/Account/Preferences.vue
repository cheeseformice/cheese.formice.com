<template>
  <h5 class="q-my-none">{{ $t("preferences") }}</h5>
  <q-separator spaced />

  <div class="row items-center">
    <q-toggle v-model="darkTheme" color="secondary" />
    {{ $t("darkTheme") }}
  </div>
</template>

<script lang="ts">
import { Watch, Vue } from "vue-property-decorator";

export default class AccountPreferences extends Vue {
  darkTheme = false;

  mounted() {
    this.darkTheme = this.$dark.enabled;
  }

  @Watch("darkTheme")
  onThemeChange() {
    window.localStorage.setItem("dark", this.darkTheme ? "true" : "false");

    this.$dark.enabled = this.darkTheme;
    const body = document.getElementById("cfm-body") as HTMLBodyElement;
    body.setAttribute("theme", this.$dark.enabled ? "dark" : "light");
  }
}
</script>
