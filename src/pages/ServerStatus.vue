<template>
  <q-page padding class="container q-pt-lg text-center">
    <canvas class="q-mx-auto q-pb-lg" style="max-width: 800px" ref="pingChart" />
    <canvas class="q-mx-auto q-pb-lg" style="max-width: 800px" ref="successChart" />
    <canvas class="q-mx-auto q-pb-lg" style="max-width: 800px" ref="errorChart" />
  </q-page>
</template>

<script lang="ts">
import Chart from "chart.js";
import chroma from "chroma-js";
import { HealthcheckReport, HealthcheckService, HealthcheckProperty } from "src/api";
import { Vue, Ref } from "vue-property-decorator";

export default class ServerStatus extends Vue {
  @Ref() readonly pingChart!: HTMLCanvasElement;
  @Ref() readonly successChart!: HTMLCanvasElement;
  @Ref() readonly errorChart!: HTMLCanvasElement;

  // A report is received every ~30 seconds
  // interval of 10 reports, so 5 minutes per interval
  interval = 10;
  services: string[] = [];
  chartColor: Record<string, string> = {};
  reports: HealthcheckReport[] = [];
  forInterval: HealthcheckReport[] = [];

  drawChart(
    property: HealthcheckProperty,
    chart: HTMLCanvasElement,
    max?: number,
  ) {
    const ctx = chart?.getContext("2d");
    if (!ctx) return;

    const labels = [];
    let date: number = Date.now();
    for (let index = this.reports.length - 1; index >= 0; index--) {
      date -= this.interval * 30000;
      labels.unshift(new Date(date).toLocaleString());
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: Object.keys(this.chartColor).map((service) => {
          return {
            label: service.charAt(0).toUpperCase() + service.slice(1),
            data: this.reports.map((report) => report[service]?.[property] || 0),
            borderColor: this.chartColor[service],
            backgroundColor: chroma(this.chartColor[service]).alpha(0.2).hex(),
            borderWidth: 2,
          };
        }),
      },
      options: {
        aspectRatio: 4,
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMax: max,
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
              gridLines: {
                display: false,
              },
            },
          ],
        },
        elements: {
          line: {
            tension: 0,
          },
        },
      },
    });
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
    this.forInterval.push(report);

    if (this.forInterval.length < this.interval) {
      // Not enough data for the interval
      return;
    }

    this.reports.push(this.mergeReports(this.forInterval.splice(0, this.interval)));

    // Up to last 24 hours of data
    const maxReports = 24 * 60 * 60 / (this.interval * 30);
    if (this.reports.length > maxReports) {
      this.reports.splice(0, this.reports.length - maxReports);
    }

    this.drawCharts();
  }

  drawCharts() {
    this.drawChart("ping", this.pingChart, 50);
    this.drawChart("success", this.successChart);
    this.drawChart("errors", this.errorChart);
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
    const reports = await HealthcheckService.getPastReports(this.interval / 10);
    this.services = reports.services;
    this.reports = reports.data;
    this.forInterval = reports.forInterval;

    this.chartColor = {};
    const colors = chroma.scale(["#003F5C", "#FFA600"])
                          .mode("lch")
                          .colors(reports.services.length);
    for (let i = 0; i < reports.services.length; i++) {
      // Assign a color for each service
      this.chartColor[ reports.services[i] ] = colors[i];
    }
    
    this.drawCharts();

    if (!HealthcheckService.listening) {
      HealthcheckService.listenReports(
        this.processHealthcheckReport.bind(this)
      );
    }
  }
}
</script>