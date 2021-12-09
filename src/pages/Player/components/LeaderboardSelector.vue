<template>
  <q-list>
    <q-item
      clickable
      v-close-popup
      class="q-pa-sm"
      style="min-height: auto"
      v-for="type in lbTypes"
      :key="type"
      @click="callback(type)"
    >
      <q-item-section>
        <q-item-label>{{ $t(`sorts.${type}`) }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
import { LeaderboardType, leaderboardTypes } from "src/api";

interface Callback {
  (type: LeaderboardType): void;
}

export default class LeaderboardSelector extends Vue {
  @Prop() callback!: Callback;

  lbTypes = leaderboardTypes;
}
</script>
