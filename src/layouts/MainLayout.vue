<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />
    <q-page-container>
      <router-view v-slot="{ Component }">
        <!-- <keep-alive> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </router-view>
    </q-page-container>

    <!-- Empty space -->
    <div style="height: 25vh"></div>
  </q-layout>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppHeader from "src/components/AppHeader.vue";

@Options({ components: { AppHeader } })
export default class MainLayout extends Vue {}
</script>
