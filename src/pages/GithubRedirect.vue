<template>
  <q-page padding class="container q-pt-lg text-center">
    <img src="img/crow.png" />
    <br />
    <small v-html="$t('redirect', { open: `<a href='${redirect}'>`, close: '</a>' })"></small>
  </q-page>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class GithubRedirect extends Vue {
  redirectInterval?: number;
  redirect = "https://github.com/cheeseformice";

  mounted() {
    this.redirectInterval = window.setTimeout(() => {
      window.location.replace(this.redirect);
    }, 3000);
  }

  unmounted() {
    window.clearInterval(this.redirectInterval);
  }
}
</script>
