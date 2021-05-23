<template>
  <template v-if="!changelogsRaw">
    <div class="text-center q-pt-xl">
      <q-spinner color="secondary" size="5rem" :thickness="3" />
    </div>
  </template>
  <div v-show="changelogsRaw">
    <template v-if="!changelogs.length"> Changelogs Empty :( </template>
    <canvas class="q-mx-auto q-pb-lg" style="max-width: 800px" ref="canvas" />

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
            v-if="typeof value === 'number' && row[`${col.name}Increase`] !== 0"
            class="text-overline q-ml-sm"
            :class="row[`${col.name}Increase`] > 0 ? 'text-positive' : 'text-negative'"
          >
            {{ row[`${col.name}Increase`] }}<q-icon
              :name="row[`${col.name}Increase`] > 0 ? 'arrow_upward' : 'arrow_downward'"
              size="16px"
            />
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

import { TribeModule } from "src/store";

export default class Changelogs extends Vue {
  @Ref() readonly canvas!: HTMLCanvasElement;
  chart?: Chart;

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
    const tribeModule = getModule(TribeModule, this.$store);
    return tribeModule.changelogsRaw;
  }

  fillChangelogGap(
    logs: Record<string, number | string>[], name: string,
    start: number, end: number,
    value: number
  ) {
    for (let i = start; i > end; i--) {
      logs[i][name] = value;
      logs[i][`${name}Increase`] = 0;
    }
  }

  get changelogs() {
    const dates = this.changelogsRaw?.dates;
    const logs = this.changelogsRaw?.[this.type];
    if (!logs || !dates) return [];

    const normalizedLogs: Record<string, number | string>[] = [];
    for (let date of dates) {
      normalizedLogs.push({
        date: new Date(date).toLocaleString(),
      });
    }

    for (let key in logs) {
      if (key === "public") { continue; }

      const statName = key as keyof typeof logs;
      if (!this.tableCols[this.type].includes(statName)) {
        continue;
      }

      const statLogs = logs[statName];

      let expectedDateIndex = statLogs[ statLogs.length - 1 ][0];
      if (expectedDateIndex < dates.length - 1) {
        this.fillChangelogGap(
          normalizedLogs, statName,
          dates.length - 1, expectedDateIndex,
          0
        );
      }

      for (let i = statLogs.length - 1; i >= 0; i--) {
        const [dateIndex, stat] = statLogs[i];
        const lastValue = statLogs[i + 1]?.[1] || 0;

        if (typeof stat === "string" || typeof lastValue == "string") {
          continue;
        }
        
        if (dateIndex < expectedDateIndex) {
          this.fillChangelogGap(
            normalizedLogs, statName,
            expectedDateIndex, dateIndex,
            lastValue
          );
        }

        normalizedLogs[dateIndex][statName] = stat;
        if (i === statLogs.length - 1) {
          normalizedLogs[dateIndex][`${statName}Increase`] = 0;
        } else {
          normalizedLogs[dateIndex][`${statName}Increase`] = stat - lastValue;
        }
        expectedDateIndex = dateIndex - 1;
      }

      if (expectedDateIndex !== -1) {
        const value = statLogs[0][1];
        if (typeof value === "string") { continue; }

        this.fillChangelogGap(
          normalizedLogs, statName,
          expectedDateIndex, -1,
          value
        );
      }
    }

    return normalizedLogs;
  }

  createChart() {
    const ctx = this.canvas?.getContext("2d");
    if (!ctx || !this.changelogs.length) return;

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 0,
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

  mounted() {
    this.onChangelogsUpdate();
  }

  @Watch("changelogs")
  onChangelogsUpdate() {
    if (this.changelogs.length === 0) { return; }

    const changelogs = this.changelogs.slice().reverse();
    const keys: string[] = [];
    for (const [key, value] of Object.entries(changelogs[0])) {
      if (typeof value === "number" && !key.endsWith("Increase")) keys.push(key);
    }

    if (this.chart === undefined) {
      this.createChart();
      if (this.chart === undefined) { return; }
    }

    this.chart.data.labels = changelogs.map((c) => new Date(c.date).toLocaleDateString());
    this.chart.data.datasets = keys.map((k, i) => {
      return {
        label: k.charAt(0).toUpperCase() + k.slice(1),
        data: changelogs.map((c) => +c[k]),
        borderColor: this.chartColor[i],
        backgroundColor: chroma(this.chartColor[i]).alpha(0.2).hex(),
        borderWidth: 2,
      };
    });

    this.chart.update();
  }
}
</script>
