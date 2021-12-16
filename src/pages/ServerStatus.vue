<template>
  <q-page padding class="container q-pt-lg text-center">
    <current-server-status :services="services" :startHidden="true" />

    <div v-for="property in properties" :key="property" class="col-12 q-my-lg">
      <q-card flat bordered class="bg-contrast">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">{{ $t(`chart.${property}`) }}</q-item-label>
            <q-item-label>
              <canvas
                class="q-mx-auto q-pb-lg"
                style="max-width: 800px"
                :ref="`${property}Canvas`"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Chart from "chart.js";
import chroma from "chroma-js";
import { CurrentServerStatus } from "src/components";
import { HealthcheckReport, HealthcheckService, HealthcheckProperty } from "src/api";
import { Vue, Ref, Options } from "vue-property-decorator";

function isSingleReport(
  input: HealthcheckReport | HealthcheckReport[]
): input is HealthcheckReport {
  return input.length === undefined;
}

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateChartLabels(interval: number, amount: number): Date[] {
  const labels: Date[] = [];
  let date: number = Date.now();
  // this returns the last minute that is a multiple of the interval
  date -= date % (interval * 30000);
  for (let index = 0; index < amount; index++) {
    labels.unshift(new Date(date));
    date -= interval * 30000;
  }

  return labels;
}

function generateAverage(
  services: string[],
  property: HealthcheckProperty,
  reports: HealthcheckReport[]
): number[] {
  return reports.map((report) => {
    let count = 0,
      total = 0;

    for (let service of services) {
      const serviceReport = report[service];
      if (serviceReport === null) {
        continue;
      }

      count += 1;
      total += serviceReport[property];
    }

    return Math.ceil(total / count);
  });
}

function generateSum(
  services: string[],
  property: HealthcheckProperty,
  reports: HealthcheckReport[]
): number[] {
  return reports.map((report) => {
    let total = 0;

    for (let service of services) {
      const serviceReport = report[service];
      if (serviceReport === null) {
        continue;
      }

      total += serviceReport[property];
    }

    return total;
  });
}

@Options({ components: { CurrentServerStatus } })
export default class ServerStatus extends Vue {
  @Ref() readonly pingCanvas!: HTMLCanvasElement;
  @Ref() readonly successCanvas!: HTMLCanvasElement;
  @Ref() readonly errorsCanvas!: HTMLCanvasElement;

  charts: Partial<Record<HealthcheckProperty, Chart>> = {};

  // A report is received every ~30 seconds
  // interval of 10 reports, so 5 minutes per interval
  interval = 10;
  maxReports = (24 * 60 * 60) / (this.interval * 30);

  websocketListener?: number;
  services: string[] = [];
  generalColor = "#003F5C";
  chartColor: Record<string, string> = {};
  forInterval: HealthcheckReport[] = [];

  get properties(): HealthcheckProperty[] {
    return ["ping", "success", "errors"];
  }

  createChart(canvas: HTMLCanvasElement, generalName: string, suggestedMax?: number): Chart {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't get canvas context");
    }

