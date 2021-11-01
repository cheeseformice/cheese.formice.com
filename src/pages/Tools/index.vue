<template>
  <q-page>
    <router-view v-slot="{ Component }">
      <!-- <keep-alive> -->
      <component :is="Component" />
      <!-- </keep-alive> -->
    </router-view>
  </q-page>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default class Tools extends Vue {
  mounted() {
    if (this.$route.name == "tools") {
      // if no tool is selected, go back to home
      void this.$router.push({ name: "home" });
      return;
    }
  }
}
</script>
