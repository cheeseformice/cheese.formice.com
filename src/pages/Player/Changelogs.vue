<template>
  <template v-if="!changelogsRaw">
    <div class="text-center q-pt-xl">
      <q-spinner color="secondary" size="5rem" :thickness="3" />
    </div>
  </template>
  <div v-show="changelogsRaw">
    <template v-if="!changelogs.length"> Changelogs Empty :( </template>
    <!-- <canvas class="q-mx-auto q-pb-lg" style="max-width: 800px" ref="chart" /> -->

    <q-table
      flat
      :rows="changelogs"
      :columns="tableColumns"
      row-key="name"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template #body-cell="{ value, col, row }">
        <q-td class="text-center">
          <span>{{ value }}</span>
          <span
            v-if="typeof value === 'number' && row[`${col.name}Increase`] > 0"
            class="text-positive text-overline q-ml-sm"
          >
            {{ row[`${col.name}Increase`] }}<q-icon name="upgrade" size="16px" />
          </span>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { QTable } from "quasar";
import { Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import Chart from "chart.js";
import chroma from "chroma-js";

import { PlayerModule } from "src/store";

export default class Changelogs extends Vue {
  @Ref() readonly chart!: HTMLCanvasElement;

  @Prop() type!: "racing" | "survivor" | "defilante" | "normal";

  chartColor = ["#E57373", "#81C784", "#64B5F6", "#FFF176"];

  tableCols = {
    normal: ["date", "rounds", "cheese", "first", "bootcamp"],
    racing: ["date", "rounds", "finished", "podium", "first"],
    survivor: ["date", "rounds", "killed", "shaman", "survivor"],
    defilante: ["date", "rounds", "finished", "points"],
  } as const;

  get tableColumns(): QTable["columns"] {
    return this.tableCols[this.type].map((c: string) => {
      return {
        name: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
        field: c,
        align: "center",
      };
    });
  }

  get changelogsRaw() {
    const playerModule = getModule(PlayerModule, this.$store);
    return playerModule.changelogsRaw;
  }

  get changelogs() {
    const logs = this.changelogsRaw?.[this.type];
    if (!logs) return [];

    return Array.from(Array(this.changelogsRaw?.dates.length).keys()).map((i) => {
      const obj: Record<string, number | string> = {};
      for (const key of Object.keys(logs)) {
        const k = key as keyof typeof logs;
        if (!Array.isArray(logs[k])) continue;
        const value = logs[k][i][1];
        obj[k] = value;
        if (typeof value === "number") obj[`${key}Increase`] = value - +logs[k][i + 1]?.[1] || 0;
      }
      obj.date = new Date(this.changelogsRaw?.dates[i] || "").toLocaleString();
      return obj;
    });
  }

  @Watch("changelogs")
  onChangelogsUpdate() {
    const ctx = this.chart?.getContext("2d");
    if (!ctx || !this.changelogs.length) return;

    const changelogs = this.changelogs.slice().reverse();
    const keys: string[] = [];
    for (const [key, value] of Object.entries(changelogs[0])) {
      if (typeof value === "number" && !key.endsWith("Increase")) keys.push(key);
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: changelogs.map((c) => new Date(c.date).toLocaleDateString()),
        datasets: keys.map((k, i) => {
          return {
            label: k.charAt(0).toUpperCase() + k.slice(1),
            data: changelogs.map((c) => +c[k]),
            borderColor: this.chartColor[i],
            backgroundColor: chroma(this.chartColor[i]).alpha(0.2).hex(),
            borderWidth: 2,
          };
        }),
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                stepSize: 1,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }
}
</script>