    let chart: Chart;
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: capitalize(generalName),
            hidden: canvas === this.successCanvas,
            data: [],
            borderColor: this.generalColor,
            backgroundColor: chroma(this.generalColor).alpha(0.2).hex(),
            borderWidth: 2,
          },
          ...Object.keys(this.chartColor).map((service) => ({
            label: capitalize(service),
            data: [],
            hidden: canvas === this.successCanvas && service === "lookup",
            borderColor: this.chartColor[service],
            backgroundColor: chroma(this.chartColor[service]).alpha(0.2).hex(),
            borderWidth: 2,
          })),
        ],
      },
      options: {
        onResize: (newSize) => {
          chart.options.legend!.display = newSize.width >= 700;
          chart.update();
        },
        legend: {
          display: canvas.width >= 700,
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "index",
          intersect: false,
        },
        aspectRatio: 4,
        scales: {
          yAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 5,
                suggestedMax,
                suggestedMin: 0,
                precision: 0,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  hour: "HH:mm",
                },
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        elements: {
          line: {
            tension: 0,
            fill: false,
          },
          point: {
            radius: 0,
          },
        },
      },
    });
    return chart;
  }

  updateChart(name: HealthcheckProperty, reports: HealthcheckReport[]) {
    const chart: Chart = this.charts[name]!;

    const labels: Date[] = generateChartLabels(this.interval, reports.length);
    let general: number[], generalName: string;
    if (name === "ping") {
      general = generateAverage(this.services, name, reports);
      generalName = "average";
    } else {
      general = generateSum(this.services, name, reports);
      generalName = "total";
    }

    const chartLabels = chart.data.labels!;
    chartLabels.splice(chartLabels.length, 0, ...labels);
    if (chartLabels.length > this.maxReports) {
      chartLabels.splice(0, chartLabels.length - this.maxReports);
    }

    chart.data.datasets?.forEach((dataset) => {
      const data = dataset.data!;
      const label = dataset.label!.toLowerCase();

      if (label === generalName) {
        data.splice(data.length, 0, ...general);
      } else {
        data.splice(data.length, 0, ...reports.map((report) => report[label]?.[name] || 0));
      }

      if (data.length > this.maxReports) {
        data.splice(0, data.length - this.maxReports);
      }
    });

    chart.options.legend!.display = (chart.canvas?.width || 0) >= 700;
    chart.update();
  }

  updateCharts(input: HealthcheckReport | HealthcheckReport[]) {
    let reports: HealthcheckReport[];
    if (isSingleReport(input)) {
      reports = [input];
    } else {
      reports = input;
    }

    for (let name of Object.keys(this.charts)) {
      this.updateChart(name as HealthcheckProperty, reports);
    }
  }

  mergeReports(reports: HealthcheckReport[]): HealthcheckReport {
    const merged: HealthcheckReport = {};

    for (let service of this.services) {
      let count = 0,
        ping = 0,
        success = 0,
        errors = 0;

      for (let report of reports) {
        const serviceReport = report[service];
        if (serviceReport === null) {
          continue;
        }

        count += 1;
        ping += serviceReport.ping;
        success += serviceReport.success;
        errors += serviceReport.errors;
      }

      merged[service] = {
        ping: ping / count,
        success,
        errors,
      };
    }

    return merged;
  }

  processHealthcheckReport(report: HealthcheckReport) {
    this.forInterval.push(report);

    if (this.forInterval.length < this.interval) {
      // Not enough data for the interval
      return;
    }

    this.updateCharts(this.mergeReports(this.forInterval.splice(0, this.interval)));
  }

  mounted() {
    void this.fetchReports();
  }

  unmounted() {
    if (this.websocketListener) {
      // ids start at 1, so no problem in checking as a bool
      HealthcheckService.removeListener(this.websocketListener);
      this.websocketListener = undefined;
    }
  }

  async fetchReports() {
    const reports = await HealthcheckService.getPastReports(this.interval / 10);

    this.services = reports.services;
    this.forInterval = reports.forInterval;

    this.chartColor = {};
    const colors = chroma.scale(["#374C80", "#FFA600"]).mode("lch").colors(reports.services.length);
    for (let i = 0; i < reports.services.length; i++) {
      // Assign a color for each service
      this.chartColor[reports.services[i]] = colors[i];
    }

    this.charts = {
      ping: this.createChart(this.pingCanvas, "average", 50),
      success: this.createChart(this.successCanvas, "total"),
      errors: this.createChart(this.errorsCanvas, "total"),
    };
    this.updateCharts(reports.data);

    if (!this.websocketListener) {
      this.websocketListener = HealthcheckService.addListener(
        this.processHealthcheckReport.bind(this)
      );
    }
  }
}
</script>
