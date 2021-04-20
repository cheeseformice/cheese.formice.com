<template>
  <q-page class="container q-pt-md">
    <div class="text-center text-h4">Leaderboard</div>

    <q-separator spaced />

    <div class="row items-center q-gutter-y-md">
      <div class="col-12 col-md-6">
        <q-tabs v-model="tab" align="left" class="text-secondary">
          <q-tab name="player" icon="mail" label="player" />
          <q-tab name="tribe" icon="alarm" label="tribe" />
        </q-tabs>
      </div>
      <div class="col-12 col-md-6">
        <div class="float-right">
          <q-select
            outlined
            v-model="option"
            :options="options"
            label="Something"
            class="leaderboard-selector"
          />
        </div>
      </div>
    </div>

    <q-table flat :rows="[]" :columns="columns" class="q-mt-lg" />
  </q-page>
</template>

<script lang="ts">
import { QTable } from "quasar";
import { Vue } from "vue-class-component";

export default class Leaderboard extends Vue {
  tab = "player";
  option = {
    label: "Racing",
    value: "racing",
  };

  columns: QTable["columns"] = [
    {
      name: "rank",
      label: "Rank",
      field: "rank",
      align: "center",
    },
    {
      name: "name",
      label: "Name",
      field: "name",
      align: "center",
    },
    {
      name: "value",
      label: "Value",
      field: "value",
      align: "center",
    },
  ];

  get options() {
    return [
      {
        label: "Racing",
        value: "racing",
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: $breakpoint-md-min) {
  .leaderboard-selector {
    min-width: 300px;
  }
}
</style>
