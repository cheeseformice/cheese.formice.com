<template>
  <q-page padding class="container q-pt-lg text-center">
    <div class="row">
      <q-card flat bordered class="col-12">
        <q-item clickable @click="dropdown(servicesDropdown)">
          <q-item-section>
            <q-item-label class="text-left text-h6">
              <div class="row">
                <div class="col-auto">
                  API services
                </div>
                <div class="col">
                  <q-icon name="help_outline" color="primary" size="1rem" class="q-ml-sm">
                    <q-tooltip anchor="top middle" content-style="font-size: 1rem;" self="center middle">
                      {{ $t("help.api") }}
                    </q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label
              class="text-right"
              :class="statusClass[ apiStatus ]"
            >
              {{ $t(`status.${apiStatus}`) }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <div ref="servicesDropdown" class="hidden">
          <q-item
            v-for="service in services"
            :key="service"
          >
            <q-item-section class="q-pl-md text-left">
              <div class="row">
                <div class="col-auto">
                  {{ capitalize(service) }}
                </div>
                <div class="col" v-if="$te(`help.${service}`)">
                  <q-icon name="help_outline" color="primary" size="1em" class="q-ml-sm">
                    <q-tooltip anchor="top middle" content-style="font-size: 1rem;" self="center middle">
                      {{ $t(`help.${service}`) }}
                    </q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label
                class="text-right"
                :class="statusClass[ status[service] ]"
              >
                {{ $t(`status.${status[service]}`) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card>
    </div>

    <div
      v-for="property in properties"
      :key="property"
      class="col-12 q-my-lg"
    >
      <q-card flat bordered>
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
import { HealthcheckReport, HealthcheckService, HealthcheckProperty } from "src/api";
import { Vue, Ref } from "vue-property-decorator";

type ServiceStatus = "operational" | "partialOutage" | "majorOutage";

function isSingleReport(input: HealthcheckReport | HealthcheckReport[]): input is HealthcheckReport {
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
      if (serviceReport === null) { continue; }

      count += 1;
      total += serviceReport[property];
    }

    return Math.ceil(total / count);
  });
}

function generateSum(
  services: string[],
  property: HealthcheckProperty,
  reports: HealthcheckReport[],
): number[] {
  return reports.map((report) => {
    let total = 0;

    for (let service of services)  {
      const serviceReport = report[service];
      if (serviceReport === null) { continue; }

      total += serviceReport[property];
    }

    return total;
  });
}

export default class ServerStatus extends Vue {
  @Ref() readonly servicesDropdown!: HTMLDivElement;

  @Ref() readonly pingCanvas!: HTMLCanvasElement;
  @Ref() readonly successCanvas!: HTMLCanvasElement;
  @Ref() readonly errorsCanvas!: HTMLCanvasElement;

  charts: Partial<Record<HealthcheckProperty, Chart>> = {};

  // A report is received every ~30 seconds
  // interval of 10 reports, so 5 minutes per interval
  interval = 10;
  maxReports = 24 * 60 * 60 / (this.interval * 30);

  statusClass: Record<ServiceStatus, string> = {
    "operational": "text-positive",
    "partialOutage": "text-warning",
    "majorOutage": "text-negative",
  };

  services: string[] = [];
  status: Record<string, ServiceStatus> = {};
  generalColor = "#003F5C";
  chartColor: Record<string, string> = {};
  forInterval: HealthcheckReport[] = [];

  get properties(): HealthcheckProperty[] {
    return ["ping", "success", "errors"];
  }

  get apiStatus(): ServiceStatus {
    let partial = 0,
        major = 0;

    for (let service of this.services) {
      const serviceStatus = this.status[service];

      if (serviceStatus === "partialOutage") {
        partial += 1;
      } else if (serviceStatus === "majorOutage") {
        major += 1;
      }
    }

    if (major === 0) {
      if (partial === 0) {
        return "operational";
      }
      return "partialOutage";
    }
    return "majorOutage";
  }

  writeAPIStatus(status: HealthcheckReport) {
    this.status = {};
    for (let service of this.services) {
      const serviceStatus = status[service];

      if (serviceStatus === null) {
        this.status[service] = "majorOutage";
      } else {
        this.status[service] = "operational";
      }
    }
  }

  dropdown(element: HTMLDivElement) {
    element.classList.toggle("hidden");
  }

  capitalize(name: string): string {
    return capitalize(name);
  }

  createChart(canvas: HTMLCanvasElement, generalName: string, suggestedMax?: number): Chart {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't get canvas context")
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
          }))
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
          intersect: false
        },
        hover: {
          mode: "index",
          intersect: false
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
                  hour: "HH:mm"
                }
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
            radius: 0
          },
        },
      },
    });
    return chart;
  }

  updateChart(name: HealthcheckProperty, reports: HealthcheckReport[]) {
    const chart: Chart = this.charts[name]!;

    const labels: Date[] = generateChartLabels(this.interval, reports.length);
    let general: number[],
        generalName: string;
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
        if (serviceReport === null) { continue; }

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
    this.writeAPIStatus(report);
    this.forInterval.push(report);

    if (this.forInterval.length < this.interval) {
      // Not enough data for the interval
      return;
    }

    this.updateCharts(
      this.mergeReports(this.forInterval.splice(0, this.interval))
    );
  }

  mounted() {
    void this.fetchReports();
  }

  unmounted() {
    if (HealthcheckService.listening) {
      HealthcheckService.stopListening();
    }
  }

  async fetchReports() {
    const status = await HealthcheckService.getCurrentStatus();
    const reports = await HealthcheckService.getPastReports(this.interval / 10);

    this.services = reports.services;
    this.forInterval = reports.forInterval;

    this.writeAPIStatus(status);

    this.chartColor = {};
    const colors = chroma.scale(["#374C80", "#FFA600"])
                          .mode("lch")
                          .colors(reports.services.length);
    for (let i = 0; i < reports.services.length; i++) {
      // Assign a color for each service
      this.chartColor[ reports.services[i] ] = colors[i];
    }

    this.charts = {
      ping: this.createChart(this.pingCanvas, "average", 50),
      success: this.createChart(this.successCanvas, "total", 50),
      errors: this.createChart(this.errorsCanvas, "total", 50),
    }
    this.updateCharts(reports.data);

    if (!HealthcheckService.listening) {
      HealthcheckService.listenReports(
        this.processHealthcheckReport.bind(this)
      );
    }
  }
}
</script>