<template>
  <q-page padding class="container q-pt-lg text-center">
    <img src="img/crow.png" />
    <br />
    <small>
      If you are not being redirected, <a :href="redirect">click here</a>
    </small>
  </q-page>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class GithubRedirect extends Vue {
  get redirect() {
    return "https://github.com/cheeseformice";
  }

  mounted() {
    window.setTimeout(() => {
      window.location.replace(this.redirect);
    }, 3000);
  }
}
</script>