<template>
  <q-page padding class="container q-pt-lg text-center">
    <img src="img/crow.png" />
    <br />
    <small> If you are not being redirected, <a :href="redirect">click here</a> </small>
  </q-page>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class GithubRedirect extends Vue {
  redirectInterval?: number;

  get redirect() {
    return "https://github.com/cheeseformice";
  }

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
